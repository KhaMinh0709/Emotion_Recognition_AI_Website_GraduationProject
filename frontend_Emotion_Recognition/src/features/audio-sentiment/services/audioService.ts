// audio-sentiment/services/audioService.ts
import type { AudioSentimentResult } from "../types";
import { makeSineWav } from "../utils/makeSineWav";
import { convertToWav } from "../utils/audioConverter";

// Backend API base URL
const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_ENDPOINT = `${BASE_URL}/audio/predict`;

export async function analyzeAudioFile(
  file: File
): Promise<AudioSentimentResult> {
  // Convert any audio format to WAV before sending to backend
  console.log(`Converting ${file.name} (${file.type}) to WAV...`);
  const wavBlob = await convertToWav(file);
  console.log(`Converted to WAV: ${wavBlob.size} bytes`);

  const fd = new FormData();
  fd.append("file", new File([wavBlob], "audio.wav", { type: "audio/wav" }));

  const start = performance.now();
  const res = await fetch(API_ENDPOINT, { method: "POST", body: fd });
  const latency = Math.round(performance.now() - start);
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Analyze failed: ${res.status} ${errorText}`);
  }
  const json = await res.json();

  // Backend returns: {emotion, confidence, all_emotions}
  // Convert to frontend format: {label, confidence, topK}
  const topK = json.all_emotions
    ? Object.entries(json.all_emotions)
        .map(([label, score]) => ({ label, score: score as number }))
        .sort((a, b) => b.score - a.score)
    : [{ label: json.emotion ?? "neutral", score: json.confidence ?? 0 }];

  return {
    label: json.emotion ?? "neutral",
    confidence: json.confidence ?? 0,
    topK,
    latency,
  };
}

export async function analyzeAudioBlob(
  blob: Blob
): Promise<AudioSentimentResult> {
  // Convert any audio blob (WebM, MP3, etc.) to WAV before sending to backend
  console.log(`Converting blob (${blob.type}) to WAV...`);
  const wavBlob = await convertToWav(blob);
  console.log(`Converted to WAV: ${wavBlob.size} bytes`);

  const fd = new FormData();
  fd.append("file", new File([wavBlob], "recorded_audio.wav", { type: "audio/wav" }));

  const start = performance.now();
  const res = await fetch(API_ENDPOINT, { method: "POST", body: fd });
  const latency = Math.round(performance.now() - start);
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Analyze failed: ${res.status} ${errorText}`);
  }
  const json = await res.json();

  // Backend returns: {emotion, confidence, all_emotions}
  // Convert to frontend format: {label, confidence, topK}
  const topK = json.all_emotions
    ? Object.entries(json.all_emotions)
        .map(([label, score]) => ({ label, score: score as number }))
        .sort((a, b) => b.score - a.score)
    : [{ label: json.emotion ?? "neutral", score: json.confidence ?? 0 }];

  return {
    label: json.emotion ?? "neutral",
    confidence: json.confidence ?? 0,
    topK,
    latency,
  };
}

// demo sample – bạn có thể đổi thành fetch từ server
export async function fetchDemoSample(): Promise<File> {
  const demoBlob = makeSineWav(1, 440, 16000);
  return new File([demoBlob], "demo.wav", { type: "audio/wav" });
}
