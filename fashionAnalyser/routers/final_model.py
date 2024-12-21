from fastapi import FastAPI, File, Form, UploadFile, HTTPException, APIRouter, Depends
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import cv2
from typing import List
from routers.userLogin import secure_protection
from ml_models.dominant_color_model import DominantColorModel
from scipy.spatial import distance
from matplotlib import colors
from skimage import color
import tensorflow as tf
import io
from pydantic import BaseModel
from typing import Optional
from routers.database import getDB
from bson import ObjectId
import gridfs
from io import BytesIO
from routers.selenium_call import search_dresses

router = APIRouter()

dominant_color_model = DominantColorModel()


# Load the trained model (load it once when the router is initialized)
model = tf.keras.models.load_model('C:\\My Documents\\College\\Projects\\7th sem\\fastapivenv\\fashionAnalyser\\ml_models\\resnet_18_color_model.h5')

db = getDB()

fs = gridfs.GridFS(db)  # Set up GridFS to interact with the database

class Check_get_request(BaseModel):
    color: List[str]
    gender: str
    category: List[str]

# Define broad color categories with RGB ranges
COLOR_CATEGORIES = {
    "lightblue":[173,216,230],
    "blue":[0,0,255],
    "darkblue":[0,0,139],
    "turquoise":[64,224,208],
    "teal":[0,128,128],
    "beige":[245,245,220],
    "peach":[255,218,185],
    "khaki":[240,230,140],
    "olive":[128,128,0],
    "yellow":[255,255,0],
    "lavender":[230,230,250],
    "parrotgreen":[124,252,0],
    "green":[0,128,0],
    "seagreen":[46,139,87],
    "lightgreen":[144,238,144],
    "grey":[128,128,128],
    "black":[0,0,0],
    "orange":[255,69,0],
    "red":[255,0,0],
    "white":[255,255,255],
    "purple":[128,0,128],
    "magenta":[255,0,255],
    "lightpink":[255,192,203],
    "darkpink":[255,20,147],
    "Brown": [139, 69, 19],  
}

# Function to retrieve the image from GridFS
async def get_image_from_gridfs(file_id: ObjectId):
    # Retrieve the image from GridFS
    file = fs.get(file_id)
    return file

# Helper functions from the second API
def rgb_to_lab(rgb):
    rgb_normalized = np.array(rgb) / 255.0
    rgb_reshaped = rgb_normalized.reshape(1, 1, 3)
    lab_color = color.rgb2lab(rgb_reshaped)
    return lab_color.flatten()

def map_to_broad_color(rgb):
    min_distance = float('inf')
    closest_color = None
    for color_name, color_rgb in COLOR_CATEGORIES.items():
        dist = distance.euclidean(rgb, color_rgb)
        if dist < min_distance:
            min_distance = dist
            closest_color = color_name
    return closest_color

def get_color_name(rgb):
    lab_rgb = rgb_to_lab(rgb)
    color_names = list(colors.CSS4_COLORS.keys())
    min_distance = float('inf')
    closest_name = None
    for color_name in color_names:
        color_rgb = np.array(colors.to_rgb(color_name)) * 255
        color_lab = rgb_to_lab(color_rgb)
        dist = distance.euclidean(lab_rgb, color_lab)
        if dist < min_distance:
            min_distance = dist
            closest_name = color_name
    return closest_name

def predict_color_combinations(input_rgb):
    normalized_rgb = np.array(input_rgb) / 255.0
    normalized_rgb = normalized_rgb.reshape(1, 1, 1, 3)
    prediction = model.predict(normalized_rgb)
    predicted_colors = (prediction * 255).astype(int).reshape(-1, 3).tolist()
    results = []
    for color in predicted_colors:
        broad_category = map_to_broad_color(color)
        color_name = get_color_name(color)
        results.append({
            "rgb": color,
            "broad_category": broad_category,
            "color_name": color_name
        })
    return results

# Refactored function for /get_final_colour logic
def get_final_colour_logic(dominant_color_rgb: List[int]):
    if len(dominant_color_rgb) != 3:
        raise ValueError("The RGB color input must have exactly three values.")
    return predict_color_combinations(dominant_color_rgb)

@router.post("/get_recommended_products/")
async def process_image(
    gender: str = Form(...),
    collection: str = Form(...),
    file: UploadFile = File(...),
    token: str = Depends(secure_protection)
):
    try:
        # Step 1: Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Step 2: Get dominant color
        dominant_color = dominant_color_model.get_dominant_color_from_person(image)
        dominant_color_rgb = dominant_color.tolist()
        
        # Step 3: Get predicted color combinations
        predicted_colors = get_final_colour_logic(dominant_color_rgb)
        
        # Step 4: Create a unique flattened list of color names and broad categories
        color_set = set()
        for color in predicted_colors:
            color_set.add(color['color_name'])
            color_set.add(color['broad_category'])
        
        # Convert the set back to a list (to maintain uniqueness)
        unique_colors = list(color_set)
        
        # Step 5: Prepare request body for get_filtered_product
        filter_request = Check_get_request(
            gender=gender,
            color=unique_colors,
            category=[collection]  # Assuming 'collection' maps to the 'category' field
        )
        
        # Step 6: Call get_filtered_product internally
        filtered_products = await get_product(filter_request)

        #search_dresses(unique_colors,gender,collection)
        
        # Step 7: Return the response
        return JSONResponse(content={
            "gender": gender,
            "collection": collection,
            "dominant_color": dominant_color_rgb[::-1],  # Reverse to RGB format
            "colors": unique_colors,
            "products": filtered_products["products"],  # Merge products into response
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/get_filtered_product")
async def get_product(item: Check_get_request):
    try:
        update_fields = {}

        # Add case-insensitive regex for gender
        if item.gender:
            update_fields["gender"] = {"$regex": f"^{item.gender}$", "$options": "i"}  # Case-insensitive

        # Initialize $and clause for color and category
        and_conditions = []

        # Add case-insensitive regex for color
        if item.color:
            color_conditions = [{"color": {"$regex": f"^{color}$", "$options": "i"}} for color in item.color]
            if color_conditions:
                and_conditions.append({"$or": color_conditions})

        # Add case-insensitive regex for category
        if item.category:
            category_conditions = [{"category": {"$regex": f"^{category}$", "$options": "i"}} for category in item.category]
            if category_conditions:
                and_conditions.append({"$or": category_conditions})

        # If there are any $and conditions, add them to the query
        if and_conditions:
            update_fields["$and"] = and_conditions
        

        print(update_fields)

        objs = list(db.product.find(update_fields))  # Convert cursor to list 

        print(objs)

        result = []

        for obj in objs:
            # Retrieve image from GridFS
            image = await get_image_from_gridfs(obj["image"])

            # Create an in-memory file response for the image
            img_io = BytesIO(image.read())
            img_io.seek(0)

            result.append({
                "id": str(obj["_id"]),
                "image_url": f"/images/{str(obj['_id'])}",  # Providing URL for the image
                "description": obj["description"],
                "price": obj["price"]
            })
            print(result)

        return {"products": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

