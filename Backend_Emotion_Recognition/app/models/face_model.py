import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, BatchNormalization, Activation, MaxPooling2D
from tensorflow.keras.optimizers import Adam
import cv2
import numpy as np
import base64
from pathlib import Path
from app.core.logger import setup_logger
import os
from app.core.config import settings

logger = setup_logger(__name__)

class FaceModel:
    os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
    def __init__(self):
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        self.model = self._create_model() if not Path(settings.FACE_MODEL_PATH).exists() else self._load_model()
        
        # Load the face detection cascade classifier
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        if self.face_cascade.empty():
            logger.error("Error loading face cascade classifier")
            raise ValueError("Could not load face cascade classifier")
        logger.info("Face cascade classifier loaded successfully")
        
    def _create_model(self):
        """Create the CNN model architecture"""
        model = Sequential()

        # 1st CNN layer
        model.add(Conv2D(64, (3, 3), padding='same', input_shape=(48, 48, 1)))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))

        # 2nd CNN layer
        model.add(Conv2D(128, (5, 5), padding='same'))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))

        # 3rd CNN layer
        model.add(Conv2D(512, (3, 3), padding='same'))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))

        # 4th CNN layer
        model.add(Conv2D(512, (3, 3), padding='same'))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))

        model.add(Flatten())

        # Fully connected 1st layer
        model.add(Dense(256))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(Dropout(0.25))

        # Fully connected 2nd layer
        model.add(Dense(512))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(Dropout(0.25))

        # Fully connected 3rd layer
        model.add(Dense(512))
        model.add(BatchNormalization())
        model.add(Activation('relu'))
        model.add(Dropout(0.22))

        # Output layer
        model.add(Dense(len(self.emotions), activation='softmax'))

        # Compile model
        opt = Adam(learning_rate=0.0001)
        model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])
        
        logger.info("Created new face emotion recognition model")
        return model
        
    def _load_model(self):
        """Load the face emotion recognition model"""
        try:
            # Load model without compiling to avoid optimizer/class mismatch issues
            model = tf.keras.models.load_model(settings.FACE_MODEL_PATH, compile=False)
            logger.info("Face model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Error loading face model: {e}")
            raise
            
    def detect_faces(self, img_array, include_cropped_base64=False):
        """Detect all faces in image and return their locations.
        
        Args:
            img_array: Input image as numpy array
            include_cropped_base64: If True, include base64 encoded cropped faces
            
        Returns:
            dict with:
                - faces: List of detected faces with locations
                - image_width: Width of original image
                - image_height: Height of original image
        """
        try:
            # Convert image array to BGR format if needed
            if len(img_array.shape) == 3 and img_array.shape[2] == 3:
                img_bgr = img_array
            else:
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

            # Get image dimensions
            img_height, img_width = img_bgr.shape[:2]

            # Convert to grayscale for face detection
            gray_img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray_img, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(30, 30)
            )

            if len(faces) == 0:
                logger.warning("No faces detected in the image")
                return {
                    "faces": [],
                    "image_width": img_width,
                    "image_height": img_height
                }

            # Process each detected face
            detected_faces = []
            for idx, (x, y, w, h) in enumerate(faces):
                left = int(x)
                top = int(y)
                right = int(x + w)
                bottom = int(y + h)
                
                face_data = {
                    "face_id": idx + 1,
                    "location": {
                        "left": left,
                        "top": top,
                        "right": right,
                        "bottom": bottom
                    }
                }
                
                # Optionally include cropped face as base64
                if include_cropped_base64:
                    # Crop face from original color image
                    cropped_face = img_bgr[top:bottom, left:right]
                    # Encode to base64
                    _, buffer = cv2.imencode('.jpg', cropped_face, [cv2.IMWRITE_JPEG_QUALITY, 90])
                    face_base64 = base64.b64encode(buffer).decode('utf-8')
                    face_data["cropped_face_base64"] = f"data:image/jpeg;base64,{face_base64}"
                
                detected_faces.append(face_data)

            return {
                "faces": detected_faces,
                "image_width": img_width,
                "image_height": img_height
            }
        except Exception as e:
            logger.error(f"Error detecting faces: {e}")
            raise

    def predict_emotion_from_face(self, face_img_array):
        """Predict emotion from a cropped face image.
        
        Args:
            face_img_array: Cropped face image as numpy array (grayscale or BGR)
            
        Returns:
            dict with emotion, confidence, and all_emotions
        """
        try:
            # Convert to grayscale if needed
            if len(face_img_array.shape) == 3:
                if face_img_array.shape[2] == 3:
                    # BGR to grayscale
                    gray_face = cv2.cvtColor(face_img_array, cv2.COLOR_BGR2GRAY)
                else:
                    gray_face = face_img_array[:, :, 0]
            else:
                gray_face = face_img_array

            # Preprocess the face
            processed_face = self._preprocess_image(gray_face)
            
            # Get predictions
            predictions = self.model.predict(processed_face, verbose=0)
            
            # Get all emotion probabilities (0..1)
            emotion_probs = {
                emotion: float(prob)
                for emotion, prob in zip(self.emotions, predictions[0])
            }

            # Get the highest probability emotion
            emotion_index = int(np.argmax(predictions[0]))
            emotion = self.emotions[emotion_index]
            confidence = float(predictions[0][emotion_index])

            return {
                "emotion": emotion,
                "confidence": confidence,  # 0..1
                "all_emotions": emotion_probs
            }
        except Exception as e:
            logger.error(f"Error predicting emotion from face: {e}")
            raise

    def predict(self, img_array):
        """Predict emotion from face image (legacy method - detects largest face and predicts)
        This method is kept for backward compatibility.
        """
        try:
            # Convert image array to BGR format if needed
            if len(img_array.shape) == 3 and img_array.shape[2] == 3:
                img_bgr = img_array
            else:
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

            # Convert to grayscale for face detection
            gray_img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.face_cascade.detectMultiScale(gray_img, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            if len(faces) == 0:
                logger.warning("No faces detected in the image")
                return {"error": "No faces detected in the image"}

            # Find the largest face
            largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
            x, y, w, h = largest_face

            # Crop the face
            cropped_face = gray_img[y:y+h, x:x+w]
            
            # Predict emotion from cropped face
            result = self.predict_emotion_from_face(cropped_face)

            # Convert face location to left/top/right/bottom for frontend
            left = int(x)
            top = int(y)
            right = int(x + w)
            bottom = int(y + h)

            # Add face location to result
            result["face_location"] = {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom
            }

            return result
        except Exception as e:
            logger.error(f"Error predicting emotion: {e}")
            raise
            
    def predict_emotion_batch(self, face_img_arrays):
        """Predict emotions from multiple cropped face images (batch processing).
        
        Args:
            face_img_arrays: List of cropped face images as numpy arrays (grayscale or BGR)
            
        Returns:
            List of dicts, each with emotion, confidence, and all_emotions for each face
        """
        try:
            if not face_img_arrays or len(face_img_arrays) == 0:
                return []
            
            # Preprocess all faces
            processed_faces = []
            for face_img_array in face_img_arrays:
                # Convert to grayscale if needed
                if len(face_img_array.shape) == 3:
                    if face_img_array.shape[2] == 3:
                        # BGR to grayscale
                        gray_face = cv2.cvtColor(face_img_array, cv2.COLOR_BGR2GRAY)
                    else:
                        gray_face = face_img_array[:, :, 0]
                else:
                    gray_face = face_img_array
                
                # Preprocess the face
                processed_face = self._preprocess_image(gray_face)
                processed_faces.append(processed_face[0])  # Remove batch dimension for stacking
            
            # Stack all faces into a batch
            batch_array = np.stack(processed_faces, axis=0)
            
            # Batch predict (more efficient than individual predictions)
            predictions = self.model.predict(batch_array, verbose=0)
            
            # Process results for each face
            results = []
            for pred in predictions:
                # Get all emotion probabilities (0..1)
                emotion_probs = {
                    emotion: float(prob)
                    for emotion, prob in zip(self.emotions, pred)
                }
                
                # Get the highest probability emotion
                emotion_index = int(np.argmax(pred))
                emotion = self.emotions[emotion_index]
                confidence = float(pred[emotion_index])
                
                results.append({
                    "emotion": emotion,
                    "confidence": confidence,  # 0..1
                    "all_emotions": emotion_probs
                })
            
            return results
        except Exception as e:
            logger.error(f"Error predicting emotion batch: {e}")
            raise
    
    def _preprocess_image(self, face_img):
        """Preprocess face image for model input"""
        try:
            # Resize to model input size (48x48)
            resized_face = cv2.resize(face_img, (48, 48))

            # Normalize pixel values to [0, 1] range (same as training)
            # If your training used different normalization, adjust this accordingly
            normalized_face = resized_face

            # Reshape for model input (add batch and channel dimensions)
            processed_face = normalized_face.reshape(1, 48, 48, 1)

            return processed_face
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise