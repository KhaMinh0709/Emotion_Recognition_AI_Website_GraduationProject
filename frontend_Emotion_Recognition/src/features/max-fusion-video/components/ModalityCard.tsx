// src/features/max-fusion/components/ModalityCard.tsx
import React from "react";

type ModalityCardProps = {
  title: string;
  label?: string;
  confidence?: number; // 0..1
};

export default function ModalityCard({ title, label, confidence }: ModalityCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-xl font-semibold text-sky-200 mt-1">{label ?? "—"}</div>
      <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500"
          style={{ width: `${Math.round((confidence ?? 0) * 100)}%` }}
        />
      </div>
      <div className="text-xs text-slate-400 mt-1">
        {Math.round((confidence ?? 0) * 100)}%
      </div>
    </div>
  );
}
