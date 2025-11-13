import os
from pathlib import Path
import shutil

def clean_old_files(directory: Path, max_age_hours: int = 24):
    """Clean up old files from a directory"""
    for file_path in directory.glob("*"):
        if file_path.is_file():
            # Get file age in hours
            age_hours = (time.time() - os.path.getctime(file_path)) / 3600
            
            # Remove if older than max_age_hours
            if age_hours > max_age_hours:
                file_path.unlink()

def ensure_directories_exist():
    """Ensure all required directories exist"""
    from app.core.config import settings
    
    directories = [
        settings.UPLOAD_DIR,
        settings.RESULTS_DIR,
        settings.MODEL_DIR
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)