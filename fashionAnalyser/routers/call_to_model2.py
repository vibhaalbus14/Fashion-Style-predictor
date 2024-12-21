from fastapi import APIRouter, HTTPException,Depends
from typing import List, Dict
import numpy as np
from scipy.spatial import distance
import webcolors
from pydantic import BaseModel
import tensorflow as tf
from routers.userLogin import secure_protection
from matplotlib import colors
from skimage import color


router = APIRouter()

# Load the trained model (load it once when the router is initialized)
model = tf.keras.models.load_model('C:\\My Documents\\College\\Projects\\7th sem\\fastapivenv\\fashionAnalyser\\ml_models\\resnet_18_color_model.h5')

# Define broad color categories with RGB ranges
COLOR_CATEGORIES = {
    "Red": [255, 0, 0],
    "Green": [0, 255, 0],
    "Blue": [0, 0, 255],
    "Yellow": [255, 255, 0],
    "Cyan": [0, 255, 255],
    "Magenta": [255, 0, 255],
    "Black": [0, 0, 0],
    "White": [255, 255, 255],
    "Gray": [128, 128, 128],
    "Orange": [255, 165, 0],
    "Pink": [255, 192, 203],
    "Brown": [139, 69, 19],
}

# Function to convert RGB to Lab color space
def rgb_to_lab(rgb):
    # Normalize RGB to [0, 1]
    rgb_normalized = np.array(rgb) / 255.0
    # Convert to Lab color space using skimage
    rgb_reshaped = rgb_normalized.reshape(1, 1, 3)  # Reshape for skimage
    lab_color = color.rgb2lab(rgb_reshaped)  # Convert RGB to Lab
    return lab_color.flatten()  # Flatten the output to 1D

# Function to find the closest broad color category based on RGB
def map_to_broad_color(rgb):
    min_distance = float('inf')
    closest_color = None
    for color_name, color_rgb in COLOR_CATEGORIES.items():
        dist = distance.euclidean(rgb, color_rgb)
        if dist < min_distance:
            min_distance = dist
            closest_color = color_name
    return closest_color

# Function to find the closest color name using Lab color space
def get_color_name(rgb):
    # Convert input RGB to Lab
    lab_rgb = rgb_to_lab(rgb)

    # Predefined color names from matplotlib (in Lab color space)
    color_names = list(colors.CSS4_COLORS.keys())
    
    min_distance = float('inf')
    closest_name = None
    for color_name in color_names:
        color_rgb = np.array(colors.to_rgb(color_name)) * 255  # Convert color name to RGB
        color_lab = rgb_to_lab(color_rgb)  # Convert RGB to Lab
        dist = distance.euclidean(lab_rgb, color_lab)  # Calculate Euclidean distance in Lab space
        
        if dist < min_distance:
            min_distance = dist
            closest_name = color_name

    return closest_name

# Function to predict color combinations based on an input RGB color
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

@router.post("/get_final_colour")
async def get_final_colour(dominant_color_rgb: List[int],token: str = Depends(secure_protection)):
    try:
        if len(dominant_color_rgb) != 3:
            raise ValueError("The RGB color input must have exactly three values.")
        
        color_combinations = predict_color_combinations(dominant_color_rgb)
        return {"input_color": dominant_color_rgb, "predicted_colors": color_combinations}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
