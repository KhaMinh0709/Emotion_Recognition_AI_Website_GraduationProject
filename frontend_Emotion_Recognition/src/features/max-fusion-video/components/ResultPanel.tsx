// src/features/max-fusion/components/ResultPanel.tsx
import React from "react";
import { tokens } from "@/features/max-fusion-video/utils/uiTokens";
import Sparkline from "./Sparkline";
import ModalityCard from "./ModalityCard";

export type ModelScore = { label: string; score: number; modality?: string };
export type TimelineItem = {
  t: number;
  text?: ModelScore;
  audio?: ModelScore;
  vision?: ModelScore;
  fused?: ModelScore;
};

type ResultPanelProps = {
  timeline: TimelineItem[];
  overall: ModelScore | null;
  textProg?: number;   // 0..1
  audioProg?: number;  // 0..1
  visionProg?: number; // 0..1
  overallProg?: number;// 0..1
};

export default function ResultPanel({
  timeline,
  overall,
  textProg,
  audioProg,
  visionProg,
  overallProg,
}: ResultPanelProps) {
  const last = timeline.length ? timeline[timeline.length - 1] : null;
  const fusedSeries = timeline.map((t) => t.fused?.score ?? 0);

  return (
    <div className={tokens.card}>
      <h2 className="text-lg font-semibold text-sky-100 mb-4">Results</h2>

      {/* Sparkline */}
      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
        <div className="text-slate-400 text-sm mb-1">Fused score timeline</div>
        <Sparkline data={fusedSeries} />
      </div>

      {/* Overall */}
      <div className="mt-5">
        <div className="text-slate-400 text-sm">Fusion (overall)</div>
        <div className="text-2xl font-semibold text-emerald-300 mt-1">
          {overall?.label ?? "—"}
        </div>
        <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-500"
            style={{
              width: `${Math.round(
                (overallProg ?? overall?.score ?? 0) * 100
              )}%`,
            }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {Math.round((overallProg ?? overall?.score ?? 0) * 100)}%
        </div>
      </div>

      {/* modalities */}
      <div className="mt-5 grid md:grid-cols-3 gap-3">
        <ModalityCard
          title="Text"
          label={last?.text?.label}
          confidence={(textProg ?? last?.text?.score) as number}
        />
        <ModalityCard
          title="Audio"
          label={last?.audio?.label}
          confidence={(audioProg ?? last?.audio?.score) as number}
        />
        <ModalityCard
          title="Vision"
          label={last?.vision?.label}
          confidence={(visionProg ?? last?.vision?.score) as number}
        />
      </div>
    </div>
  );
}
