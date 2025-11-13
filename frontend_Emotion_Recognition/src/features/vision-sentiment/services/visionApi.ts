export type FaceLocation = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type DetectedFace = {
  face_id: number;
  location: FaceLocation;
  cropped_face_base64?: string; // Optional base64 encoded cropped face
};

export type FaceDetectResponse = {
  faces: DetectedFace[];
  total_faces: number;
  image_width: number;
  image_height: number;
};

export type FacePredictResponse = {
  emotion: string;
  confidence: number;
  face_location?: FaceLocation | FaceLocation[];
  all_emotions?: Record<string, number>;
  result_url?: string; // preferred: public URL
  result_image?: string; // fallback: server file path (not directly usable from browser)
};

export type FaceBatchPredictResponse = {
  results: FacePredictResponse[];
};

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * Detect all faces in an uploaded image
 */
export const detectFacesFromBlob = async (
  blob: Blob,
  includeCropped: boolean = false
): Promise<FaceDetectResponse> => {
  const fd = new FormData();
  fd.append("file", blob, "upload.jpg");

  const url = new URL(`${BASE}/face/detect`);
  if (includeCropped) {
    url.searchParams.set("include_cropped", "true");
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    body: fd,
  });
  
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Detect faces failed: ${res.status} ${res.statusText} ${txt}`);
  }
  
  return await res.json();
};

/**
 * Detect faces from data URL
 */
export const detectFacesFromDataUrl = async (
  dataUrl: string,
  includeCropped: boolean = false
): Promise<FaceDetectResponse> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return detectFacesFromBlob(blob, includeCropped);
};

/**
 * Predict emotion from a cropped face image
 */
export const predictEmotionFromCroppedFace = async (
  croppedFaceBlob: Blob,
  options?: { skipSave?: boolean }
): Promise<FacePredictResponse> => {
  const fd = new FormData();
  fd.append("file", croppedFaceBlob, "cropped_face.jpg");

  const url = new URL(`${BASE}/face/predict`);
  url.searchParams.set("is_cropped_face", "true");
  if (options?.skipSave) {
    url.searchParams.set("skip_save", "true");
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    body: fd,
  });
  
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Predict failed: ${res.status} ${res.statusText} ${txt}`);
  }
  
  return await res.json();
};

/**
 * Predict emotions from multiple cropped face images (batch processing)
 */
export const predictEmotionBatch = async (
  croppedFaceBlobs: Blob[]
): Promise<FaceBatchPredictResponse> => {
  if (croppedFaceBlobs.length === 0) {
    return { results: [] };
  }

  const fd = new FormData();
  croppedFaceBlobs.forEach((blob, index) => {
    fd.append("files", blob, `cropped_face_${index}.jpg`);
  });

  const url = new URL(`${BASE}/face/predict-batch`);

  const res = await fetch(url.toString(), {
    method: "POST",
    body: fd,
  });
  
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Batch predict failed: ${res.status} ${res.statusText} ${txt}`);
  }
  
  return await res.json();
};

export default { 
  detectFacesFromBlob,
  detectFacesFromDataUrl,
  predictEmotionFromCroppedFace,
  predictEmotionBatch
};
