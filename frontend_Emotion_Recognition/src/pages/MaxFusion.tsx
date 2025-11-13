// import React, { useEffect, useRef, useState } from "react";

// type ModelScore = { label: string; score: number; modality?: string };
// type TimelineItem = { t: number; text?: ModelScore; audio?: ModelScore; vision?: ModelScore; fused?: ModelScore };

// // design tokens similar to other pages
// const tokens = {
//     card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl p-6",
//     title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
//     btn: {
//         primary: "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium",
//         ghost: "px-4 h-11 rounded-xl bg-slate-700/50 text-slate-100 border border-white/10",
//     },
// };

// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// // Small UI pieces used below
// const Step = ({ idx, text, active, done }: { idx: number; text: string; active: boolean; done: boolean }) => (
//     <div className="flex items-start gap-3">
//         <div className={cn(
//             "w-7 h-7 rounded-full flex items-center justify-center text-sm border",
//             done ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200" : active ? "bg-sky-500/20 border-sky-400/40 text-sky-200" : "bg-white/5 border-white/10 text-slate-300"
//         )}>{done ? "✓" : idx}</div>
//         <div className={cn("text-slate-300", active && "text-sky-200", done && "text-emerald-200")}>{text}</div>
//     </div>
// );

// const PipelineSteps = ({ stage }: { stage: number }) => {
//     const labels = [
//         "Extract frames (fps=5) & face‑crop",
//         "Extract audio & preprocess",
//         "ASR → transcript",
//         "Inference: vision / audio / text",
//         "Fusion → overall",
//     ];
//     return (
//         <div className={tokens.card}>
//             <h2 className="text-lg font-semibold text-sky-100 mb-4">Pipeline</h2>
//             <div className="grid gap-3">
//                 {labels.map((t, i) => (
//                     <Step key={i} idx={i + 1} text={t} active={stage === i} done={stage > i} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// const ModalityCard = ({ title, label, confidence }: { title: string; label?: string; confidence?: number }) => (
//     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//         <div className="text-slate-400 text-sm">{title}</div>
//         <div className="text-xl font-semibold text-sky-200 mt-1">{label ?? "—"}</div>
//         <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//             <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.round((confidence ?? 0) * 100)}%` }} />
//         </div>
//         <div className="text-xs text-slate-400 mt-1">{Math.round((confidence ?? 0) * 100)}%</div>
//     </div>
// );

// const ResultPanel = ({ timeline, overall, textProg, audioProg, visionProg, overallProg }: { timeline: TimelineItem[]; overall: ModelScore | null; textProg?: number; audioProg?: number; visionProg?: number; overallProg?: number }) => {
//     // derive a simple last-known per-modality summary from timeline
//     const last = timeline.length ? timeline[timeline.length - 1] : null;
//     const tProg = typeof textProg === 'number' ? textProg : Math.round((last?.text?.score ?? 0) * 100);
//     const aProg = typeof audioProg === 'number' ? audioProg : Math.round((last?.audio?.score ?? 0) * 100);
//     const vProg = typeof visionProg === 'number' ? visionProg : Math.round((last?.vision?.score ?? 0) * 100);
//     const oProg = typeof overallProg === 'number' ? overallProg : Math.round((overall?.score ?? 0) * 100);
//     return (
//         <div className={tokens.card}>
//             <h2 className="text-lg font-semibold text-sky-100 mb-4">Results</h2>
//             <div className="grid md:grid-cols-3 gap-3">
//                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//                     <div className="text-slate-400 text-sm">Text</div>
//                     <div className="text-xl font-semibold text-sky-200 mt-1">{last?.text?.label ?? "—"}</div>
//                     <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//                         <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${tProg}%` }} />
//                     </div>
//                     <div className="text-xs text-slate-400 mt-1">{Math.round(tProg)}%</div>
//                 </div>
//                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//                     <div className="text-slate-400 text-sm">Audio</div>
//                     <div className="text-xl font-semibold text-sky-200 mt-1">{last?.audio?.label ?? "—"}</div>
//                     <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//                         <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${aProg}%` }} />
//                     </div>
//                     <div className="text-xs text-slate-400 mt-1">{Math.round(aProg)}%</div>
//                 </div>
//                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
//                     <div className="text-slate-400 text-sm">Vision</div>
//                     <div className="text-xl font-semibold text-sky-200 mt-1">{last?.vision?.label ?? "—"}</div>
//                     <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//                         <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${vProg}%` }} />
//                     </div>
//                     <div className="text-xs text-slate-400 mt-1">{Math.round(vProg)}%</div>
//                 </div>
//             </div>
//             <div className="mt-5">
//                 <div className="text-slate-400 text-sm">Fusion (overall)</div>
//                 <div className="text-2xl font-semibold text-emerald-300 mt-1">{overall?.label ?? "—"}</div>
//                 <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//                     <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-500" style={{ width: `${oProg}%` }} />
//                 </div>
//                 <div className="text-xs text-slate-400 mt-1">{Math.round(oProg)}%</div>
//             </div>
//         </div>
//     );
// };


