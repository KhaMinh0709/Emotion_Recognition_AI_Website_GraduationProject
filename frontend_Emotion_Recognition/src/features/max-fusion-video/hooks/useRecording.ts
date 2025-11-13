// src/features/max-fusion/hooks/useRecording.ts
import { useEffect, useRef, useState } from "react";

type UseRecordingOptions = {
  maxSeconds?: number;
};

export function useRecording({ maxSeconds = 60 }: UseRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRecording(videoEl?: HTMLVideoElement | null) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 640, height: 480 },
    });
    streamRef.current = stream;

    if (videoEl) {
      videoEl.srcObject = stream;
      videoEl.controls = false;
      await videoEl.play().catch(() => {});
    }

    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    recordedChunksRef.current = [];

    mr.ondataavailable = (ev) => {
      if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
    };
    mr.onstop = () => {
      stopStream();
      setIsRecording(false);
      clearInterval(timerRef.current);
      setSeconds(0);
    };

    mr.start();
    setIsRecording(true);
    setSeconds(0);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        const n = s + 1;
        if (n >= maxSeconds) {
          stopRecording();
        }
        return n;
      });
    }, 1000);
  }

  function stopStream() {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    } catch {}
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") {
      mr.stop();
    } else {
      stopStream();
    }
  }

  function getRecordedFile(): File | null {
    if (!recordedChunksRef.current.length) return null;
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    return new File([blob], "recording.webm", { type: blob.type });
  }

  return {
    isRecording,
    seconds,
    startRecording,
    stopRecording,
    getRecordedFile,
  };
}
