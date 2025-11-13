// src/features/max-fusion/components/Sparkline.tsx
import React from "react";

export default function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return <div className="h-[54px]" />;

  const w = 420;
  const h = 54;
  const pad = 6;
  const xs = data.map((_, i) => (i / (data.length - 1)) * (w - pad * 2) + pad);
  const ys = data.map((v) => (1 - v) * (h - pad * 2) + pad);
  const d = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[54px]">
      <path d={d} fill="none" stroke="currentColor" className="text-sky-400/80" strokeWidth="2.5" />
    </svg>
  );
}