// export default function MaxFusion() {
//     const [tab, setTab] = useState<"upload" | "record">("upload");
//     const [file, setFile] = useState<File | null>(null);
//     const [videoUrl, setVideoUrl] = useState<string | null>(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const recordedChunksRef = useRef<Blob[]>([]);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [isRunning, setIsRunning] = useState(false);
//     const [stage, setStage] = useState<number>(-1); // pipeline stage -1 idle, 0..4 running
//     const [timeline, setTimeline] = useState<TimelineItem[]>([]);
//     const [overall, setOverall] = useState<ModelScore | null>(null);
//     const [transcript, setTranscript] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     // animated progress bars for modalities
//     const [textProg, setTextProg] = useState<number>(0);
//     const [audioProg, setAudioProg] = useState<number>(0);
//     const [visionProg, setVisionProg] = useState<number>(0);
//     const [overallProg, setOverallProg] = useState<number>(0);
//     const progressRef = useRef<any>(null);

//     useEffect(() => {
//         return () => {
//             if (videoUrl) URL.revokeObjectURL(videoUrl);
//             // stop any camera tracks if recording
//             try {
//                 const s = videoRef.current?.srcObject as MediaStream | undefined;
//                 if (s) s.getTracks().forEach((t) => t.stop());
//             } catch (e) { }
//         };
//     }, [videoUrl]);

//     // auto play when videoUrl or stream assigned
//     useEffect(() => {
//         const v = videoRef.current;
//         if (!v) return;
//         try {
//             // if live stream assigned, mute and play for autoplay
//             if (v.srcObject) {
//                 v.muted = true;
//                 v.play().catch(() => { });
//             } else if (videoUrl) {
//                 // for loaded file, ensure it can play
//                 v.muted = false;
//                 v.play().catch(() => { });
//             }
//         } catch (e) { }
//     }, [videoUrl]);

//     function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//         const f = e.target.files?.[0] ?? null;
//         if (!f) return;
//         if (f.size > 50 * 1024 * 1024) {
//             setError("File quá lớn (max 50MB).");
//             return;
//         }
//         setFile(f);
//         if (videoUrl) URL.revokeObjectURL(videoUrl);
//         setVideoUrl(URL.createObjectURL(f));
//         setError(null);
//     }

//     async function startRecording() {
//         setError(null);
//         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//             setError("Trình duyệt không hỗ trợ camera.");
//             return;
//         }
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 640, height: 480 } });
//             if (videoRef.current) videoRef.current.srcObject = stream;
//             const mr = new MediaRecorder(stream);
//             recordedChunksRef.current = [];
//             mr.ondataavailable = (ev) => {
//                 if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
//             };
//             mr.onstop = () => {
//                 const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
//                 const f = new File([blob], "recording.webm", { type: blob.type });
//                 setFile(f);
//                 if (videoUrl) URL.revokeObjectURL(videoUrl);
//                 setVideoUrl(URL.createObjectURL(blob));
//                 setIsRecording(false);
//             };
//             mediaRecorderRef.current = mr;
//             mr.start();
//             setIsRecording(true);
//             setTimeout(() => {
//                 if (mr.state === "recording") mr.stop();
//             }, 5000);
//         } catch (e) {
//             setError("Không thể truy cập camera/micro.");
//         }
//     }

//     function stopRecording() {
//         const mr = mediaRecorderRef.current;
//         if (mr && mr.state === "recording") mr.stop();
//         setIsRecording(false);
//         try {
//             const s = videoRef.current?.srcObject as MediaStream | undefined;
//             if (s) s.getTracks().forEach((t) => t.stop());
//         } catch (e) { }
//     }

//     async function analyze() {
//         if (!file) {
//             setError("Chưa có video để phân tích.");
//             return;
//         }
//         setIsRunning(true);
//         setError(null);
//         setTimeline([]);
//         setOverall(null);
//         setStage(0);
//         setTextProg(0); setAudioProg(0); setVisionProg(0); setOverallProg(0);
//         try {
//             // start a simulated progress animation while waiting for backend
//             progressRef.current = setInterval(() => {
//                 setTextProg((p) => Math.min(95, p + Math.random() * 6));
//                 setAudioProg((p) => Math.min(95, p + Math.random() * 5));
//                 setVisionProg((p) => Math.min(95, p + Math.random() * 4));
//                 setOverallProg((p) => Math.min(95, p + Math.random() * 3));
//             }, 300);

//             // advance pipeline stages visually
//             for (let s = 0; s < 5; s++) {
//                 setStage(s);
//                 // wait a bit per stage but allow fetch to run in parallel
//                 await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
//             }

