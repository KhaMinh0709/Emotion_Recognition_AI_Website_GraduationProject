// src/features/max-fusion/components/Step.tsx
import React from "react";
import { cn } from "@/features/max-fusion-video/utils/uiTokens";

type StepProps = {
  idx: number;
  text: string;
  active: boolean;
  done: boolean;
};

export default function Step({ idx, text, active, done }: StepProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-sm border",
          done
            ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
            : active
            ? "bg-sky-500/20 border-sky-400/40 text-sky-200"
            : "bg-white/5 border-white/10 text-slate-300"
        )}
      >
        {done ? "✓" : idx}
      </div>
      <div
        className={cn(
          "text-slate-300",
          active && "text-sky-200",
          done && "text-emerald-200"
        )}
      >
        {text}
      </div>
    </div>
  );
}
