// audio-sentiment/components/ResultCard.tsx
import React from "react";
import { cx, uiTokens } from "../utils/uiTokens";
import type { AudioSentimentResult } from "../types";

const ResultCard: React.FC<{ result: AudioSentimentResult }> = ({ result }) => {
  const { label, confidence, topK, latency } = result;
  const confPct = Math.round((confidence ?? 0) * 100);
  const color =
    label === "Positive"
      ? "text-emerald-300"
      : label === "Negative"
      ? "text-rose-300"
      : "text-slate-300";

  return (
    <div className={cx(uiTokens.card, "p-5 md:p-6")}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-400">
            AUDIO SENTIMENT
          </div>
          <div className={cx("mt-1 text-3xl font-extrabold", color)}>
            {label ?? "—"}
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">
          {latency} ms
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-400 mb-1">Confidence</div>
        <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${confPct}%`,
              background: "linear-gradient(90deg,#22d3ee,#6366f1)",
            }}
          />
        </div>
        <div className="mt-1 text-xs text-slate-400">{confPct}%</div>
      </div>

      {topK?.length ? (
        <div className="mt-5">
          <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {topK.map((e) => (
              <div
                key={e.label}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <span className="text-slate-200">{e.label}</span>
                <span className="text-slate-400 text-sm">
                  {Math.round(e.score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 text-[13px] text-slate-400">
        Mapping: Happy/Surprised → Positive · Neutral → Neutral ·
        Angry/Sad/Fearful/Disgusted → Negative
      </div>
    </div>
  );
};

export default ResultCard;