//             const fd = new FormData();
//             fd.append("file", file);
//             const res = await fetch("/api/analyze/video", { method: "POST", body: fd });
//             if (!res.ok) {
//                 setError("Lỗi khi phân tích video.");
//                 setIsRunning(false);
//                 clearInterval(progressRef.current);
//                 setStage(-1);
//                 return;
//             }
//             const json = await res.json();
//             // fill timeline and overall
//             setTimeline(json.timeline ?? []);
//             setOverall(json.overall ?? null);
//             setTranscript(json.transcript ?? null);
//             // set progress to final confidences with smooth animation
//             const finalText = (json.overall?.by_modality?.text ?? json.timeline?.[json.timeline.length - 1]?.text?.score) ?? (json.timeline?.[0]?.text?.score ?? 0);
//             const finalAudio = (json.overall?.by_modality?.audio ?? json.timeline?.[json.timeline.length - 1]?.audio?.score) ?? (json.timeline?.[0]?.audio?.score ?? 0);
//             const finalVision = (json.overall?.by_modality?.vision ?? json.timeline?.[json.timeline.length - 1]?.vision?.score) ?? (json.timeline?.[0]?.vision?.score ?? 0);
//             const finalOverall = (json.overall?.score ?? 0);
//             // animate to final
//             let t = 0;
//             const anim = setInterval(() => {
//                 t += 1;
//                 setTextProg((p) => Math.min(100, p + (finalText * 100 - p) * 0.25 || 1));
//                 setAudioProg((p) => Math.min(100, p + (finalAudio * 100 - p) * 0.25 || 1));
//                 setVisionProg((p) => Math.min(100, p + (finalVision * 100 - p) * 0.25 || 1));
//                 setOverallProg((p) => Math.min(100, p + (finalOverall * 100 - p) * 0.25 || 1));
//                 if (t > 30) { clearInterval(anim); }
//             }, 120);
//         } catch (e) {
//             setError("Kết nối gián đoạn.");
//         } finally {
//             clearInterval(progressRef.current);
//             setStage(5);
//             setIsRunning(false);
//         }
//     }

//     // Demo mode: simulate a successful analysis locally without backend
//     const runDemo = async () => {
//         setIsRunning(true);
//         setError(null);
//         setTimeline([]);
//         setOverall(null);
//         setStage(0);
//         setTextProg(0); setAudioProg(0); setVisionProg(0); setOverallProg(0);

//         // simulate pipeline steps
//         for (let s = 0; s < 5; s++) {
//             setStage(s);
//             await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
//         }

//         // mock final results
//         const mockTimeline: TimelineItem[] = Array.from({ length: 12 }, (_, i) => ({
//             t: i,
//             text: { label: i % 3 === 0 ? 'Positive' : 'Neutral', score: 0.4 + 0.6 * Math.abs(Math.sin(i / 3)) },
//             audio: { label: i % 4 === 0 ? 'Neutral' : 'Neutral', score: 0.3 + 0.5 * Math.abs(Math.cos(i / 4)) },
//             vision: { label: i % 2 === 0 ? 'Happy' : 'Neutral', score: 0.45 + 0.45 * Math.abs(Math.sin(i / 2)) },
//             fused: { label: i % 2 === 0 ? 'Happy' : 'Neutral', score: 0.5 + 0.35 * Math.abs(Math.sin(i / 2)) },
//         }));

//         const mockOverall: ModelScore = { label: 'Happy (Overall)', score: 0.78 };
//         const mockTranscript = 'Demo transcript: Hello world, this is a demo.';

//         // animate progress to mock final confidences
//         setTimeline(mockTimeline);
//         setOverall(mockOverall);
//         setTranscript(mockTranscript);

//         const finalText = Math.round((mockTimeline[mockTimeline.length - 1].text?.score ?? 0) * 100);
//         const finalAudio = Math.round((mockTimeline[mockTimeline.length - 1].audio?.score ?? 0) * 100);
//         const finalVision = Math.round((mockTimeline[mockTimeline.length - 1].vision?.score ?? 0) * 100);
//         const finalOverall = Math.round((mockOverall.score ?? 0) * 100);

//         let step = 0;
//         const anim = setInterval(() => {
//             step += 1;
//             setTextProg((p) => Math.min(finalText, p + Math.max(1, (finalText - p) * 0.25)));
//             setAudioProg((p) => Math.min(finalAudio, p + Math.max(1, (finalAudio - p) * 0.2)));
//             setVisionProg((p) => Math.min(finalVision, p + Math.max(1, (finalVision - p) * 0.2)));
//             setOverallProg((p) => Math.min(finalOverall, p + Math.max(1, (finalOverall - p) * 0.22)));
//             if (step > 30) {
//                 clearInterval(anim);
//                 setStage(5);
//                 setIsRunning(false);
//             }
//         }, 120);
//     };

