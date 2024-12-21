from fastapi import APIRouter, UploadFile, File, HTTPException,Form,Depends
from routers.database import getDB
from io import BytesIO
from PIL import Image
from pydantic import BaseModel
from fastapi.responses import FileResponse,StreamingResponse
from typing import Optional
from bson import ObjectId
import base64
import io
import gridfs
from routers.userLogin import secure_protection

router = APIRouter()
db = getDB()
fs = gridfs.GridFS(db)  # Set up GridFS to interact with the database
COLORS_ID="673c548fe328234d17d724b0"
brandNameS_ID="673c54a7e328234d17d724b1"


class Check_get_request(BaseModel):
    color: Optional[str] = None
    gender: Optional[str] = None
    brandName: Optional[str] = None
#admin_meta_data={{"_id":"auto gen","colors":{"color_name":count}},
#                  {"_id":"auto gen","brandNames":{"brandName":count}}}
#why not handle like simple dic?
#1.concurrency issue, one user overwrites the other users info
#2.entire doc is moved to python prog , directly manipulated and then written back
#why use mongo's update queries?
#1.no concurrency issue, all writes and reads are preserved
#2.entire doc is not copied to prog memo, but mongowrites directly to db,accessing only necessary portion
#admin_meta_data handling funcs

#faster lookups
db.admin_meta_data.create_index("_id")

async def increment_meta_data(meta_id, field, key):
    
    db.admin_meta_data.update_one(
        {"_id": ObjectId(meta_id)},
        {"$inc": {f"{field}.{key}": 1}},
        upsert=True  # Automatically create the key if it doesn't exist
    )


async def decrement_meta_data(meta_id, field, key):
    document = db.admin_meta_data.find_one({"_id": ObjectId(meta_id)})

    if document:
        # Check if the key exists
        if key in document.get(field, {}):
            current_value = document[field].get(key, 0)

            if current_value == 1:
                # If the value is 1, delete the key
                db.admin_meta_data.update_one(
                    {"_id": ObjectId(meta_id)},
                    {"$unset": {field + "." + key: ""}}
                )
            else:
                # If the value is greater than 1, decrement it
                db.admin_meta_data.update_one(
                    {"_id": ObjectId(meta_id)},
                    {"$inc": {field + "." + key: -1}}
                )
        else:
            raise HTTPException(status_code=404, detail=f"{key} not found in {field}")
    else:
        raise HTTPException(status_code=404, detail="Admin meta data document not found")

# Function to store image using GridFS
async def store_image_in_gridfs(image_data: bytes):
    # Store the image in GridFS
    file_id = fs.put(image_data, content_type="image/png")
    return file_id

# Function to retrieve the image from GridFS
async def get_image_from_gridfs(file_id: ObjectId):
    # Retrieve the image from GridFS
    file = fs.get(file_id)
    return file

async def compress_image(image_data: bytes) -> bytes:
    with Image.open(io.BytesIO(image_data)) as img:
        img = img.convert("RGB")
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=50)  # Adjust quality as needed
        return buffer.getvalue()

# Preprocessing function to convert empty strings to None
async def preprocess_file(file: Optional[UploadFile] = File(None)):
    if isinstance(file, str) and not file:  # If empty string, treat as None
        return None
    return file

@router.post("/create_product")
async def create_product(
    color: str = Form(...),
    gender: str = Form(...),
    brandName: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    file: UploadFile = File(...),
    token: str = Depends(secure_protection)
    ):
    try:
        image_data = await file.read()  # converts data to bytes
        compressed_image = await compress_image(image_data)
         # Store image in GridFS
        file_id = await store_image_in_gridfs(compressed_image)#sending compressed binary data image
        obj=db.product.insert_one(
            {
                "color": color,
                "brandName": brandName,
                "gender": gender,
                "category": category,
                "image": file_id,
                "description": description,
                "price":price
            }
        )
        if obj.inserted_id:
            #add color meta_deta to admin_meta_data
            await increment_meta_data(COLORS_ID,"colors",color)
            #add brandName_meta_data 
            await increment_meta_data(brandNameS_ID,"brandNames",brandName) 
            return {"message": "Product saved successfully"}
        
    except Exception as e:
        print(f"Error in /create_product: {e}")  # Add logging here

        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/get_product")
