from fastapi import HTTPException, UploadFile
import cv2
import numpy as np
from app.core.config import settings
import aiofiles
from pathlib import Path

async def validate_image(file: UploadFile):
    """Validate uploaded image file"""
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {settings.ALLOWED_IMAGE_TYPES}"
        )
    
    if file.size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size too large. Maximum size: {settings.MAX_UPLOAD_SIZE/1024/1024}MB"
        )

async def save_upload_file(upload_file: UploadFile, folder: str) -> Path:
    """Save uploaded file and return the path"""
    try:
        file_path = Path(settings.UPLOAD_DIR) / folder / upload_file.filename
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await upload_file.read()
            await f.write(content)
            
        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

async def load_image_into_numpy_array(file: UploadFile):
    """Load image from UploadFile into numpy array"""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image")
            
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

def save_result_image(original_img: np.ndarray, face_location: dict, emotion: str, 
                     confidence: float, file_name: str) -> str:
    """Save result image with face detection box and prediction"""
    try:
        img_with_box = original_img.copy()

        # Support two possible face_location formats:
        # 1) {'x', 'y', 'width', 'height'}
        # 2) {'left', 'top', 'right', 'bottom'}
        if {'x', 'y', 'width', 'height'}.issubset(face_location.keys()):
            x = int(face_location['x'])
            y = int(face_location['y'])
            w = int(face_location['width'])
            h = int(face_location['height'])
        elif {'left', 'top', 'right', 'bottom'}.issubset(face_location.keys()):
            left = int(face_location['left'])
            top = int(face_location['top'])
            right = int(face_location['right'])
            bottom = int(face_location['bottom'])
            x, y, w, h = left, top, right - left, bottom - top
        else:
            raise ValueError('Unsupported face_location format')

        # Draw face rectangle
        cv2.rectangle(img_with_box, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Prepare prediction text: if confidence in 0..1 convert to percent
        display_conf = (confidence * 100) if confidence <= 1.0 else confidence
        text = f"{emotion}: {display_conf:.1f}%"
        cv2.putText(img_with_box, text, (x, max(15, y - 10)), cv2.FONT_HERSHEY_SIMPLEX, 
                    0.9, (0, 255, 0), 2)
        
        # Save result
        result_path = Path(settings.RESULTS_DIR) / file_name
        result_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(result_path), img_with_box)
        
        return str(result_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save result image: {str(e)}")