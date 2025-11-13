from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import face_routes, audio_routes

app = FastAPI(title="Emotion Recognition API")

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(face_routes.router, prefix="/face", tags=["Face"])
app.include_router(audio_routes.router, prefix="/audio", tags=["Audio"])

@app.get("/")
async def root():
    return {"message": "Welcome to Emotion Recognition API"}

@app.get("/health")
async def health():
    """Health check endpoint to verify server is running"""
    return {"status": "ok"}