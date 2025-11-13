// vision-sentiment/hooks/useCamera.ts
import { useEffect, useRef, useState } from "react";

export const useCamera = (enabled: boolean) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camReady, setCamReady] = useState(false);

  useEffect(() => {
    if (enabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => setCamReady(true);
      }
    } catch {
      setCamReady(false);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCamReady(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const takeSnapshot = () => {
    const v = videoRef.current;
    if (!v) return null;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0);
    return c.toDataURL("image/jpeg", 0.92);
  };

  return {
    videoRef,
    camReady,
    stream,
    startCamera,
    stopCamera,
    takeSnapshot,
  };
};
