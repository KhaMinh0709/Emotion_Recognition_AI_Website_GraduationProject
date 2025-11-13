// audio-sentiment/components/VUMeter.tsx
import React from "react";

const VUMeter: React.FC<{ level: number }> = ({ level }) => (
  <div className="h-3 w-full rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
    <div
      className="h-full transition-[width] duration-75"
      style={{
        width: `${Math.min(100, Math.max(3, level * 100))}%`,
        background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
      }}
    />
  </div>
);

export default VUMeter;
