// vision-sentiment/components/RealtimePreview.tsx
import React, { useEffect, useRef } from "react";
import type { Box } from "../types";

type RealtimePreviewProps = {
  stream: MediaStream | null;
  boxes: Box[];
  activeId: number | null;
  faceEmotions?: Record<number, { emotion: string; confidence: number; topK?: { label: string; score: number }[] }>;
};

const drawBoxesOnCanvas = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  boxes: Box[],
  activeId: number | null,
  faceEmotions?: Record<number, { emotion: string; confidence: number; topK?: { label: string; score: number }[] }>
) => {
  ctx.save();
  
  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Vẽ tất cả các boxes
  boxes.forEach((box) => {
    const isActive = box.id === activeId;
    const emotionData = faceEmotions?.[box.id];
    
    const x = box.x;
    const y = box.y;
    const w = box.w;
    const h = box.h;
    
    // Vẽ box
    if (isActive) {
      // Box active với màu xanh lá, đậm hơn
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(12, 242, 123, 1)";
      ctx.fillStyle = "rgba(12, 242, 123, 0.15)";
      ctx.lineWidth = 4;
    } else {
      // Box không active với màu xám
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
      ctx.fillStyle = "rgba(148, 163, 184, 0.1)";
      ctx.lineWidth = 2;
    }
    
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    
    // Vẽ emotion text nếu có
    if (emotionData) {
      const emotion = emotionData.emotion;
      const confidence = emotionData.confidence;
      const emotionText = `${emotion} (${Math.round(confidence * 100)}%)`;
      
      // Thiết lập font
      const fontSize = Math.max(14, Math.min(18, w / 8)); // Responsive font size
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = "top";
      
      // Đo kích thước text
      const metrics = ctx.measureText(emotionText);
      const textWidth = metrics.width;
      const textHeight = fontSize + 4;
      
      // Vẽ background cho text (phía trên box)
      const padding = 6;
      const bgX = x;
      const bgY = Math.max(0, y - textHeight - padding * 2); // Đảm bảo không vượt quá canvas
      const bgWidth = Math.min(textWidth + padding * 2, w); // Không vượt quá width của box
      const bgHeight = textHeight + padding * 2;
      
      // Background với gradient
      const gradient = ctx.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
      if (isActive) {
        gradient.addColorStop(0, "rgba(12, 242, 123, 0.95)");
        gradient.addColorStop(1, "rgba(5, 150, 105, 0.95)");
      } else {
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.95)");
        gradient.addColorStop(1, "rgba(37, 99, 235, 0.95)");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
      
      // Border cho background
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);
      
      // Vẽ text với shadow để nổi bật
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(emotionText, bgX + padding, bgY + padding);
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  });
  
  ctx.restore();
};

export const RealtimePreview: React.FC<RealtimePreviewProps> = ({
  stream,
  boxes,
  activeId,
  faceEmotions,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // gán stream vào video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Vẽ boxes và emotions trên canvas overlay
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const updateCanvas = () => {
      if (!video.videoWidth || !video.videoHeight) {
        animationFrameRef.current = requestAnimationFrame(updateCanvas);
        return;
      }

      // Resize canvas để match video dimensions
      const rect = video.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Tính scale để map boxes từ video dimensions sang canvas dimensions
      const scaleX = rect.width / video.videoWidth;
      const scaleY = rect.height / video.videoHeight;

      // Scale boxes
      const scaledBoxes = boxes.map((box) => ({
        ...box,
        x: box.x * scaleX,
        y: box.y * scaleY,
        w: box.w * scaleX,
        h: box.h * scaleY,
      }));

      // Vẽ boxes và emotions
      drawBoxesOnCanvas(ctx, video, scaledBoxes, activeId, faceEmotions);

      animationFrameRef.current = requestAnimationFrame(updateCanvas);
    };

    updateCanvas();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [boxes, activeId, faceEmotions]);

  return (
    <div className="relative w-full rounded-xl border border-white/10 bg-slate-900/40 min-h-[280px] overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain bg-slate-900"
      />
      {/* Canvas overlay để vẽ boxes và emotions */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};