//     const clearAll = () => {
//         if (videoUrl) URL.revokeObjectURL(videoUrl);
//         setVideoUrl(null);
//         setFile(null);
//         setTimeline([]);
//         setOverall(null);
//         setTranscript(null);
//         setError(null);
//         setIsRecording(false);
//         try {
//             const s = videoRef.current?.srcObject as MediaStream | undefined;
//             if (s) s.getTracks().forEach((t) => t.stop());
//         } catch (e) { }
//     };

//     const exportJSON = () => {
//         const data = { timeline, overall, transcript };
//         const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "maxfusion_results.json";
//         a.click();
//         URL.revokeObjectURL(url);
//     };

//     const exportCSV = () => {
//         const header = ["t", "text_label", "text_score", "audio_label", "audio_score", "vision_label", "vision_score", "fused_label", "fused_score"];
//         const rows = timeline.map((it) => [
//             it.t,
//             it.text?.label ?? "",
//             (it.text?.score ?? ""),
//             it.audio?.label ?? "",
//             (it.audio?.score ?? ""),
//             it.vision?.label ?? "",
//             (it.vision?.score ?? ""),
//             it.fused?.label ?? "",
//             (it.fused?.score ?? "")
//         ]);
//         const csv = [header.join(","), ...rows.map(r => r.map(v => String(v).replace(/"/g, '""')).map(v => `"${v}"`).join(","))].join("\n");
//         const blob = new Blob([csv], { type: "text/csv" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "maxfusion_timeline.csv";
//         a.click();
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className={tokens.title}>Max Fusion (Video)</h1>
//                 <div className="flex items-center gap-2">
//                     <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
//                 </div>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//                 <div className={tokens.card}>
//                     <div className="flex gap-2 mb-4">
//                         <button className={cn("px-4 h-10 rounded-xl", tab === 'upload' ? "bg-sky-500/20 text-sky-200" : "bg-white/5")} onClick={() => setTab('upload')}>Upload Video</button>
//                         <button className={cn("px-4 h-10 rounded-xl", tab === 'record' ? "bg-sky-500/20 text-sky-200" : "bg-white/5")} onClick={() => setTab('record')}>Record Video</button>
//                     </div>

//                     {tab === 'upload' && (
//                         <div className="space-y-4">
//                             <label className="block">
//                                 <div className="w-full border-2 border-dashed border-slate-700/40 hover:border-sky-500/30 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
//                                     <div className="text-sky-200 font-medium">Drop video here or click to browse</div>
//                                     <div className="mt-1 text-sm text-slate-400">MP4, MOV, WEBM • up to 50MB</div>
//                                     <input type="file" accept="video/*" className="hidden" onChange={onFileChange} />
//                                 </div>
//                             </label>
//                             {videoUrl && <div className="overflow-hidden rounded-xl border border-white/10"><video src={videoUrl} controls className="w-full max-h-[360px] bg-slate-900" ref={videoRef} /></div>}
//                         </div>
//                     )}

//                     {tab === 'record' && (
//                         <div>
//                             <div className="flex gap-2 items-center">
//                                 {!isRecording ? (
//                                     <button className={tokens.btn.primary} onClick={startRecording}>Record (5s)</button>
//                                 ) : (
//                                     <button className={tokens.btn.ghost} onClick={stopRecording}>Stop</button>
//                                 )}
//                             </div>
//                             {videoUrl && <div className="overflow-hidden rounded-xl border border-white/10 mt-3"><video src={videoUrl} controls className="w-full max-h-[360px] bg-slate-900" ref={videoRef} /></div>}
//                         </div>
//                     )}

//                     <div className="mt-6 flex gap-3 items-center">
//                         <button className={tokens.btn.primary} onClick={analyze} disabled={isRunning || !file}>{isRunning ? 'Analyzing…' : 'Analyze'}</button>
//                         <button className={tokens.btn.ghost} onClick={runDemo} disabled={isRunning} title="Run a local demo without calling the backend">Demo</button>
//                         <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
//                     </div>

//                     {error && <div className="mt-2 text-rose-400">{error}</div>}
//                     {isRunning && <div className="mt-2 text-slate-300">Đang phân tích video...</div>}

//                     {overall && (
//                         <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
//                             <div className="text-slate-300 font-medium">Overall</div>
//                             <div className="mt-2 flex items-center justify-between">
//                                 <div className="text-lg text-emerald-300">{overall.label}</div>
//                                 <div className="text-xs text-slate-400">{(overall.score ?? 0).toFixed(2)}</div>
//                             </div>
//                             {transcript && <div className="mt-2 text-sm text-slate-400">Transcript: <button className="underline" onClick={() => navigator.clipboard.writeText(transcript || "")}>Copy</button></div>}
//                         </div>
//                     )}
//                 </div>

//                 <PipelineSteps stage={stage} />

