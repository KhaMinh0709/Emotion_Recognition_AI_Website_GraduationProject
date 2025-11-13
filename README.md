# 🎭 Emotion AI Analyzer

> **Multimodal Emotion Recognition System**
> Analyze emotions from text, audio, and facial expressions using advanced AI technology

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-FF6F00?logo=tensorflow)](https://www.tensorflow.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1.0-EE4C2C?logo=pytorch)](https://pytorch.org/)

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 Introduction

**Emotion AI Analyzer** is a comprehensive emotion recognition system that uses Deep Learning technology to analyze emotions from multiple data sources:

- 🔊 **Audio Emotion Recognition** - Recognize emotions from voice
- 👁️ **Vision/Face Emotion Recognition** - Detect emotions through facial expressions
- ⚖️ **Multimodal Fusion** - Combine results from multiple modalities for the most accurate analysis

The system is built with a modern web interface, powerful API, and AI chatbot to support users.

---

## ✨ Key Features

### 🎨 Frontend Features
- ✅ Modern user interface with React + TypeScript + Vite
- ✅ Intuitive dashboard displaying analysis results
- ✅ Real-time file upload and processing (images, audio)
- ✅ Data visualization charts with Recharts
- ✅ Responsive design with Tailwind CSS
- ✅ Lazy loading and code splitting for performance optimization
- ✅ AI-powered chat widget (Gemini) for user support

### 🧠 Backend Features
- ✅ RESTful API with FastAPI
- ✅ Facial emotion recognition (7 emotions: angry, disgust, fear, happy, neutral, sad, surprise)
- ✅ Audio emotion analysis (WAV, WEBA formats)
- ✅ Image processing with OpenCV and TensorFlow
- ✅ Audio processing with librosa
- ✅ Model fusion to combine results from multiple sources
- ✅ CORS middleware for cross-origin requests
- ✅ Health check endpoint

### 🤖 Chat Server Features
- ✅ AI chatbot using Google Gemini
- ✅ Project Knowledge Base (KB)
- ✅ Rate limiting for API protection
- ✅ Authentication with shared secret
- ✅ Dynamic KB reload without server restart

---

## 🏗️ System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│   Frontend      │────────▶│  Backend API     │         │   Chat Server   │
│   (React)       │         │  (FastAPI)       │         │   (Node.js)     │
│   Port: 5173    │         │  Port: 8000      │         │   Port: 5174    │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                            │
        │                            │                            │
        ▼                            ▼                            ▼
   UI Components              ML Models                   Gemini AI API
   - Dashboard               - Face Model                 - Knowledge Base
   - Upload Forms            - Audio Model                - Chat Context
   - Charts                  - Fusion Model
```

### Processing Flow:
1. **User** uploads file (image/audio) via Frontend
2. **Frontend** sends request to Backend API
3. **Backend** processes file with ML models
4. **Backend** returns analysis results (emotion + confidence score)
5. **Frontend** displays results on dashboard
6. **User** can chat with AI assistant for support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|-----------|----------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.1.7 | Build Tool |
| React Router | 7.9.5 | Routing |
| Tailwind CSS | 4.1.14 | Styling |
| Recharts | 3.2.1 | Data Visualization |
| Framer Motion | 12.23.24 | Animations |
| Lucide React | 0.545.0 | Icons |

### Backend (Python)
| Technology | Version | Purpose |
|-----------|-----------|----------|
| FastAPI | 0.104.1 | Web Framework |
| Uvicorn | 0.24.0 | ASGI Server |
| TensorFlow | 2.20.0 | Deep Learning (Face) |
| PyTorch | 2.1.0 | Deep Learning (Audio) |
| OpenCV | 4.8.1 | Image Processing |
| librosa | 0.10.1 | Audio Processing |
| NumPy | 1.26.0+ | Numerical Computing |
| Pandas | 2.1.2 | Data Processing |

### Chat Server (Node.js)
| Technology | Version | Purpose |
|-----------|-----------|----------|
| Express | 4.18.2 | Web Framework |
| Google Generative AI | 0.18.0 | Gemini Integration |
| CORS | 2.8.5 | Cross-Origin Support |
| dotenv | 16.4.5 | Environment Variables |

---

## 📦 Installation

### System Requirements
- **Node.js**: >= 18.x
- **Python**: >= 3.9
- **npm** or **yarn** or **pnpm**
- **pip** or **conda**

### 1️⃣ Clone repository

```bash
git clone https://github.com/KhaMinh0709/emotion-ai-analyze-graduation_project.git
cd emotion-ai-analyze-graduation_project
```

### 2️⃣ Install Frontend

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Install Backend

```bash
cd Backend_Emotion_Recognition

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4️⃣ Install Chat Server

```bash
cd server
npm install
```

### 5️⃣ Prepare Models

Place your trained model files in the `Backend_Emotion_Recognition/models/` directory:

```
models/
├── faces/
│   └── face_emotion_model.keras
└── audio/
    └── best_model1_weights.h5
```

---

## ⚙️ Configuration

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_CHAT_API=http://localhost:5174
VITE_CHAT_SHARED_SECRET=your_shared_secret_here
```

### Backend (.env)

Create a `.env` file in the `Backend_Emotion_Recognition/` directory:

```env
DEBUG=True
MAX_UPLOAD_SIZE=10485760
```

### Chat Server (.env)

Create a `.env` file in the `server/` directory:

```env
PORT=5174
SHARED_SECRET=your_shared_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ **Note**: `VITE_CHAT_SHARED_SECRET` (frontend) and `SHARED_SECRET` (server) must be identical!

---

## 🚀 Running the Application

### Development Mode

Open 3 separate terminals:

#### Terminal 1: Frontend
```bash
cd frontend
npm run dev
```
➡️ Access: http://localhost:5173

#### Terminal 2: Backend API
```bash
cd Backend_Emotion_Recognition
# Activate venv if not already activated
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
➡️ API: http://localhost:8000
➡️ Swagger UI: http://localhost:8000/docs
➡️ ReDoc: http://localhost:8000/redoc

#### Terminal 3: Chat Server
```bash
cd server
npm run dev
```
➡️ Chat API: http://localhost:5174

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

#### Backend
```bash
cd Backend_Emotion_Recognition
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Chat Server
```bash
cd server
npm start
```

---

## 📚 API Documentation

### Backend Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Face Emotion Recognition

**Upload Face Image:**
```http
POST /face/upload
Content-Type: multipart/form-data

file: <image_file>
```

**Predict Emotion:**
```http
POST /face/predict
Content-Type: multipart/form-data

file: <image_file>
```

**Response:**
```json
{
  "emotion": "happy",
  "confidence": 0.95,
  "all_predictions": {
    "angry": 0.01,
    "disgust": 0.00,
    "fear": 0.02,
    "happy": 0.95,
    "neutral": 0.01,
    "sad": 0.00,
    "surprise": 0.01
  }
}
```

#### Audio Emotion Recognition

**Upload Audio:**
```http
POST /audio/upload
Content-Type: multipart/form-data

file: <audio_file>
```

**Predict Emotion:**
```http
POST /audio/predict
Content-Type: multipart/form-data

file: <audio_file>
```

### Chat Server Endpoints

**Chat:**
```http
POST /api/chat
Content-Type: application/json
x-chat-secret: <your_shared_secret>

{
  "message": "How does this system work?"
}
```

**Reload Knowledge Base:**
```http
POST /admin/reload-kb
Content-Type: application/json
x-chat-secret: <your_shared_secret>
```

---

## 📁 Project Structure

```
emotion-ai-analyze-graduation_project/
│
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── features/                 # Feature modules
│   │   ├── pages/                    # Page components
│   │   ├── utils/                    # Utility functions
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── App.tsx                   # Main App component
│   │   └── main.tsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── .env                          # Environment variables
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── Backend_Emotion_Recognition/      # FastAPI Backend
│   ├── app/
│   │   ├── api/                      # API routes
│   │   │   ├── face_routes.py
│   │   │   └── audio_routes.py
│   │   ├── core/                     # Core config
│   │   │   └── config.py
│   │   ├── models/                   # ML model classes
│   │   ├── services/                 # Business logic
│   │   ├── schemas/                  # Pydantic schemas
│   │   ├── utils/                    # Utilities
│   │   ├── static/                   # Static files
│   │   │   ├── uploads/
│   │   │   └── results/
│   │   └── main.py                   # FastAPI app
│   ├── models/                       # Trained models
│   │   ├── faces/
│   │   │   └── face_emotion_model.keras
│   │   └── audio/
│   │       └── best_model1_weights.h5
│   ├── requirements.txt
│   ├── .env
│   └── run.sh
│
├── server/                           # Node.js Chat Server
│   ├── kb/                           # Knowledge Base
│   │   └── app_context.md
│   ├── index.js                      # Express server
│   ├── env.js                        # Environment config
│   ├── package.json
│   └── .env
│
└── README.md                         # This file
```

---

## 🤝 Contributing

All contributions are welcome! Please:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is developed for educational and research purposes.

---

## 👥 Authors

**Nguyen Kha Minh**
**Tran Minh Chau**

---

## 🙏 Acknowledgments

- TensorFlow & PyTorch communities
- FastAPI framework
- React & Vite teams
- Google Gemini AI
- OpenCV & librosa libraries

---

## 📞 Contact

If you have any questions, please contact us via:
- Email: khaminh.developer0709@gmail.com
- phone: 0373254600
---

**⭐ If you find this project useful, don't forget to give it a star! ⭐**
