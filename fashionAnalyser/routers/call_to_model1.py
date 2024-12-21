from fastapi import FastAPI, File, Form, UploadFile, HTTPException,APIRouter,Depends
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import cv2
from ml_models.dominant_color_model import DominantColorModel
import io
from routers.userLogin import secure_protection

router=APIRouter()

dominant_color_model = DominantColorModel()

@router.post("/process-image/")
async def process_image(
    gender: str = Form(...),       # Accept text data (gender)
    collection: str = Form(...),    # Accept text data (collection)
    file: UploadFile = File(...),  # Accept the image 
    token: str = Depends(secure_protection)
):
    try:
        # Step 1: Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Step 2: Get dominant color from person
        dominant_color = dominant_color_model.get_dominant_color_from_person(image)
        dominant_color_rgb = dominant_color.tolist()

        # Return the response including the form data and dominant color
        return JSONResponse(content={
            "gender": gender,
            "collection": collection,
            "dominant_color": dominant_color_rgb[::-1]
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
