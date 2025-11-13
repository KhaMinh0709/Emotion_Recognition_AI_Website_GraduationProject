// audio-sentiment/hooks/useAudioAnalysis.ts
import { useState } from "react";
import { analyzeAudioFile, analyzeAudioBlob } from "../services/audioService";
import type { AudioSentimentResult } from "../types";

export const useAudioAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AudioSentimentResult | null>(null);

  const analyzeFromFile = async (file: File | null) => {
    if (!file) {
      setError("Chưa có audio để phân tích.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeAudioFile(file);
      setResult(res);
    } catch (e) {
      setError("Kết nối gián đoạn. Thử lại?");
    } finally {
      setLoading(false);
    }
  };

  const analyzeFromBlob = async (blob: Blob | null) => {
    if (!blob) {
      setError("Chưa có audio để phân tích.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeAudioBlob(blob);
      setResult(res);
    } catch (e) {
      setError("Kết nối gián đoạn. Thử lại?");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    analyzeFromFile,
    analyzeFromBlob,
    setError,
  };
};
