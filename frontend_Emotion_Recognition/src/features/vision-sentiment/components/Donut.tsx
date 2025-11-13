// vision-sentiment/components/Donut.tsx
import React from "react";

export const Donut: React.FC<{ pct: number; size?: number }> = ({
  pct,
  size = 190,
}) => {
  const r = 70;
  const C = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 200 200" className="w-full h-full rotate-[-90deg]">
        <defs>
          <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="rgba(255,255,255,.14)"
          strokeWidth="18"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="url(#gauge)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: C,
            strokeDashoffset: C * (1 - p / 100),
            transition: "stroke-dashoffset .8s cubic-bezier(.2,.9,.2,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-sky-200">{p}%</div>
          <div className="text-xs text-slate-400">confidence</div>
        </div>
      </div>
    </div>
  );
};
