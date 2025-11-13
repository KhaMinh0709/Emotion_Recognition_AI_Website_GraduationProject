// src/features/max-fusion/components/Ring.tsx
import React from "react";

type RingProps = {
  value: number; // 0..1
  size?: number;
};

export default function Ring({ value, size = 132 }: RingProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  const ring = `conic-gradient(#22d3ee ${pct * 3.6}deg, #0b1220 0)`;
  return (
    <div className="grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="rounded-full p-2"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(120deg,#22d3ee33,#6366f133)",
        }}
      >
        <div
          className="rounded-full grid place-items-center"
          style={{ width: "100%", height: "100%", background: ring }}
        >
          <div className="rounded-full bg-slate-900/80 border border-white/10 w-[78%] h-[78%] grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-sky-200">{pct}%</div>
              <div className="text-xs text-slate-400">confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