async def get_product(item: Check_get_request,token: str = Depends(secure_protection)):
    try:
        update_fields = {}
        if item.color:
            update_fields["color"] = item.color
        if item.brandName:
            update_fields["brandName"] = item.brandName
        if item.gender:
            update_fields["gender"] = item.gender
        

        if update_fields:
            objs = list(db.product.find(update_fields))  # Convert cursor to list 
        else:
            objs = list(db.product.find())

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

        return {"products": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.get("/images/{product_id}")
async def get_image(product_id: str):
    try:
        obj = db.product.find_one({"_id": ObjectId(product_id)})
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")

        # Retrieve image from GridFS
        image = await get_image_from_gridfs(obj["image"])

        # Create an in-memory file response for the image
        img_io = BytesIO(image.read())
        img_io.seek(0)

        return StreamingResponse(img_io, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/update_product")
async def update_product(
    id: str = Form(...),  # Product ID to be updated
    color: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    brandName: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    file: Optional[UploadFile] = Depends(preprocess_file),
    token: str = Depends(secure_protection)
):
    try:
        obj = db.product.find_one({"_id": ObjectId(id)})
        if not obj:
            raise HTTPException(status_code=404, detail="Product does not exist")

        update_fields = {}
        old_color = old_brandName = None  # Initialize them outside the conditional checks

        if color:
            update_fields["color"] = color
            old_color = obj["color"]  # Store old color
            new_color = color  # New color after update

        if brandName:
            update_fields["brandName"] = brandName
            old_brandName = obj["brandName"]  # Store old brandName
            new_brandName = brandName  # New brandName after update

        if gender:
            update_fields["gender"] = gender
        if price:
            update_fields["price"] = price
        if category:
            update_fields["category"] = category
        if description:
            update_fields["description"] = description
        if file:
            # Process file only if it is valid
            image_data = await file.read()  # Get the image bytes
            compressed_image = await compress_image(image_data)
            # Store image in GridFS
            file_id = await store_image_in_gridfs(compressed_image)
            update_fields["image"] = file_id

        db.product.update_one({"_id": ObjectId(id)}, {"$set": update_fields})

        updated_obj = db.product.find_one({"_id": ObjectId(id)})
        if updated_obj:
            # Increment or add new color if color exists
            if color:
                await increment_meta_data(COLORS_ID, "colors", new_color)
                await decrement_meta_data(COLORS_ID, "colors", old_color)

            # Increment or add new shop if brandName exists
            if brandName:
                await increment_meta_data(brandNameS_ID, "brandNames", new_brandName)
                await decrement_meta_data(brandNameS_ID, "brandNames", old_brandName)

            return {"product updated": "successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/delete_product")
async def delete_product_by_id(id: str,token: str = Depends(secure_protection)):
    try:
        obj = db.product.find_one({"_id": ObjectId(id)})
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        old_color=obj["color"]
        old_brandName=obj["brandName"]

         # Delete image from GridFS
        fs.delete(obj["image"])  # Remove the image from GridFS

        res=db.product.delete_one({"_id": ObjectId(id)})
        #delete brandName and color from meta data
        if res.deleted_count > 0:
            await decrement_meta_data(COLORS_ID,"colors",old_color)
            await decrement_meta_data(brandNameS_ID,"brandNames",old_brandName)
            return {"message": "Product deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@router.get("/get_colour_names")
async def get_color_names(token:str=Depends(secure_protection)):
    objs=db.admin_meta_data.find_one({"_id":ObjectId(COLORS_ID)})
    return objs["colors"]

@router.get("/get_brandNames")
async def get_brandNames(token:str=Depends(secure_protection)):
    objs=db.admin_meta_data.find_one({"_id":ObjectId(brandNameS_ID)})
    return objs["brandNames"]