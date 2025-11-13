from fastapi import UploadFile, HTTPException
import numpy as np
from app.models.face_model import FaceModel
from app.utils.image_utils import (
    validate_image, 
    load_image_into_numpy_array,
    save_result_image
)
from app.core.logger import setup_logger

logger = setup_logger(__name__)

class FaceService:
    def __init__(self):
        self.model = FaceModel()
        
    async def detect_faces(self, file: UploadFile, include_cropped_base64: bool = False):
        """Detect all faces in uploaded image.
        
        Args:
            file: Uploaded image file
            include_cropped_base64: If True, include base64 encoded cropped faces in response
            
        Returns:
            dict with faces, total_faces, image_width, image_height
        """
        try:
            # Validate file
            await validate_image(file)
            
            # Load image into numpy array
            image_array = await load_image_into_numpy_array(file)
            
            # Detect faces
            result = self.model.detect_faces(image_array, include_cropped_base64=include_cropped_base64)
            
            return {
                "faces": result["faces"],
                "total_faces": len(result["faces"]),
                "image_width": result["image_width"],
                "image_height": result["image_height"]
            }
        except Exception as e:
            logger.error(f"Error detecting faces: {e}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def predict_emotion_from_cropped_face(self, file: UploadFile):
        """Predict emotion from a cropped face image.
        
        Args:
            file: Uploaded cropped face image file
            
        Returns:
            dict with emotion, confidence, and all_emotions
        """
        try:
            # Validate file
            await validate_image(file)
            
            # Load image into numpy array
            face_array = await load_image_into_numpy_array(file)
            
            # Predict emotion
            result = self.model.predict_emotion_from_face(face_array)
            
            # Process the result to ensure all values are JSON serializable
            processed_result = {
                "emotion": result["emotion"],
                "confidence": float(result["confidence"]),
                "all_emotions": {
                    k: float(v) for k, v in result["all_emotions"].items()
                }
            }
            
            return processed_result
        except Exception as e:
            logger.error(f"Error predicting emotion from cropped face: {e}")
            raise HTTPException(status_code=400, detail=str(e))
            
    async def predict_emotion(self, image_input, skip_save: bool = False):
        """Predict emotion from face image.
        Args:
            image_input: Either an UploadFile or a numpy array containing the image
            skip_save: If True, skip saving result image (for realtime/performance)
        """
        try:
            if isinstance(image_input, np.ndarray):
                image_array = image_input
            else:
                # It's an UploadFile
                await validate_image(image_input)
                image_array = await load_image_into_numpy_array(image_input)

            # Get prediction
            result = self.model.predict(image_array)

            # Log the raw prediction result (only in debug mode)
            if logger.level <= 10:  # DEBUG level
                logger.debug(f"Raw prediction result: {result}")

            if not isinstance(result, dict):
                logger.error(f"Unexpected result type: {type(result)}")
                return {"error": "Invalid prediction result format"}

            if "error" in result:
                logger.warning(f"Model returned error: {result['error']}")
                return {"error": result["error"]}

            # Validate required fields
            required_fields = ["emotion", "confidence", "face_location", "all_emotions"]
            missing_fields = [field for field in required_fields if field not in result]

            if missing_fields:
                logger.error(f"Missing required fields in prediction result: {missing_fields}")
                return {"error": f"Invalid prediction result: missing {', '.join(missing_fields)}"}

            # Process the result to ensure all values are JSON serializable
            processed_result = {
                "emotion": result["emotion"],
                "confidence": float(result["confidence"]),
                "face_location": {
                    k: int(v) for k, v in result["face_location"].items()
                },
                "all_emotions": {
                    k: float(v) for k, v in result["all_emotions"].items()
                }
            }

            # OPTIMIZATION: Only save result image if not skipped (for realtime performance)
            if not skip_save and not isinstance(image_input, np.ndarray):
                # Save result image only for uploaded files
                result_file = f"result_{image_input.filename}"
                result_path = save_result_image(
                    original_img=image_array,
                    face_location=processed_result["face_location"],
                    emotion=processed_result["emotion"],
                    confidence=processed_result["confidence"],
                    file_name=result_file
                )
                # Add result image path to response for uploaded files
                processed_result["result_image"] = str(result_path)

            return processed_result
        except Exception as e:
            logger.error(f"Error predicting emotion: {e}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def predict_emotion_batch(self, files: list):
        """Predict emotions from multiple cropped face images (batch processing).
        
        Args:
            files: List of UploadFile objects, each containing a cropped face image
            
        Returns:
            List of dicts, each with emotion, confidence, and all_emotions for each face
        """
        try:
            if not files or len(files) == 0:
                return []
            
            # Load all face images into numpy arrays
            face_arrays = []
            for file in files:
                # Validate file
                await validate_image(file)
                
                # Load image into numpy array
                face_array = await load_image_into_numpy_array(file)
                face_arrays.append(face_array)
            
            # Batch predict emotions
            results = self.model.predict_emotion_batch(face_arrays)
            
            # Process results to ensure all values are JSON serializable
            processed_results = []
            for result in results:
                processed_result = {
                    "emotion": result["emotion"],
                    "confidence": float(result["confidence"]),
                    "all_emotions": {
                        k: float(v) for k, v in result["all_emotions"].items()
                    }
                }
                processed_results.append(processed_result)
            
            return processed_results
        except Exception as e:
            logger.error(f"Error predicting emotion batch: {e}")
            raise HTTPException(status_code=400, detail=str(e))