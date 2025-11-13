# Backend Emotion Recognition API

This project implements a FastAPI-based backend service for emotion recognition using both facial and audio inputs.

## Project Structure

```
BACKEND_EMOTION_RECOGNITION/
│
├── app/                         # Main application package
│   ├── main.py                 # FastAPI application entry point
│   ├── api/                    # API route definitions
│   ├── core/                   # Core configuration
│   ├── models/                 # ML/DL model implementations
│   ├── services/               # Business logic layer
│   ├── schemas/               # Pydantic models
│   ├── utils/                 # Utility functions
│   └── static/                # Static file storage
│
├── models/                    # Trained model files
└── requirements.txt          # Python dependencies
```

## Setup

1. Create a virtual environment:
```bash
cd Backend_Emotion_Recognition
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
```bash
.\venv\Scripts\Activate.ps1
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place your trained models in the `models/` directory:
- `face_model.h5` for facial emotion recognition
- `audio_model.pth` for audio emotion recognition
- `fusion_model.pth` for multimodal fusion

## Running the Application

Start the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Face Emotion Recognition
- POST `/face/upload`: Upload face image
- POST `/face/predict`: Predict emotion from face image

### Audio Emotion Recognition
- POST `/audio/upload`: Upload audio file
- POST `/audio/predict`: Predict emotion from audio

### Multimodal Fusion
- POST `/fusion/predict`: Predict emotion using both face and audio inputs

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
DEBUG=True
MAX_UPLOAD_SIZE=10485760
```
## Api documents
Swagger UI (giao diện tương tác, “Try it out”):
http://localhost:8000/docs

ReDoc (tài liệu đọc):
http://localhost:8000/redoc

Raw OpenAPI JSON (nếu cần):
http://localhost:8000/openapi.json

##🚀 HƯỚNG DẪN CÀI FFMPEG:
Bước 1: Mở PowerShell as Administrator
Nhấn Windows + X
Chọn "Windows PowerShell (Admin)" hoặc "Terminal (Admin)"
Bước 2: Kiểm tra có Chocolatey chưa
Gõ lệnh này:
```bash
choco
```
Nếu có, Chocolatey sẽ hiển thị logo và thông tin. Nếu không, cài Chocolatey:
```bash
Bước 3: Cài Chocolatey (nếu chưa có)
Copy và paste lệnh này vào PowerShell:
```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```bash
Bước 4: Cài ffmpeg
Gõ lệnh này:
```bash
choco install ffmpeg
```bash
Bước 5: Kiểm tra lại
Gõ lệnh này:
```bash
ffmpeg -version
```bash
Nếu có, ffmpeg đã được cài đặt thành công.

### CLIENT
  ↓ File audio (MP3/WebM/WAV/OGG...) - bất kỳ format
  
BACKEND ENDPOINT (/audio/predict)
  ↓ UploadFile object
  
AudioService.predict()
  ↓ bytes của file audio
  
_convert_to_wav()
  ↓ bytes của WAV file (chuẩn hóa)
  
soundfile.read()
  ↓ numpy array (n_samples,) + sample_rate
  
_get_predict_feat_from_array()
  ↓ numpy array (1, 2376, 1) - features
  
CNN MODEL
  ↓ numpy array (1, 7) - xác suất 7 emotions
  
Encoder.inverse_transform()
  ↓ emotion name + confidence + all_emotions
  
RESPONSE
  ↓ JSON: {emotion, confidence, all_emotions}
  
CLIENT
  ✅ Hiển thị kết quả