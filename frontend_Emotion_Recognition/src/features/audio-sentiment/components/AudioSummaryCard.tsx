import React from "react";
import { AudioSentimentResult } from "../types";
import { cx, uiTokens } from "../utils/uiTokens";

const AudioSummaryCard: React.FC<{ result: AudioSentimentResult | null }> = ({
  result,
}) => {
  const pct = Math.round((result?.confidence ?? 0) * 100);
  const label = result?.label ?? "—";
  const latency = result?.latency ?? 0;

  const labelColor =
    label === "Positive"
      ? "text-emerald-300"
      : label === "Negative"
      ? "text-rose-300"
      : "text-slate-200";

  // mình chèn keyframes nhỏ ở đây cho nhẹ
  const KEYFRAMES = `
  @keyframes donutPulse {
    0% { box-shadow: 0 0 0 0 rgba(14,165,233,.35); }
    100% { box-shadow: 0 0 0 16px rgba(14,165,233,0); }
  }
  `;

  return (
    <div className={cx(uiTokens.card, "mt-6 p-5 md:p-6")}>
      <style>{KEYFRAMES}</style>
      {/* header */}
      <div className="flex items-start justify-between mb-5">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
          AUDIO SENTIMENT
        </div>
        <div className="text-xs px-3 py-1 rounded-lg bg-slate-900/40 border border-white/5 text-slate-200">
          {latency} ms
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
        {/* LEFT: donut */}
        <div className="flex items-center gap-5 md:w-[310px]">
          <div className="relative w-[168px] h-[168px] flex-shrink-0">
            {/* outer svg */}
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full rotate-[-90deg]"
            >
              {/* background ring */}
              <circle
                cx="80"
                cy="80"
                r="58"
                stroke="rgba(255,255,255,.04)"
                strokeWidth="12"
                fill="none"
              />
              {/* main ring */}
              <circle
                cx="80"
                cy="80"
                r="58"
                stroke="url(#aud-grad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 58}
                strokeDashoffset={(2 * Math.PI * 58 * (100 - pct)) / 100}
                style={{ transition: "stroke-dashoffset .6s ease" }}
              />
              <defs>
                <linearGradient
                  id="aud-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* inner circle để “bọc” số % cho đẹp */}
            <div
              className="absolute inset-[22px] rounded-full bg-slate-950/60 border border-white/5 grid place-items-center"
              style={{ animation: "donutPulse 2.8s ease-out infinite" }}
            >
              <div className="text-center leading-tight">
                <div className="text-4xl font-extrabold text-sky-50">
                  {pct}%
                </div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  confidence
                </div>
              </div>
            </div>
          </div>

          {/* label */}
          <div>
            <div className={cx("text-3xl font-extrabold", labelColor)}>
              {label}
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-[140px]">
              Kết quả mới nhất từ audio.
            </p>
          </div>
        </div>

        {/* RIGHT: top-k */}
        <div className="flex-1 flex flex-col">
          <div className="text-sm text-slate-300 mb-3 ml-auto">
            Top-K Emotions
          </div>
          {result?.topK && result.topK.length > 0 ? (
            <div
              className={cx(
                "grid gap-3 ml-auto w-full",
                result.topK.length > 3 ? "md:grid-cols-2" : "md:grid-cols-1",
                // giới hạn chiều rộng để các thanh nằm gọn bên phải
                "md:max-w-[600px]"
              )}
            >
              {result.topK.map((k) => {
                const w = Math.min(100, Math.max(4, Math.round(k.score * 100)));
                return (
                  <div
                    key={k.label}
                    className="rounded-xl bg-slate-900/20 border border-white/5 px-3 py-2"
                  >
                    <div className="flex items-center justify-between mb-1 gap-4">
                      <span className="text-slate-100 truncate">
                        {k.label}
                      </span>
                      <span className="text-slate-300 text-sm shrink-0">
                        {w}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                        style={{
                          width: `${w}%`,
                          transition: "width .55s cubic-bezier(.2,.9,.2,1)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-500 text-sm ml-auto">
              Chưa có top-k — hãy Analyze hoặc Demo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioSummaryCard;
