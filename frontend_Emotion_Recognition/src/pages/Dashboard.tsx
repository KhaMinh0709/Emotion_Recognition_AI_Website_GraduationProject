import { useEffect, useMemo, useState } from "react";
import { EmotionChart } from "../components/EmotionChart";
import { EmotionTimeline } from "../components/EmotionTimeline";
import { EmotionSummaryCard } from "../components/EmotionSummaryCard";
import { Analysis, AnalysisSummary, EmotionResult } from "../types/emotions";

/* ---------- Mock Data ---------- */
function generateMockData(): {
  analysis: Analysis;
  summary: AnalysisSummary;
  results: EmotionResult[];
} {
  const emotions = ["happy", "sad", "angry", "surprised", "neutral", "fearful", "disgusted"];
  const id = crypto.randomUUID();
  const now = new Date();

  const results: EmotionResult[] = [];
  const emotionCounts: Record<string, number> = {};

  for (let i = 0; i < 20; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

    results.push({
      id: crypto.randomUUID(),
      analysis_id: id,
      timestamp: i * 0.5,
      emotion_type: emotion as any,
      confidence: 0.6 + Math.random() * 0.35,
      detection_type: Math.random() > 0.5 ? "facial" : "vocal",
      face_count: Math.floor(Math.random() * 3) + 1,
      created_at: now.toISOString(),
    });
  }

  const total = results.length;
  const distribution: Record<string, number> = {};
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    distribution[emotion] = (count / total) * 100;
  });

  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as any;
  const avgConfidence = results.reduce((s, r) => s + r.confidence, 0) / results.length;

  const analysis: Analysis = {
    id,
    file_name: "mock_analysis.mp4",
    file_type: "video/mp4",
    file_url: "",
    status: "completed",
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const summary: AnalysisSummary = {
    id: crypto.randomUUID(),
    analysis_id: id,
    dominant_emotion: dominantEmotion,
    emotion_distribution: distribution,
    average_confidence: avgConfidence,
    total_frames_analyzed: results.length,
    duration: results[results.length - 1]?.timestamp || 0,
    created_at: now.toISOString(),
  };

  return { analysis, summary, results };
}

/* ---------- Dashboard ---------- */
export default function Dashboard() {
  const [mockData, setMockData] = useState<{
    analysis: Analysis;
    summary: AnalysisSummary;
    results: EmotionResult[];
  } | null>(null);

  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [selected, setSelected] = useState<EmotionResult | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMockData(generateMockData()), 300);
    return () => clearTimeout(t);
  }, []);

  // ⚠️ GỌI HOOKS KHÔNG ĐIỀU KIỆN
  const summary = mockData?.summary ?? null;
  const results = mockData?.results ?? [];

  const windowResults = useMemo(() => {
    if (!selected || results.length === 0) return [];
    const start = selected.timestamp - 1.5;
    const end = selected.timestamp + 1.5;
    return results.filter((r) => r.timestamp >= start && r.timestamp <= end);
  }, [selected, results]);

  // ESC to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sau khi đã gọi hooks ở trên, giờ mới return sớm an toàn
  if (!mockData) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
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

            {/* New Analysis: KHÔNG link, chỉ tạo data mới */}
            <button
              onClick={() => setMockData(generateMockData())}
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
            <Chip
              label="Frames Analyzed"
              value={summary ? String(summary.total_frames_analyzed) : null}
            />
            <Chip label="Duration" value={summary ? `${summary.duration.toFixed(0)}s` : null} />
          </div>
        </div>

        <div className="h-1 w-full bg-white/5 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 animate-ribbon" />
        </div>
      </div>

      {/* ===== Summary ===== */}
      {summary && <EmotionSummaryCard summary={summary} />}

      {/* ===== Charts ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie/Bar ở VỊ TRÍ CŨ */}
        <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Emotion Distribution</h3>
            <div className="rounded-xl bg-white/5 overflow-hidden ring-1 ring-inset ring-white/10">
              <button
                onClick={() => setChartType("pie")}
                className={
                  "px-3 py-1.5 text-sm transition " +
                  (chartType === "pie"
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                    : "hover:bg-white/10 text-gray-200")
                }
              >
                Pie
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={
                  "px-3 py-1.5 text-sm transition " +
                  (chartType === "bar"
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                    : "hover:bg-white/10 text-gray-200")
                }
              >
                Bar
              </button>
            </div>
          </div>
          {summary && (
            <EmotionChart
              emotionDistribution={summary.emotion_distribution}
              chartType={chartType}
            />
          )}
        </div>

        <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
          <h3 className="text-xl font-bold mb-4">Emotion Timeline</h3>
          <EmotionTimeline emotionResults={results} />
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
        <h3 className="text-xl font-bold mb-4">Detection Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Emotion</th>
                <th className="text-left py-3 px-4">Confidence</th>
                <th className="text-left py-3 px-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/10 hover:bg-white/10 transition cursor-pointer"
                  onClick={() => setSelected(r)}
                  title="Xem chi tiết"
                >
                  <td className="py-3 px-4">{r.timestamp.toFixed(1)}s</td>
                  <td className="py-3 px-4 capitalize">{r.emotion_type}</td>
                  <td className="py-3 px-4">{(r.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 capitalize">{r.detection_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal chi tiết ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h4 className="text-lg font-semibold">Chi tiết phát hiện @ {selected.timestamp.toFixed(1)}s</h4>
              <button
                className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-5">
              <div className="space-y-2 text-sm">
                <Row label="Emotion" value={selected.emotion_type} />
                <Row label="Confidence" value={`${(selected.confidence * 100).toFixed(2)}%`} />
                <Row label="Type" value={selected.detection_type} />
                <Row label="Faces" value={String(selected.face_count ?? 1)} />
                <Row label="Created at" value={new Date(selected.created_at).toLocaleString()} />
              </div>
              <div className="rounded-xl p-3 border border-white/10 bg-white/5">
                <p className="text-xs text-gray-400 px-1 mb-1">
                  Timeline quanh thời điểm này (±1.5s)
                </p>
                <EmotionTimeline emotionResults={windowResults.length ? windowResults : [selected]} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CSS Animations ===== */}
      <style>{`
        @keyframes iRotate { from { transform: rotate(0) } to { transform: rotate(360deg) } }
        .i-rotate { animation: iRotate 1.4s linear infinite; }
        @keyframes aurora { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-12px) scale(1.02) } }
        .animate-aurora { animation: aurora 10s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .animate-float { animation: float 6.5s ease-in-out infinite; }
        @keyframes ribbon { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }
        .animate-ribbon { animation: ribbon 7s linear infinite; }
      `}</style>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function Chip({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="px-3 py-1.5 rounded-xl text-xs text-gray-200 bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10 transition">
      <span className="text-gray-400">{label}:</span>{" "}
      <span className="font-medium text-white">{value ?? "N/A"}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center rounded-lg bg-white/5 border border-white/10 px-3 py-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium capitalize">{value}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
      <div className="h-5 w-40 bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-56 bg-white/10 rounded animate-pulse" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="h-8 w-64 bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-5 w-80 bg-white/10 rounded mb-2 animate-pulse" />
      <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
    </div>
  );
}




