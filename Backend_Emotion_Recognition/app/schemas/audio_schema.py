from pydantic import BaseModel
from typing import Dict


class AudioResponse(BaseModel):
    emotion: str
    confidence: float
    all_emotions: Dict[str, float]


class AudioUploadResponse(BaseModel):
    message: str
    file_path: str
