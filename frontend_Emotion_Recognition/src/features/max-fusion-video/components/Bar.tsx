// src/features/max-fusion/components/Bar.tsx
import React from "react";

export default function Bar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  return (
    <div className="h-1.5 rounded-full bg-slate-900/60 border border-white/10 overflow-hidden">
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg,rgba(56,189,248,1),rgba(99,102,241,1))",
          backgroundSize: "300% 100%",
          animation: "moveX 2.4s linear infinite",
        }}
      />
    </div>
  );
}
