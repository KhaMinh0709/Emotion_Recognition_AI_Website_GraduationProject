// src/components/dashboard/DashboardHeader.tsx
type DashboardHeaderProps = {
  summary: {
    dominant_emotion: string | null;   // 👈 cho phép null
    average_confidence: number;
    total_frames_analyzed: number;
    duration: number;
  } | null;
  onNewAnalysis: () => void;
};

export function DashboardHeader({ summary, onNewAnalysis }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,14,32,0.6)] backdrop-blur-xl">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1030] via-[#0a0f28] to-transparent" />
        <div className="absolute -top-16 left-1/3 w-[60%] h-40 blur-3xl animate-aurora bg-gradient-to-r from-sky-500/20 via-fuchsia-500/20 to-purple-500/20" />
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white/15 rounded-full animate-float"
            style={{
              top: `${Math.random() * 80 + 5}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 ring-1 ring-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_16px_theme(colors.sky.400)] animate-pulse" />
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                Analysis Results
              </span>
            </h2>
          </div>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white hover:from-fuchsia-500 hover:to-sky-500 transition-all shadow-lg shadow-sky-900/20 ring-1 ring-white/10"
            title="Create new mock analysis"
          >
            <span className="i-rotate w-1.5 h-1.5 rounded-full bg-white/70" />
            New Analysis
          </button>
        </div>

        {/* chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label="Dominant Emotion" value={summary?.dominant_emotion ?? null} />
          <Chip
            label="Avg Confidence"
            value={summary ? `${(summary.average_confidence * 100).toFixed(1)}%` : null}
          />
          <Chip label="Frames Analyzed" value={summary ? String(summary.total_frames_analyzed) : null} />
          <Chip label="Duration" value={summary ? `${summary.duration.toFixed(0)}s` : null} />
        </div>
      </div>

      <div className="h-1 w-full bg-white/5 overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 animate-ribbon" />
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="px-3 py-1.5 rounded-xl text-xs text-gray-200 bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10 transition">
      <span className="text-gray-400">{label}:</span>{" "}
      <span className="font-medium text-white">{value ?? "N/A"}</span>
    </div>
  );
}
