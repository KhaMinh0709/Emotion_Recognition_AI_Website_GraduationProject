// src/pages/AudioSentiment.tsx

import AnimatedHeader from "../utils/AnimatedHeader";
import React, { useEffect, useMemo, useRef, useState } from "react";

/* =============== tiny utils =============== */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

/* =============== design tokens =============== */
const tokens = {
  card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-sky-900/20 hover:shadow-xl animate-[fadeIn_.42s_ease] will-change-transform",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  subtle: "text-slate-300/80",
  btn: {
    primary: "inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost: "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10 disabled:opacity-60",
    tab: "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
    icon: "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
    subtle: "px-3 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-60",
  },
};

// /* =============== keyframes (từ trang Text) =============== */
// const KEYFRAMES = `
// @keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
// @keyframes floatDot{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
// @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
// @keyframes runLine{0%{left:-35%}100%{left:100%}}
// `;

// /* =============== Animated Header (tái dùng) =============== */
// type AnimatedHeaderProps = {
//   title?: string;
//   subtitle?: string;
//   badges?: string[];
//   bgColors?: [string, string, string, string];
//   lineColors?: [string, string, string];
// };

// /* Animated Header Component */
// const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
//   title = "Audio Sentiment",
//   subtitle = "Nền tảng phân tích cảm xúc cho Audio (mở rộng Text, Vision).",
//   badges = ["Glow UI", "Realtime-ready"],
//   bgColors = ["#06b6d4", "#4f46e5", "#a855f7", "#4f46e5"],
//   lineColors = ["#22d3ee", "#a855f7", "#22d3ee"],
// }) => (
//   <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
//     <style>{KEYFRAMES}</style>
//     <div
//       className="absolute inset-0 opacity-75"
//       style={{
//         background: `linear-gradient(90deg,${bgColors[0]},${bgColors[1]},${bgColors[2]},${bgColors[3]},${bgColors[0]})`,
//         backgroundSize: "300% 100%",
//         animation: "moveX 2.8s linear infinite",
//       }}
//     />
//     <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
//     <div className="pointer-events-none absolute inset-0">
//       {Array.from({ length: 18 }).map((_, i) => (
//         <span
//           key={i}
//           className="absolute w-1 h-1 rounded-full bg-white/30"
//           style={{
//             left: `${(i * 57) % 100}%`,
//             top: `${(i * 37) % 100}%`,
//             opacity: 0.35,
//             animation: `floatDot ${6 + (i % 5)}s ease-in-out ${i * 0.25}s infinite`,
//           }}
//         />
//       ))}
//     </div>

//     <div className="relative px-6 py-7 md:px-10 md:py-9">
//       <div className="flex items-center gap-3">
//         <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
//           <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
//             <path d="M9 18V6l8-3v18l-8-3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>
//         <div>
//           <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">{title}</h1>
//           <p className="text-slate-200/85">{subtitle}</p>
//         </div>
//         <div className="ml-auto hidden md:flex items-center gap-2">
//           {badges.map((b) => (
//             <span key={b} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-100">{b}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//     <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
//       <div
//         className="absolute top-0 h-[3px] w-[35%] rounded-full"
//         style={{
//           background: `linear-gradient(90deg,${lineColors[0]},${lineColors[1]},${lineColors[2]})`,
//           animation: "runLine 8s linear infinite",
//         }}
//       />
//     </div>
//   </div>
// );

