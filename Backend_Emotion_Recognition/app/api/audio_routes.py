from fastapi import APIRouter, UploadFile, File, Request
from fastapi.responses import JSONResponse
from app.services.audio_service import AudioService
from app.schemas.audio_schema import AudioResponse, AudioUploadResponse
from typing import Dict, Any

router = APIRouter()
audio_service = AudioService()


@router.post("/upload", response_model=AudioUploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    """Upload an audio file"""
    result = await audio_service.process_audio(file)
    return result


@router.post("/predict")
async def predict_audio(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Predict emotion from uploaded audio file"""
    result = await audio_service.predict(file)
    return JSONResponse(content=result)


@router.post("/predict-base64")
async def predict_audio_base64(request: Request) -> Dict[str, Any]:
    """Predict emotion from base64-encoded audio in JSON body.

    JSON body should be: { "audio_base64": "data:audio/wav;base64,..." }
    """
    try:
        data = await request.json()
        audio_b64 = data.get("audio_base64", "")
        if not audio_b64:
            return JSONResponse(status_code=400, content={"detail": "Missing audio_base64 field"})

        # remove data:...;base64, prefix if present
        b64_data = audio_b64.split(",", 1)[1] if "," in audio_b64 else audio_b64
        import base64

        audio_bytes = base64.b64decode(b64_data)

        result = await audio_service.predict(audio_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=400, content={"detail": str(e)})