//                 <ResultPanel timeline={timeline} overall={overall} textProg={textProg} audioProg={audioProg} visionProg={visionProg} overallProg={overallProg} />
//             </div>

//             {timeline.length > 0 && (
//                 <div className="mt-6">
//                     <div className={tokens.card}>
//                         <div className="flex items-center justify-between mb-3">
//                             <div className="font-medium text-sky-200">Timeline</div>
//                             <div className="flex gap-2">
//                                 <button className={tokens.btn.ghost} onClick={exportJSON}>Export JSON</button>
//                                 <button className={tokens.btn.ghost} onClick={exportCSV}>Export CSV</button>
//                             </div>
//                         </div>
//                         <div className="mt-2 grid grid-cols-1 gap-2 max-h-56 overflow-auto">
//                             {timeline.map((t, i) => (
//                                 <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-white/5">
//                                     <div className="text-xs text-slate-400">{t.t}s</div>
//                                     <div className="flex gap-4 items-center">
//                                         <div className="text-sm">{t.fused?.label ?? '-'}</div>
//                                         <div className="text-xs text-slate-400">{(t.fused?.score ?? 0).toFixed(2)}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }








import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===================== Types ===================== */
type ModelScore = { label: string; score: number; modality?: string };
type TimelineItem = {
  t: number;
  text?: ModelScore;
  audio?: ModelScore;
  vision?: ModelScore;
  fused?: ModelScore;
};
type RowItem = {
  id: string;
  source: string;
  label: string;
  confidence: number; // %
  latency: number;    // ms
  time: string;
  raw: {
    overall: ModelScore | null;
    timeline: TimelineItem[];
    byMod?: { text?: ModelScore; audio?: ModelScore; vision?: ModelScore };
  };
};

/* ===================== Tokens / Utils ===================== */
const tokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl p-6",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  btn: {
    primary:
      "inline-flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
    subtle:
      "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
    tab: "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
  },
};
const cn = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");
const nowTime = () =>
  new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();

