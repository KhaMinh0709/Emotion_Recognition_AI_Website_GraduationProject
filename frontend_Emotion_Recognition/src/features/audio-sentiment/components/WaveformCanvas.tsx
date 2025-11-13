// audio-sentiment/components/WaveformCanvas.tsx
import React, { useEffect, useRef } from "react";

const WaveformCanvas: React.FC<{
  audioBuffer?: AudioBuffer;
  height?: number;
}> = ({ audioBuffer, height = 96 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = height * dpr;
    canvas.width = width;
    canvas.height = h;

    ctx.clearRect(0, 0, width, h);
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(1, "#6366f1");
    ctx.fillStyle = grad;

    if (!audioBuffer) {
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < width; i += 8) {
        const barH = (Math.sin(i * 0.01) * 0.5 + 0.5) * (h * 0.35);
        const y = h / 2 - barH / 2;
        ctx.fillRect(i, y, 5, barH);
      }
      ctx.globalAlpha = 1;
      return;
    }

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    for (let i = 0; i < width; i++) {
      let min = 1.0,
        max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j] || 0;
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const yMax = (1 + max) * (h / 2);
      const yMin = (1 + min) * (h / 2);
      ctx.fillRect(i, yMin, 1, Math.max(1, yMax - yMin));
    }
  }, [audioBuffer, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
      <canvas ref={canvasRef} className="w-full" style={{ height }} />
    </div>
  );
};

export default WaveformCanvas;
