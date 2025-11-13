// audio-sentiment/utils/AnimatedHeader.tsx
import React from "react";

const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes floatDot{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
@keyframes runLine{0%{left:-35%}100%{left:100%}}
`;

type AnimatedHeaderProps = {
  title?: string;
  subtitle?: string;
};

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title = "Audio Sentiment",
  subtitle = "Nền tảng phân tích cảm xúc cho Audio (mở rộng Text, Vision).",
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
    <style>{KEYFRAMES}</style>
    <div
      className="absolute inset-0 opacity-75"
      style={{
        background:
          "linear-gradient(90deg,#06b6d4,#4f46e5,#a855f7,#4f46e5,#06b6d4)",
        backgroundSize: "300% 100%",
        animation: "moveX 2.8s linear infinite",
      }}
    />
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${(i * 57) % 100}%`,
            top: `${(i * 37) % 100}%`,
            opacity: 0.35,
            animation: `floatDot ${6 + (i % 5)}s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
    <div className="relative px-6 py-7 md:px-10 md:py-9">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
          <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
            <path
              d="M9 18V6l8-3v18l-8-3Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
            {title}
          </h1>
          <p className="text-slate-200/85">{subtitle}</p>
        </div>
      </div>
    </div>
    <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
      <div
        className="absolute top-0 h-[3px] w-[35%] rounded-full"
        style={{
          background: "linear-gradient(90deg,#22d3ee,#a855f7,#22d3ee)",
          animation: "runLine 8s linear infinite",
        }}
      />
    </div>
  </div>
);

export default AnimatedHeader;
