from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Emotion Recognition API"
    DEBUG: bool = True
    
    # Path settings
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    MODEL_DIR: Path = BASE_DIR / "models"
    UPLOAD_DIR: Path = BASE_DIR / "app" / "static" / "uploads"
    RESULTS_DIR: Path = BASE_DIR / "app" / "static" / "results"
    
    # Model paths
    FACE_MODEL_PATH: Path = MODEL_DIR / "faces/face_emotion_model.keras"
    AUDIO_MODEL_PATH: Path = MODEL_DIR / "audio/best_model1_weights.h5"
    # FUSION_MODEL_PATH: Path = MODEL_DIR / "fusion_model.pth"
    
    # API settings
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: list = ["image/jpeg", "image/png"]
    ALLOWED_AUDIO_TYPES: list = [
        "audio/wav",
        "audio/wave",
        "audio/x-wav",
        "audio/weba",
        "audio/webm",
        "audio/ogg",
        "audio/mpeg",
        "audio/mp3",
    ]

    class Config:
        env_file = ".env"

settings = Settings()