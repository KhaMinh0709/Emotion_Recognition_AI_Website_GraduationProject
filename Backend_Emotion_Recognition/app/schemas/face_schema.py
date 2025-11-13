from pydantic import BaseModel
from typing import List, Optional

class FaceLocationDetailed(BaseModel):
    left: int
    top: int
    right: int
    bottom: int

class DetectedFace(BaseModel):
    face_id: int
    location: FaceLocationDetailed
    cropped_face_base64: Optional[str] = None  # Base64 encoded cropped face image

class FaceDetectResponse(BaseModel):
    faces: List[DetectedFace]
    total_faces: int
    image_width: int
    image_height: int