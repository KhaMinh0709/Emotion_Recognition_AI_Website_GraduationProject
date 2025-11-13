// vision-sentiment/components/DetailModal.tsx
import React from "react";
import { Donut } from "./Donut";
import { cx } from "../utils/cx";
import { tokens } from "../utils/tokens";
import type { ResultRow } from "../types";

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  row?: ResultRow | null;
};

export const DetailModal: React.FC<DetailModalProps> = ({
  open,
  onClose,
  row,
}) => {
  if (!open || !row) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-[fadeIn_.25s_ease]"
      onClick={onClose}
    >
      <div
        className={cx(tokens.card, "w-[min(960px,92vw)] mx-auto mt-16 p-6 md:p-7")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-2xl font-bold text-sky-200">Analysis detail</h3>
          <button
            className="w-12 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-7">
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Source</div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-slate-200">
              {row.source}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span>
                <b>Label:</b>{" "}
                <span
                  className={
                    row.label === "Happy"
                      ? "text-emerald-300"
                      : row.label === "Angry"
                      ? "text-rose-300"
                      : "text-slate-300"
                  }
                >
                  {row.label}
                </span>
              </span>
              <span>
                <b>Confidence:</b> {Math.round(row.confidence * 100)}%
              </span>
              <span>
                <b>Latency:</b> {row.latency} ms
              </span>
            </div>
          </div>

          <div className="grid place-items-center">
            <Donut pct={Math.round(row.confidence * 100)} />
          </div>
        </div>

        {row.topK?.length ? (
          <div className="mt-6">
            <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
            <div className="grid grid-cols-3 gap-3">
              {row.topK.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl bg-white/5 border border-white/10 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200">{k.label}</span>
                    <span className="text-slate-400 text-sm">
                      {Math.round(k.score * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-700/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                      style={{
                        width: `${Math.min(100, Math.max(0, k.score * 100))}%`,
                        transition: "width .6s cubic-bezier(.2,.9,.2,1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