/* =============== helpers =============== */
const RECORD_TIME_LIMIT = 60_000; // 60s

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/** tạo WAV PCM16 mono 16kHz: sine 440Hz – dùng cho nút Demo */
function makeSineWav(durationSec = 1, freq = 440, sampleRate = 16000): Blob {
  const numSamples = Math.floor(durationSec * sampleRate);
  const bytesPerSample = 2;
  const blockAlign = 1 * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  let o = 0;
  // RIFF header
  const writeStr = (s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o++, s.charCodeAt(i)); };
  writeStr("RIFF");
  view.setUint32(o, 36 + dataSize, true); o += 4;
  writeStr("WAVE");
  writeStr("fmt ");
  view.setUint32(o, 16, true); o += 4;            // PCM chunk size
  view.setUint16(o, 1, true); o += 2;             // audio format PCM
  view.setUint16(o, 1, true); o += 2;             // channels
  view.setUint32(o, sampleRate, true); o += 4;    // sampleRate
  view.setUint32(o, byteRate, true); o += 4;      // byteRate
  view.setUint16(o, blockAlign, true); o += 2;    // blockAlign
  view.setUint16(o, 16, true); o += 2;            // bitsPerSample
  writeStr("data");
  view.setUint32(o, dataSize, true); o += 4;

  // samples
  for (let n = 0; n < numSamples; n++) {
    const t = n / sampleRate;
    const s = Math.sin(2 * Math.PI * freq * t) * 0.4; // amplitude 0.4
    const v = Math.max(-1, Math.min(1, s));
    view.setInt16(o, v * 32767, true); o += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/* ================= Waveform ================= */
const WaveformCanvas: React.FC<{ audioBuffer?: AudioBuffer; height?: number }> = ({
  audioBuffer,
  height = 96,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = height * dpr;
    canvas.width = width;
    canvas.height = h;

    ctx.clearRect(0, 0, width, h);
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(1, "#6366f1");
    ctx.fillStyle = grad;

    if (!audioBuffer) {
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < width; i += 8) {
        const barH = (Math.sin(i * 0.01) * 0.5 + 0.5) * (h * 0.35);
        const y = h / 2 - barH / 2;
        ctx.fillRect(i, y, 5, barH);
      }
      ctx.globalAlpha = 1;
      return;
    }

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    for (let i = 0; i < width; i++) {
      let min = 1.0, max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j] || 0;
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const yMax = (1 + max) * (h / 2);
      const yMin = (1 + min) * (h / 2);
      ctx.fillRect(i, yMin, 1, Math.max(1, yMax - yMin));
    }
  }, [audioBuffer, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
      <canvas ref={canvasRef} className="w-full" style={{ height }} />
    </div>
  );
};

/* ================= VU Meter ================= */
const VUMeter: React.FC<{ level: number }> = ({ level }) => (
  <div className="h-3 w-full rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
    <div
      className="h-full transition-[width] duration-75"
      style={{
        width: `${Math.min(100, Math.max(3, level * 100))}%`,
        background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
      }}
    />
  </div>
);

