// src/components/SectionHeaderGlow.tsx
import React from "react";
import { Activity } from "lucide-react";

type Badge = { label: string };
export default function SectionHeaderGlow({
  title,
  subtitle,
  icon = <Activity className="w-5 h-5" />,
  badges = [],
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badges?: Badge[];
  className?: string;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0F2A47] via-[#0E2545] to-[#18224F] shadow-xl " +
        className
      }
    >
      {/* floating dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 rounded-full bg-white/20 animate-floatDot"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animationDelay: `${(i % 7) * 0.6}s`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      <div className="relative px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/10 border border-white/15 text-sky-200">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-sky-200 drop-shadow">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[15px] text-slate-300/90">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {!!badges.length && (
          <div className="flex items-center gap-2">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-sm rounded-full border border-white/15 bg-white/10 text-slate-200"
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* running line */}
      <div className="relative h-[6px]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/5" />
        <div className="absolute left-[-30%] top-0 h-[3px] w-[40%] bg-gradient-to-r from-[#FF00CC] via-[#3333FF] to-[#00FFFF] rounded-full animate-runLine" />
      </div>

      {/* local keyframes */}
      <style>{`
        @keyframes runLine {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            transform: translateX(200%);
            opacity: 0;
        }
        }
        .animate-runLine {
        animation: runLine 5s linear infinite;
        }


        @keyframes floatDot {
          0% { transform: translateY(0px); opacity:.3 }
          50% { transform: translateY(-6px); opacity:.55 }
          100% { transform: translateY(0px); opacity:.3 }
        }
        .animate-floatDot { animation: floatDot 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
