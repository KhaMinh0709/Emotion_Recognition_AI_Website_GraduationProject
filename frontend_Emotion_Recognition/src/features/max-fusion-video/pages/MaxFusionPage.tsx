// src/features/max-fusion/pages/MaxFusionPage.tsx
import React, { useMemo, useState } from "react";
import { KEYFRAMES, tokens } from "@/features/max-fusion-video/utils/uiTokens";
import PipelineSteps from "@/features/max-fusion-video/components/PipelineSteps";
import ResultPanel from "@/features/max-fusion-video/components/ResultPanel";
import ModalWrap from "@/features/max-fusion-video/components/ModalWrap";
import Bar from "@/features/max-fusion-video/components/Bar";
import { useMaxFusionAnalysis } from "@/features/max-fusion-video/hooks/useMaxFusionAnalysis";

export default function MaxFusionPage() {
  // lấy toàn bộ xử lý từ hook
  const {
    // media
    tab,
    setTab,
    videoUrl,
    videoRef,
    isRecording,
    recSec,
    startRecording,
    stopRecording,
    onFileChange,
    clearAll,
    MAX_REC_SEC,

    // analysis
    isRunning,
    stage,
    timeline,
    overall,
    error,
    analyze,
    runDemo,

    // progress (0..1)
    textProg,
    audioProg,
    visionProg,
    overallProg,

    // bảng
    rows,
    setRows,
    exportRowsJSON,
    exportRowsCSV,
  } = useMaxFusionAnalysis();

  // search + modal cho bảng
  const [query, setQuery] = useState("");
  const [activeRow, setActiveRow] = useState<typeof rows[number] | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* keyframes local */}
      <style>{KEYFRAMES}</style>

      {/* ===== Header glow ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background:
              "linear-gradient(90deg,#06b6d4,#4f46e5,#a855f7,#4f46e5,#06b6d4)",
            backgroundSize: "300% 100%",
            animation: "moveX 16s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        <div className="relative px-6 py-7 md:px-10 md:py-9">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  d="M12 2v20M4 6v12M20 8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
                Max Fusion (Video)
              </h1>
              <p className="text-slate-200/85">
                Phân tích video đa phương thức — upload hoặc record, có pipeline
                animation.
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
          <div
            className="absolute top-0 left-[-35%] h-[3px] w-[35%] rounded-full"
            style={{
              background: "linear-gradient(90deg,#22d3ee,#a855f7,#22d3ee)",
              animation: "sweepX 2.8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* ===== Main grid ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT: input */}
        <div className={tokens.card}>
          <div className="flex gap-2 mb-4">
            <button
              className={tokens.btn.tab}
              data-active={tab === "upload"}
              onClick={() => setTab("upload")}
            >
              Upload Video
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "record"}
              onClick={() => setTab("record")}
            >
              Record Video
            </button>
          </div>

          {tab === "upload" && (
            <div className="space-y-4">
              <label className="block">
                <div className="w-full border-2 border-dashed border-slate-700/40 hover:border-sky-500/30 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                  <div className="text-sky-200 font-medium">
                    Drop video here or click to browse
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    MP4, MOV, WEBM • up to 50MB
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </div>
              </label>
              {videoUrl && (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-h-[360px] bg-slate-900"
                    ref={videoRef}
                  />
                </div>
              )}
            </div>
          )}

          {tab === "record" && (
            <div>
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    className={tokens.btn.primary}
                    onClick={startRecording}
                  >
                    Record (≤{MAX_REC_SEC}s)
                  </button>
                ) : (
                  <>
                    <button
                      className={tokens.btn.ghost}
                      onClick={stopRecording}
                    >
                      Stop
                    </button>
                    <span className="text-slate-300 text-sm">
                      Recording… {recSec}s
                    </span>
                  </>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 mt-3">
                <video
                  ref={videoRef}
                  src={!isRecording ? videoUrl ?? undefined : undefined}
                  controls={!isRecording && !!videoUrl}
                  className="w-full max-h-[360px] bg-slate-900"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 items-center">
            <button
              className={tokens.btn.primary}
              onClick={analyze}
              disabled={isRunning}
            >
              {isRunning ? "Analyzing…" : "Analyze"}
            </button>
            <button
              className={tokens.btn.subtle}
              onClick={runDemo}
              disabled={isRunning}
            >
              Demo
            </button>
            <button className={tokens.btn.subtle} onClick={clearAll}>
              Clear
            </button>
          </div>

          {error && <div className="mt-2 text-rose-400">{error}</div>}
          {isRunning && (
            <div className="mt-2 text-slate-300">Đang phân tích video...</div>
          )}
        </div>

        {/* MIDDLE: pipeline */}
        <PipelineSteps stage={stage} />

        {/* RIGHT: result */}
        <ResultPanel
          timeline={timeline}
          overall={overall}
          textProg={textProg}
          audioProg={audioProg}
          visionProg={visionProg}
          overallProg={overallProg}
        />
      </div>

      {/* ===== Analysis Results ===== */}
      <div className={`${tokens.card} mt-6`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-xl font-semibold text-sky-100 flex-1">
            Analysis Results
          </div>

          <div className="flex-1">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M21 21l-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <button className={tokens.btn.subtle} onClick={() => setRows([])}>
            Clear all
          </button>
          <button className={tokens.btn.subtle} onClick={exportRowsJSON}>
            Export JSON
          </button>
          <button className={tokens.btn.subtle} onClick={exportRowsCSV}>
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60 text-slate-300">
              <tr>
                <th className="text-left px-3 py-2 w-[56px]">#</th>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-left px-3 py-2">Label</th>
                <th className="text-left px-3 py-2">Confidence</th>
                <th className="text-left px-3 py-2">Latency</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-left px-3 py-2 w-[90px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No results yet.
                  </td>
                </tr>
              )}
              {filtered.map((r, idx) => (
                <tr
                    key={r.id}
                    className="border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => setActiveRow(r)}
                  >
                    <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2 text-slate-200">{r.source}</td>
                    <td className="px-3 py-2">
                      <span className="text-emerald-300">{r.label}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {r.confidence}%
                    </td>
                    <td className="px-3 py-2 text-slate-300">{r.latency} ms</td>
                    <td className="px-3 py-2 text-slate-300">{r.time}</td>
                    <td className="px-3 py-2">
                      <button
                        className="text-rose-400 hover:text-rose-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRows((old) => old.filter((x) => x.id !== r.id));
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Detail Modal ===== */}
      <ModalWrap
        open={!!activeRow}
        onClose={() => setActiveRow(null)}
        title="Analysis detail"
      >
        {activeRow && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-slate-300 text-sm mb-1">Source</div>
              <div className="text-slate-100">{activeRow.source}</div>

              <div className="mt-4 text-slate-300 text-sm mb-1">Label</div>
              <div className="text-emerald-300 text-xl font-semibold">
                {activeRow.label}
              </div>

              <div className="mt-4 text-slate-300 text-sm mb-1">Confidence</div>
              <Bar value={activeRow.confidence / 100} />

              <div className="mt-4 text-slate-300 text-sm mb-1">Latency</div>
              <div className="text-slate-200">{activeRow.latency} ms</div>

              <div className="mt-4 text-slate-300 text-sm mb-1">Time</div>
              <div className="text-slate-200">{activeRow.time}</div>
            </div>

            <div>
              <div className="text-slate-300 text-sm mb-2">
                Modality breakdown
              </div>
              <div className="grid gap-3">
                {(["text", "audio", "vision"] as const).map((m) => (
                  <div
                    key={m}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/10"
                  >
                    <div className="text-slate-400 text-xs capitalize">{m}</div>
                    <div className="text-slate-100 font-medium">
                      {activeRow.raw.byMod?.[m]?.label ?? "—"}
                    </div>
                    <div className="mt-1">
                      <Bar value={activeRow.raw.byMod?.[m]?.score ?? 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalWrap>
    </div>
  );
}
