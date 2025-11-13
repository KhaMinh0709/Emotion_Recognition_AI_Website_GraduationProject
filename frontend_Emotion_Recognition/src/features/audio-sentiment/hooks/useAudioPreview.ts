// audio-sentiment/hooks/useAudioPreview.ts
import { useEffect, useMemo, useState } from "react";
import type { AudioQuality } from "../types";

export const useAudioPreview = (source: File | Blob | null) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>();
  const [quality, setQuality] = useState<AudioQuality>({});

  useEffect(() => {
    if (!source) {
      setAudioUrl(null);
      setAudioBuffer(undefined);
      setQuality({});
      return;
    }

    const url = URL.createObjectURL(source);
    setAudioUrl(url);

    (async () => {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const arrayBuf = await source.arrayBuffer();
      try {
        const decoded = await ctx.decodeAudioData(arrayBuf);
        setAudioBuffer(decoded);
        const ch = decoded.getChannelData(0);
        const rms = Math.sqrt(ch.reduce((s, v) => s + v * v, 0) / ch.length);
        setQuality({ rms });
      } catch {
        setAudioBuffer(undefined);
      }
    })();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [source]);

  const qualityWarnings = useMemo(() => {
    const arr: string[] = [];
    if (quality.rms !== undefined && quality.rms < 0.015) {
      arr.push("Âm lượng thấp. Hãy nói gần micro hơn hoặc tăng gain.");
    }
    return arr;
  }, [quality]);

  return {
    audioUrl,
    audioBuffer,
    quality,
    qualityWarnings,
  };
};