/* ================= Result Card ================= */
const ResultCard: React.FC<{
  label?: string;
  confidence?: number;
  emotionTopK?: Array<{ label: string; score: number }>;
  latencyMs?: number;
}> = ({ label, confidence, emotionTopK, latencyMs }) => {
  const confPct = Math.round((confidence ?? 0) * 100);
  const color =
    label === "Positive" ? "text-emerald-300" :
    label === "Negative" ? "text-rose-300" : "text-slate-300";
  return (
    <div className={cx(tokens.card, "p-5 md:p-6")}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-400">AUDIO SENTIMENT</div>
          <div className={cx("mt-1 text-3xl font-extrabold", color)}>{label ?? "—"}</div>
        </div>
        {typeof latencyMs === "number" && (
          <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">{latencyMs} ms</div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-400 mb-1">Confidence</div>
        <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div className="h-full" style={{ width: `${confPct}%`, background: "linear-gradient(90deg,#22d3ee,#6366f1)" }} />
        </div>
        <div className="mt-1 text-xs text-slate-400">{confPct}%</div>
      </div>

      {emotionTopK && emotionTopK.length > 0 && (
        <div className="mt-5">
          <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {emotionTopK.map((e, i) => (
              <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-200">{e.label}</span>
                <span className="text-slate-400 text-sm">{Math.round(e.score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 text-[13px] text-slate-400">
        Mapping: Happy/Surprised → Positive · Neutral → Neutral · Angry/Sad/Fearful/Disgusted → Negative
      </div>
    </div>
  );
};

/* ================= Main Page ================= */
export default function AudioSentiment(): React.ReactElement {
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>();

  const [level, setLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    label: string;
    confidence: number;
    topK: Array<{ label: string; score: number }>;
    latency: number;
  } | null>(null);
  const [quality, setQuality] = useState<{ rms?: number; snr?: number }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load audio buffer for waveform
  useEffect(() => {
    const target = blob || file;
    if (!target) return;

    const url = URL.createObjectURL(target);
    setAudioUrl(url);

    (async () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuf = await target.arrayBuffer();
      try {
        const decoded = await ctx.decodeAudioData(arrayBuf);
        setAudioBuffer(decoded);
        const ch = decoded.getChannelData(0);
        const rms = Math.sqrt(ch.reduce((s, v) => s + v * v, 0) / ch.length);
        setQuality({ rms });
      } catch {
        setAudioBuffer(undefined);
      }
    })();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob, file]);

  // Record flow
  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setBlob(b);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);

      // live VU loop
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        setLevel(Math.min(1, rms * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      // auto stop after 60s
      recordingTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setError("Recording reached 60 second limit");
        }
      }, RECORD_TIME_LIMIT);
    } catch {
      setError("Không thể truy cập micro.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recordingTimeoutRef.current != null) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  const clearAll = () => {
    setBlob(null);
    setFile(null);
    setAudioUrl(null);
    setAudioBuffer(undefined);
    setResult(null);
    setError(null);
    setLevel(0);
  };

  // Analyze
  const analyze = async () => {
    const data = blob || file;
    if (!data) {
      setError("Chưa có audio để phân tích.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", data);
      const start = performance.now();
      const res = await fetch("/api/analyze/audio", { method: "POST", body: fd });
      const latency = Math.round(performance.now() - start);

      if (!res.ok) throw new Error("Analyze failed");

      const json = await res.json();
      setResult({
        label: json.label ?? "Neutral",
        confidence: json.confidence ?? 0.5,
        topK: json.topK ?? [],
        latency,
      });
    } catch {
      setError("Kết nối gián đoạn. Thử lại?");
    } finally {
      setLoading(false);
    }
  };

  // DEMO: tạo file mẫu & analyze ngay
  const runDemo = async () => {
    const demoBlob = makeSineWav(1, 440, 16000);
    const demoFile = new File([demoBlob], "demo.wav", { type: "audio/wav" });
    setTab("upload");
    setBlob(null);          // ưu tiên file
    setFile(demoFile);
    setError(null);
    // đợi state cập nhật xong một nhịp rồi phân tích
    setTimeout(() => analyze(), 0);
  };

  const qualityWarnings = useMemo(() => {
    const arr: string[] = [];
    if (quality.rms !== undefined && quality.rms < 0.015) {
      arr.push("Âm lượng thấp. Hãy nói gần micro hơn hoặc tăng gain.");
    }
    return arr;
  }, [quality]);

  /* =============== drag & drop =============== */
  const [isDropping, setIsDropping] = useState(false);
  const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropping(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      if (f.size > 50 * 1024 * 1024) {
        setError("File quá lớn (max 50MB).");
        return;
      }
      setFile(f);
      setBlob(null);
      setError(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <AnimatedHeader />

      {/* Input Card */}
      <div className={cx(tokens.card, "p-5 md:p-6")}>
        {/* Tabs + Clear */}
        <div className="flex gap-2 mb-4">
          <button className={tokens.btn.tab} data-active={tab === "upload"} onClick={() => setTab("upload")}>Upload</button>
          <button className={tokens.btn.tab} data-active={tab === "record"} onClick={() => setTab("record")}>Record</button>
          <div className="ml-auto">
            <button className={tokens.btn.icon} onClick={clearAll} title="Clear">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path d="M3 6h18M8 6v12m8-12v12M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Upload */}
        {tab === "upload" && (
          <div className="space-y-4">
            <label
              className={cx(
                "block transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer border-2 border-dashed",
                isDropping ? "border-sky-300/70 bg-slate-900/60" : "border-sky-500/40 hover:border-sky-400/70"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDropping(true); }}
              onDragLeave={() => setIsDropping(false)}
              onDrop={onDrop}
            >
              <div className="text-sky-200 font-medium">Drop audio here or click to browse</div>
              <div className="mt-1 text-sm text-slate-400">WAV, MP3, M4A, FLAC • up to 50MB</div>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (f.size > 50 * 1024 * 1024) {
                      setError("File quá lớn (max 50MB).");
                      return;
                    }
                    setFile(f);
                    setBlob(null);
                    setError(null);
                  }
                }}
              />
            </label>

            {(file || blob) && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                  {file ? file.name : "recorded_audio.webm"}
                </span>
                <span className="text-slate-400">• {formatBytes((file || blob)?.size || 0)}</span>
              </div>
            )}
          </div>
        )}

        {/* Record */}
        {tab === "record" && (
          <div className="space-y-4">
            <div className="text-sm text-slate-400 mb-2">Record tối đa 60 giây. Nhấn Stop hoặc sẽ tự dừng sau 60s.</div>
            <div className="flex items-center gap-4">
              <button className={tokens.btn.primary} onClick={startRecording} disabled={isRecording} title="Record up to 60s">
                {isRecording ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    Recording…
                  </>
                ) : (
                  "Start Recording (60s)"
                )}
              </button>
              {isRecording && <button className={tokens.btn.ghost} onClick={stopRecording}>Stop</button>}
            </div>
            <VUMeter level={level} />
            <div className={tokens.subtle}>Live mic level</div>
          </div>
        )}

        {/* Preview */}
        <div className="mt-6 space-y-3">
          <div className="text-sm text-slate-400">Preview</div>
          <WaveformCanvas audioBuffer={audioBuffer} />
          {audioUrl && <audio controls src={audioUrl ?? undefined} className="w-full mt-2" />}
        </div>

        {/* Preprocess */}
        <div className="mt-6">
          <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
          <ul className="text-sm text-slate-400 grid gap-1">
            <li>✓ Resample 16kHz mono (client/server will resample if needed)</li>
            <li>✓ VAD (trim silence)</li>
            <li>✓ Normalize gain (informative)</li>
          </ul>
          {qualityWarnings.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
              {qualityWarnings.map((q, i) => <div key={i}>• {q}</div>)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button className={tokens.btn.primary} onClick={analyze} disabled={loading || (!file && !blob)}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-0.5 mr-1 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                "Analyze"
              )}
            </button>

            <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>

            {/* NEW: DEMO BUTTON */}
            <button className={tokens.btn.subtle} onClick={runDemo} disabled={loading}>
              Demo (auto sample)
            </button>
          </div>

          {/* loading progress bar */}
          {loading && (
            <div className="relative h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 w-1/3"
                style={{ background: "linear-gradient(90deg, rgba(34,211,238,.9), rgba(99,102,241,.9))", animation: "moveX 1.6s linear infinite", backgroundSize: "300% 100%" }}
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path d="M12 9v4m0 4h.01M12 2l10 18H2L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span>{error}</span>
            </div>
            <button className={tokens.btn.subtle} onClick={analyze}>Thử lại</button>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <ResultCard
            label={result.label}
            confidence={result.confidence}
            emotionTopK={result.topK}
            latencyMs={result.latency}
          />
        </div>
      )}

      {/* Footer tips */}
      <div className="mt-6 text-sm text-slate-400">
        Tips: Ghi trong phòng yên tĩnh · Tránh echo mạnh · Giữ micro cách miệng 10–15cm.
      </div>
    </div>
  );
}


































