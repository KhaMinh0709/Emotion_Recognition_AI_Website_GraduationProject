from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import JSONResponse
from app.services.face_service import FaceService
from app.schemas.face_schema import FaceDetectResponse
from typing import Dict, Any, List

router = APIRouter()
# Lazily create FaceService to avoid heavy model load at import/startup
face_service = None

def get_face_service() -> FaceService:
    global face_service
    if face_service is None:
        face_service = FaceService()
    return face_service

@router.post("/detect", response_model=FaceDetectResponse)
async def detect_faces(
    file: UploadFile = File(...),
    include_cropped: bool = Query(False, description="Include base64 encoded cropped faces in response")
) -> Dict[str, Any]:
    """
    Detect all faces in uploaded image.
    
    This endpoint only detects faces and returns their locations.
    Use /face/predict with a cropped face to analyze emotions.
    
    Parameters:
    - file: Image file to detect faces in
    - include_cropped: If True, include base64 encoded cropped faces in response
    
    Returns:
    - faces: List of detected faces with locations
    - total_faces: Number of faces detected
    - image_width: Width of original image
    - image_height: Height of original image
    """
    svc = get_face_service()
    result = await svc.detect_faces(file, include_cropped_base64=include_cropped)
    return JSONResponse(content=result)

@router.post("/predict")
async def predict_emotion(
    file: UploadFile = File(...), 
    skip_save: bool = Query(False, description="Skip saving result image"),
    is_cropped_face: bool = Query(False, description="If True, treat input as already cropped face")
) -> Dict[str, Any]:
    """
    Predict emotion from face image.
    
    If is_cropped_face=True, the input is treated as a cropped face image
    and will be analyzed directly without face detection.
    
    If is_cropped_face=False (default), the endpoint will detect the largest face
    in the image and analyze it (backward compatibility mode).

    Parameters:
    - file: Image file to analyze (full image or cropped face)
    - skip_save: If True, skip saving result image (for realtime mode)
    - is_cropped_face: If True, treat input as already cropped face

    Returns:
    - emotion: Predicted emotion
    - confidence: Confidence score (0..1)
    - face_location: Bounding box coordinates (only if is_cropped_face=False)
    - all_emotions: Probability scores for all emotions
    - result_image: Path to the result image (only if skip_save=False and is_cropped_face=False)
    """
    svc = get_face_service()
    
    if is_cropped_face:
        # Analyze cropped face directly
        result = await svc.predict_emotion_from_cropped_face(file)
        return JSONResponse(content=result)
    else:
        # Legacy mode: detect and predict
        result = await svc.predict_emotion(file, skip_save=skip_save)
        return JSONResponse(content=result)

@router.post("/predict-batch")
async def predict_emotion_batch(
    files: List[UploadFile] = File(...)
) -> Dict[str, Any]:
    """
    Predict emotions from multiple cropped face images (batch processing).
    
    This endpoint accepts multiple face images and returns emotion predictions
    for all of them in a single request. This is more efficient than making
    multiple separate requests.
    
    Parameters:
    - files: List of image files, each containing a cropped face
    
    Returns:
    - results: List of prediction results, each containing:
        - emotion: Predicted emotion
        - confidence: Confidence score (0..1)
        - all_emotions: Probability scores for all emotions
    """
    svc = get_face_service()
    results = await svc.predict_emotion_batch(files)
    return JSONResponse(content={"results": results})