/* ===================== Keyframes ===================== */
const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
`;

/* ===================== Small UI ===================== */
const Step = ({
  idx,
  text,
  active,
  done,
}: {
  idx: number;
  text: string;
  active: boolean;
  done: boolean;
}) => (
  <div className="flex items-start gap-3">
    <div
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-sm border",
        done
          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
          : active
          ? "bg-sky-500/20 border-sky-400/40 text-sky-200"
          : "bg-white/5 border-white/10 text-slate-300"
      )}
    >
      {done ? "✓" : idx}
    </div>
    <div
      className={cn(
        "text-slate-300",
        active && "text-sky-200",
        done && "text-emerald-200"
      )}
    >
      {text}
    </div>
  </div>
);

const PipelineSteps = ({ stage }: { stage: number }) => {
  const labels = [
    "Extract frames (fps=5) & face-crop",
    "Extract audio & preprocess",
    "ASR → transcript",
    "Inference: vision / audio / text",
    "Fusion → overall",
  ];
  return (
    <div className={tokens.card}>
      <h2 className="text-lg font-semibold text-sky-100 mb-4">Pipeline</h2>
      <div className="grid gap-3">
        {labels.map((t, i) => (
          <Step key={i} idx={i + 1} text={t} active={stage === i} done={stage > i} />
        ))}
      </div>
    </div>
  );
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data.length) return <div className="h-[54px]" />;
  const w = 420, h = 54, pad = 6;
  const xs = data.map((_, i) => (i / (data.length - 1)) * (w - pad * 2) + pad);
  const ys = data.map((v) => (1 - v) * (h - pad * 2) + pad);
  const d = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[54px]">
      <path d={d} fill="none" stroke="currentColor" className="text-sky-400/80" strokeWidth="2.5" />
    </svg>
  );
};

const Bar = ({ value }: { value: number }) => (
  <div className="h-1.5 rounded-full bg-slate-900/60 border border-white/10 overflow-hidden">
    <div
      className="h-full"
      style={{
        width: `${Math.min(100, Math.max(0, Math.round(value * 100)))}%`,
        background:
          "linear-gradient(90deg,rgba(56,189,248,1),rgba(99,102,241,1))",
        backgroundSize: "300% 100%",
        animation: "moveX 2.4s linear infinite",
      }}
    />
  </div>
);

const Ring = ({ value, size = 132 }: { value: number; size?: number }) => {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  const ring = `conic-gradient(#22d3ee ${pct * 3.6}deg, #0b1220 0)`;
  return (
    <div className="grid place-items-center" style={{ width: size, height: size }}>
      <div className="rounded-full p-2" style={{ width: size, height: size, background: "linear-gradient(120deg,#22d3ee33,#6366f133)" }}>
        <div className="rounded-full grid place-items-center" style={{ width: "100%", height: "100%", background: ring }}>
          <div className="rounded-full bg-slate-900/80 border border-white/10 w-[78%] h-[78%] grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-sky-200">{pct}%</div>
              <div className="text-xs text-slate-400">confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalityCard = ({
  title,
  label,
  confidence,
}: {
  title: string;
  label?: string;
  confidence?: number;
}) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
    <div className="text-slate-400 text-sm">{title}</div>
    <div className="text-xl font-semibold text-sky-200 mt-1">{label ?? "—"}</div>
    <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500"
        style={{ width: `${Math.round((confidence ?? 0) * 100)}%` }}
      />
    </div>
    <div className="text-xs text-slate-400 mt-1">{Math.round((confidence ?? 0) * 100)}%</div>
  </div>
);

const ResultPanel: React.FC<{
  timeline: TimelineItem[];
  overall: ModelScore | null;
  textProg?: number;
  audioProg?: number;
  visionProg?: number;
  overallProg?: number;
}> = ({ timeline, overall, textProg, audioProg, visionProg, overallProg }) => {
  const last = timeline.length ? timeline[timeline.length - 1] : null;
  const fusedSeries = timeline.map((t) => t.fused?.score ?? 0);

  return (
    <div className={tokens.card}>
      <h2 className="text-lg font-semibold text-sky-100 mb-4">Results</h2>

      {/* 1) Chart */}
      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
        <div className="text-slate-400 text-sm mb-1">Fused score timeline</div>
        <Sparkline data={fusedSeries} />
      </div>

      {/* 2) Overall */}
      <div className="mt-5">
        <div className="text-slate-400 text-sm">Fusion (overall)</div>
        <div className="text-2xl font-semibold text-emerald-300 mt-1">
          {overall?.label ?? "—"}
        </div>
        <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-500"
            style={{
              width: `${Math.round((overallProg ?? overall?.score ?? 0) * 100)}%`,
            }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {Math.round((overallProg ?? overall?.score ?? 0) * 100)}%
        </div>
      </div>

      {/* 3) Modality cards */}
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
};

/* ===================== Modal wrapper ===================== */
const ModalWrap: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) =>
  !open ? null : (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sky-100 text-lg font-semibold">{title ?? "Details"}</div>
            <button
              className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );

/* ===================== Main ===================== */
export default function MaxFusion() {
  /* Tabs & media */
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  /* Recording */
  const [isRecording, setIsRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const MAX_REC_SEC = 60;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* Analysis states */
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState<number>(-1);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [overall, setOverall] = useState<ModelScore | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Animated % bars */
  const [textProg, setTextProg] = useState<number>(0);
  const [audioProg, setAudioProg] = useState<number>(0);
  const [visionProg, setVisionProg] = useState<number>(0);
  const [overallProg, setOverallProg] = useState<number>(0);
  const progressRef = useRef<any>(null);
  const recTimerRef = useRef<any>(null);

  /* Table + detail modal */
  const [rows, setRows] = useState<RowItem[]>([]);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q)
    );
  }, [rows, query]);
  const [activeRow, setActiveRow] = useState<RowItem | null>(null);

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      stopTracks();
      clearInterval(progressRef.current);
      clearInterval(recTimerRef.current);
    };
  }, [videoUrl]);

  /* Autoplay when stream/file changes */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.srcObject) {
        v.muted = true;
        v.play().catch(() => {});
      } else if (videoUrl) {
        v.muted = false;
        v.play().catch(() => {});
      }
    } catch {}
  }, [videoUrl]);

  function stopTracks() {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch {}
  }

  /* Upload */
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      setError("File quá lớn (max 50MB).");
      return;
    }
    setFile(f);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(f));
    setError(null);
  }

  /* Record (live preview + ≤60s) */
  async function startRecording() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ camera.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;

      // live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.controls = false;
        await videoRef.current.play().catch(() => {});
      }

      const mr = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };
      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const f = new File([blob], "recording.webm", { type: blob.type });
        setFile(f);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setRecSec(0);
        stopTracks();
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      setRecSec(0);

      // countdown
      clearInterval(recTimerRef.current);
      recTimerRef.current = setInterval(() => {
        setRecSec((s) => {
          const n = s + 1;
          if (n >= MAX_REC_SEC) stopRecording();
          return n;
        });
      }, 1000);
    } catch {
      setError("Không thể truy cập camera/micro.");
    }
  }
  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") mr.stop();
    clearInterval(recTimerRef.current);
  }

  /* Analyze */
  async function analyze() {
    if (!file) {
      setError("Chưa có video để phân tích.");
      return;
    }
    setIsRunning(true);
    setError(null);
    setTimeline([]);
    setOverall(null);
    setStage(0);
    setTextProg(0);
    setAudioProg(0);
    setVisionProg(0);
    setOverallProg(0);

    try {
      // fake progress
      progressRef.current = setInterval(() => {
        setTextProg((p) => Math.min(95, p + Math.random() * 6));
        setAudioProg((p) => Math.min(95, p + Math.random() * 5));
        setVisionProg((p) => Math.min(95, p + Math.random() * 4));
        setOverallProg((p) => Math.min(95, p + Math.random() * 3));
      }, 300);

      for (let s = 0; s < 5; s++) {
        setStage(s);
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
      }

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/analyze/video", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Lỗi khi phân tích video.");
        setIsRunning(false);
        clearInterval(progressRef.current);
        setStage(-1);
        return;
      }
      const json = await res.json();
      setTimeline(json.timeline ?? []);
      setOverall(json.overall ?? null);
      setTranscript(json.transcript ?? null);

      const last = json.timeline?.[json.timeline.length - 1] ?? {};
      const finalText = json.overall?.by_modality?.text ?? last?.text?.score ?? 0;
      const finalAudio = json.overall?.by_modality?.audio ?? last?.audio?.score ?? 0;
      const finalVision = json.overall?.by_modality?.vision ?? last?.vision?.score ?? 0;
      const finalOverall = json.overall?.score ?? 0;

      // animate to final
      let t = 0;
      const anim = setInterval(() => {
        t += 1;
        setTextProg((p) => Math.min(100, p + (finalText * 100 - p) * 0.25 || 1));
        setAudioProg((p) => Math.min(100, p + (finalAudio * 100 - p) * 0.25 || 1));
        setVisionProg((p) => Math.min(100, p + (finalVision * 100 - p) * 0.25 || 1));
        setOverallProg((p) => Math.min(100, p + (finalOverall * 100 - p) * 0.25 || 1));
        if (t > 30) clearInterval(anim);
      }, 120);

      // push a row into Analysis Results
      const src = tab === "record" ? "Record" : (file ? "Upload" : "Video");
      const latency = 600 + Math.round(Math.random() * 120);
      const newRow: RowItem = {
        id: crypto.randomUUID(),
        source: src,
        label: json.overall?.label ?? "—",
        confidence: Math.round((json.overall?.score ?? 0) * 100),
        latency,
        time: nowTime(),
        raw: {
          overall: json.overall ?? null,
          timeline: json.timeline ?? [],
          byMod: { text: last.text, audio: last.audio, vision: last.vision },
        },
      };
      setRows((r) => [newRow, ...r]);
    } catch {
      setError("Kết nối gián đoạn.");
    } finally {
      clearInterval(progressRef.current);
      setStage(5);
      setIsRunning(false);
    }
  }

  /* Demo (no backend) */
  const runDemo = async () => {
    setIsRunning(true);
    setError(null);
    setTimeline([]);
    setOverall(null);
    setStage(0);
    setTextProg(0);
    setAudioProg(0);
    setVisionProg(0);
    setOverallProg(0);

    for (let s = 0; s < 5; s++) {
      setStage(s);
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    }

    const mockTimeline: TimelineItem[] = Array.from({ length: 15 }, (_, i) => ({
      t: i,
      text: { label: i % 3 === 0 ? "Positive" : "Neutral", score: 0.4 + 0.6 * Math.abs(Math.sin(i / 3)) },
      audio: { label: "Neutral", score: 0.3 + 0.5 * Math.abs(Math.cos(i / 4)) },
      vision: { label: i % 2 === 0 ? "Happy" : "Neutral", score: 0.45 + 0.45 * Math.abs(Math.sin(i / 2)) },
      fused: { label: i % 2 === 0 ? "Happy" : "Neutral", score: 0.5 + 0.35 * Math.abs(Math.sin(i / 2)) },
    }));
    const mockOverall: ModelScore = { label: "Happy (Overall)", score: 0.78 };
    const mockTranscript = "Demo transcript: Hello world, this is a demo.";

    setTimeline(mockTimeline);
    setOverall(mockOverall);
    setTranscript(mockTranscript);

    const finalText = Math.round((mockTimeline.at(-1)?.text?.score ?? 0) * 100);
    const finalAudio = Math.round((mockTimeline.at(-1)?.audio?.score ?? 0) * 100);
    const finalVision = Math.round((mockTimeline.at(-1)?.vision?.score ?? 0) * 100);
    const finalOverall = Math.round((mockOverall.score ?? 0) * 100);

    let step = 0;
    const anim = setInterval(() => {
      step += 1;
      setTextProg((p) => Math.min(finalText, p + Math.max(1, (finalText - p) * 0.25)));
      setAudioProg((p) => Math.min(finalAudio, p + Math.max(1, (finalAudio - p) * 0.2)));
      setVisionProg((p) => Math.min(finalVision, p + Math.max(1, (finalVision - p) * 0.2)));
      setOverallProg((p) => Math.min(finalOverall, p + Math.max(1, (finalOverall - p) * 0.22)));
      if (step > 30) {
        clearInterval(anim);
        setStage(5);
        setIsRunning(false);
      }
    }, 120);

    const lastMock = mockTimeline[mockTimeline.length - 1];
    const demoRow: RowItem = {
      id: crypto.randomUUID(),
      source: tab === "record" ? "Record" : (file ? "Upload" : "Demo"),
      label: mockOverall.label,
      confidence: Math.round(mockOverall.score * 100),
      latency: 640 + Math.round(Math.random() * 60),
      time: nowTime(),
      raw: {
        overall: mockOverall,
        timeline: mockTimeline,
        byMod: { text: lastMock.text, audio: lastMock.audio, vision: lastMock.vision },
      },
    };
    setRows((r) => [demoRow, ...r]);
  };

  /* Export rows (Analysis Results) */
  const exportRowsJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analysis-results.json"; a.click();
    URL.revokeObjectURL(url);
  };
  const exportRowsCSV = () => {
    const header = "id,source,label,confidence,latency,time\n";
    const body = rows.map(r =>
      `${r.id},"${r.source.replaceAll('"','""')}",${r.label},${r.confidence},${r.latency},${r.time}`
    ).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analysis-results.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* Clear */
  const clearAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setFile(null);
    setTimeline([]);
    setOverall(null);
    setTranscript(null);
    setError(null);
    setIsRecording(false);
    setRecSec(0);
    stopTracks();
  };

  /* ========= Modal content ========= */
  const DetailModal = (
    <ModalWrap open={!!activeRow} onClose={() => setActiveRow(null)} title="Analysis detail">
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

          <div className="grid place-items-center">
            <Ring value={(activeRow.confidence ?? 0) / 100} />
          </div>

          <div className="md:col-span-2">
            <div className="text-slate-300 text-sm mb-2">Modality breakdown</div>
            <div className="grid md:grid-cols-3 gap-3">
              {(["text","audio","vision"] as const).map((m) => (
                <div key={m} className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
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
  );

  /* ===================== Render ===================== */
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <style>{KEYFRAMES}</style>

      {/* Glow Header */}
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
                <path d="M12 2v20M4 6v12M20 8v8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
                Max Fusion (Video)
              </h1>
              <p className="text-slate-200/85">
                Phân tích video đa phương thức — record hoặc upload, pipeline có hoạt ảnh.
              </p>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-100">
                Glow UI
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-100">
                Realtime-ready
              </span>
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

      {/* Main grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: input */}
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
                  <input type="file" accept="video/*" className="hidden" onChange={onFileChange} />
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
                  <button className={tokens.btn.primary} onClick={startRecording}>
                    Record (≤{MAX_REC_SEC}s)
                  </button>
                ) : (
                  <>
                    <button className={tokens.btn.ghost} onClick={stopRecording}>Stop</button>
                    <span className="text-slate-300 text-sm">Recording… {recSec}s</span>
                  </>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 mt-3">
                {/* live preview when recording (srcObject) or playback when finished */}
                <video
                  ref={videoRef}
                  src={isRecording ? undefined : videoUrl ?? undefined}
                  controls={!isRecording && !!videoUrl}
                  className="w-full max-h-[360px] bg-slate-900"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 items-center">
            <button className={tokens.btn.primary} onClick={analyze} disabled={isRunning || !file}>
              {isRunning ? "Analyzing…" : "Analyze"}
            </button>
            <button className={tokens.btn.subtle} onClick={runDemo} disabled={isRunning} title="Run local demo">
              Demo
            </button>
            <button className={tokens.btn.subtle} onClick={clearAll}>
              Clear
            </button>
          </div>

          {error && <div className="mt-2 text-rose-400">{error}</div>}
          {isRunning && <div className="mt-2 text-slate-300">Đang phân tích video...</div>}

          {/* ĐÃ XÓA khối Overall dưới 3 nút theo yêu cầu */}
          {false && transcript}
        </div>

        {/* Middle: pipeline */}
        <PipelineSteps stage={stage} />

        {/* Right: results */}
        <ResultPanel
          timeline={timeline}
          overall={overall}
          textProg={textProg / 100}
          audioProg={audioProg / 100}
          visionProg={visionProg / 100}
          overallProg={overallProg / 100}
        />
      </div>

      {/* ======= Analysis Results (table like Fused) ======= */}
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
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <button className={tokens.btn.subtle} onClick={() => setRows([])}>Clear all</button>
          <button className={tokens.btn.subtle} onClick={exportRowsJSON}>Export JSON</button>
          <button className={tokens.btn.subtle} onClick={exportRowsCSV}>Export CSV</button>
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
                  <td colSpan={7} className="px-3 py-4 text-center text-slate-400">
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
                  <td className="px-3 py-2 text-slate-300">{r.confidence}%</td>
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

      {DetailModal}
    </div>
  );
}
