// audio-sentiment/hooks/useRecorder.ts
import { useRef, useState } from "react";

const RECORD_TIME_LIMIT = 60_000; // 60s

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(b);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);

      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        setLevel(Math.min(1, rms * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      recordingTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setError("Recording reached 60 second limit");
        }
      }, RECORD_TIME_LIMIT);
    } catch {
      setError("Không thể truy cập micro.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recordingTimeoutRef.current != null) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  return {
    isRecording,
    level,
    error,
    recordedBlob,
    startRecording,
    stopRecording,
    setError,
    setRecordedBlob,
  };
};
