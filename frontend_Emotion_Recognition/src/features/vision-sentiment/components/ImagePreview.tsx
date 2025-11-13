// vision-sentiment/components/ImagePreview.tsx
import React, { useEffect, useRef, useState } from "react";
import type { Box } from "../types";

const drawBoxes = (
  ctx: CanvasRenderingContext2D,
  boxes: Box[],
  scale: number,
  activeId: number | null,
  faceEmotions?: Record<number, { emotion: string; confidence: number }>
) => {
  ctx.save();
  
  // Vẽ tất cả các boxes
  boxes.forEach((box) => {
    const isActive = box.id === activeId;
    const emotionData = faceEmotions?.[box.id];
    
    const x = box.x * scale;
    const y = box.y * scale;
    const w = box.w * scale;
    const h = box.h * scale;
    
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
      const fontSize = Math.max(12, Math.min(16, w / 8)); // Responsive font size
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

type ImagePreviewProps = {
  sourceUrl?: string | null;
  boxes: Box[];
  activeId: number | null;
  faceEmotions?: Record<number, { emotion: string; confidence: number }>;
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  sourceUrl,
  boxes,
  activeId,
  faceEmotions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!sourceUrl) {
      setImg(null);
      return;
    }
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = sourceUrl;
  }, [sourceUrl]);

  // Draw image và boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const maxW = 480; // Giảm từ 880 xuống 480 để preview nhỏ gọn hơn
    const ratio = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);

    // Resize canvas nếu cần
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.style.maxWidth = "100%";
    }

    // Luôn reset transform về đúng
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Vẽ lại ảnh và boxes mỗi khi img, boxes, hoặc activeId thay đổi
    ctx.fillStyle = "rgba(15,23,42,.6)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0, w, h);

    // Vẽ boxes với scale đúng (boxes coordinates từ API là theo ảnh gốc)
    if (boxes.length > 0) {
      drawBoxes(ctx, boxes, ratio, activeId, faceEmotions);
    }
  }, [img, boxes, activeId, faceEmotions]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 min-h-[240px] grid place-items-center">
      {img ? (
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      ) : sourceUrl ? (
        <div className="text-slate-400 text-sm">Loading image...</div>
      ) : null}
    </div>
  );
};
