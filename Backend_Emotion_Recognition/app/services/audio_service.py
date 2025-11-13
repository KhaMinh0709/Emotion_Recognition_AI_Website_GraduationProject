import os
import io
import pickle
from pathlib import Path

import numpy as np
import librosa
from fastapi import UploadFile, HTTPException

from app.core.config import settings
from app.core.logger import setup_logger
from app.utils.image_utils import save_upload_file

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf
from tensorflow.keras.models import model_from_json

logger = setup_logger(__name__)


class AudioService:
    """Service to handle audio uploads and predictions."""

    def __init__(self):
        self.model = None

        # fallback nếu không có encoder
        self.emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

        self.scaler = None
        self.encoder = None

        # giống notebook
        self.n_mfcc = 20
        self.expected_size = 2376
        self.duration = 2.5
        self.offset = 0.6
        self.target_sr = 22050

    # ------------------------------------------------------------------ #
    # 1. Load model + scaler + encoder
    # ------------------------------------------------------------------ #
    def _load_model(self):
        if self.model is not None:
            return self.model

        json_path = settings.MODEL_DIR / "audio" / "CNN_model.json"
        weights_path = settings.MODEL_DIR / "audio" / "best_model1_weights.h5"

        if not json_path.exists():
            raise FileNotFoundError(f"Không tìm thấy JSON model tại {json_path}")
        if not weights_path.exists():
            raise FileNotFoundError(f"Không tìm thấy file weights tại {weights_path}")

        try:
            with open(json_path, "r") as f:
                model_json = f.read()
            self.model = model_from_json(model_json)
            self.model.load_weights(str(weights_path))
            logger.info("Model audio loaded from JSON + weights.")
        except Exception as e:
            logger.error(f"Lỗi khi load model JSON + weights: {e}")
            raise

        # scaler + encoder (giống Colab)
        scaler_path = settings.MODEL_DIR / "audio" / "scaler2.pickle"
        encoder_path = settings.MODEL_DIR / "audio" / "encoder2.pickle"

        try:
            if scaler_path.exists():
                with open(scaler_path, "rb") as f:
                    self.scaler = pickle.load(f)
                logger.info(f"Loaded scaler from {scaler_path}")
            else:
                logger.info("No scaler2.pickle found; predictions will skip scaling")

            if encoder_path.exists():
                with open(encoder_path, "rb") as f:
                    self.encoder = pickle.load(f)
                logger.info(f"Loaded encoder from {encoder_path}")
            else:
                logger.info("No encoder2.pickle found; using default emotion order")
        except Exception as e:
            logger.warning(f"Could not load scaler/encoder: {e}")

        return self.model

    # ------------------------------------------------------------------ #
    # 2. Feature extraction
    # ------------------------------------------------------------------ #
    def _zcr(self, data, frame_length=2048, hop_length=512):
        z = librosa.feature.zero_crossing_rate(data, frame_length=frame_length, hop_length=hop_length)
        return np.squeeze(z)

    def _rmse(self, data, frame_length=2048, hop_length=512):
        r = librosa.feature.rms(y=data, frame_length=frame_length, hop_length=hop_length)
        return np.squeeze(r)

    def _mfcc(self, data, sr, frame_length=2048, hop_length=512, flatten: bool = True):
        m = librosa.feature.mfcc(y=data, sr=sr, n_mfcc=self.n_mfcc)
        return np.squeeze(m.T) if not flatten else np.ravel(m.T)

    def _extract_features(self, data, sr=22050, frame_length=2048, hop_length=512):
        result = np.array([])
        result = np.hstack(
            (
                result,
                self._zcr(data, frame_length, hop_length),
                self._rmse(data, frame_length, hop_length),
                self._mfcc(data, sr, frame_length, hop_length),
            )
        )
        return result

    def _get_predict_feat_from_waveform(self, data, sr):
        """
        data, sr đã được librosa.load(..., sr=22050, duration, offset)
        """
        if sr != self.target_sr:
            logger.warning(f"Expected sr={self.target_sr}, but got {sr}. Resampling...")
            data = librosa.resample(data, orig_sr=sr, target_sr=self.target_sr)
            sr = self.target_sr


        logger.info(f"Waveform after librosa.load: {data.shape[0]} samples, sr={sr}")

        res = self._extract_features(data, sr)
        result = np.array(res)

        # pad / truncate về expected_size = 2376
        if result.shape[0] < self.expected_size:
            result = np.pad(result, (0, self.expected_size - result.shape[0]), mode="constant")
        elif result.shape[0] > self.expected_size:
            result = result[: self.expected_size]

        result = np.reshape(result, newshape=(1, self.expected_size))

        # scaler2.transform giống Colab
        if self.scaler is not None:
            try:
                i_result = self.scaler.transform(result)
            except Exception as e:
                logger.warning(f"Scaler transform failed, using raw features: {e}")
                i_result = result
        else:
            i_result = result

        final_result = np.expand_dims(i_result, axis=2)
        return final_result.astype("float32")

    # ------------------------------------------------------------------ #
    # 3. Upload file
    # ------------------------------------------------------------------ #
    async def process_audio(self, file: UploadFile):
        try:
            if file.content_type not in settings.ALLOWED_AUDIO_TYPES:
                raise HTTPException(status_code=400, detail=f"Audio type not allowed: {file.content_type}")

            saved = await save_upload_file(file, "audios")
            return {"message": "File uploaded successfully", "file_path": str(saved)}
        except Exception as e:
            logger.error(f"Error saving audio file: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    # ------------------------------------------------------------------ #
    # 4. Predict
    # ------------------------------------------------------------------ #
    async def predict(self, audio_input):
        """
        Predict emotion from WAV audio file.
        Pipeline cố gắng bám sát Colab nhất có thể.
        """
        try:
            model = self._load_model()

            # đọc bytes
            if hasattr(audio_input, "read"):
                logger.info(f"Reading WAV from UploadFile: {getattr(audio_input, 'filename', 'unknown')}")
                contents = await audio_input.read()
            elif isinstance(audio_input, (bytes, bytearray)):
                logger.info(f"Reading WAV from bytes: {len(audio_input)} bytes")
                contents = bytes(audio_input)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported audio input type: {type(audio_input)}")

            # 🎯 DÙNG LIBROSA.GIỐNG COLAB
            try:
                audio_buffer = io.BytesIO(contents)
                # sr=22050 (target_sr), duration & offset giống hệt notebook
                data, sr = librosa.load(
                    audio_buffer,
                    sr=self.target_sr,
                    duration=self.duration,
                    offset=self.offset,
                )
                logger.info(f"librosa.load -> {data.shape[0]} samples, sr={sr}")
            except Exception as e:
                logger.error(f"Error reading WAV with librosa: {e}")
                raise HTTPException(status_code=400, detail=f"Cannot read WAV file: {e}")

            # trích features giống get_predict_feat
            feat_arr = self._get_predict_feat_from_waveform(data, sr)

            # predict
            preds = model.predict(feat_arr)
            preds = np.asarray(preds).squeeze()
            logger.info(f"Raw predictions shape: {preds.shape}, values: {preds}")

            # dùng encoder đúng thứ tự label
            if self.encoder is not None and hasattr(self.encoder, "categories_"):
                emotion_labels = list(self.encoder.categories_[0])

                preds_2d = preds.reshape(1, -1)
                y_pred = self.encoder.inverse_transform(preds_2d)
                predicted_emotion = y_pred[0][0]

                all_emotions = {emotion_labels[i]: float(preds[i]) for i in range(len(emotion_labels))}
                confidence = float(preds[emotion_labels.index(predicted_emotion)])

                logger.info(f"Predicted emotion: {predicted_emotion}, confidence: {confidence}")

                return {
                    "emotion": predicted_emotion,
                    "confidence": confidence,
                    "all_emotions": all_emotions,
                }

            # fallback nếu không có encoder
            logger.warning("No encoder found, using default emotion order")
            labels = self.emotions
            all_emotions = {labels[i]: float(preds[i]) for i in range(min(len(labels), preds.size))}
            top_idx = int(np.argmax(preds))
            emotion = labels[top_idx]
            confidence = float(preds[top_idx])

            return {
                "emotion": emotion,
                "confidence": confidence,
                "all_emotions": all_emotions,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error in audio prediction: {e}")
            raise HTTPException(status_code=400, detail=str(e))
