// import React, { useMemo, useState } from "react";
// // Using lightweight DOM animations instead of framer-motion to avoid extra dependency

// // =================== Design tokens ===================
// const tokens = {
//   card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
//   title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
//   btn: {
//     primary:
//       "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
//     ghost:
//       "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
//     subtle:
//       "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
//   },
// };
// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// // =================== Fancy gradient border ===================
// const GlowCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
//   <div className="relative">
//     <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-fuchsia-500/40 blur opacity-60 animate-pulse [animation-duration:5s]" />
//     <div className={cn(tokens.card, "relative p-5 md:p-6")}>{children}</div>
//   </div>
// );

// // =================== Types ===================
// type Highlight = { start: number; end: number; weight?: number };
// type TopK = { label: string; score: number };
// type Result = { label: string; polarity: number; topK: TopK[]; latency: number; input: string; highlights?: Highlight[] };
// type BatchRow = { text: string; label: string; polarity: number; confidence: number };

// // ----------------- Sentiment Meter (gauge) -----------------
// const Meter: React.FC<{ polarity?: number }> = ({ polarity = 0 }) => {
//   const pct = Math.round(((polarity + 1) / 2) * 100);
//   return (
//     <div className="flex items-center gap-3">
//       <div className="relative w-36 h-36">
//         <svg viewBox="0 0 120 120" className="w-full h-full rotate-[-90deg]">
//           <defs>
//             <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#06b6d4" />
//               <stop offset="100%" stopColor="#6366f1" />
//             </linearGradient>
//           </defs>
//           <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,.08)" strokeWidth="12" fill="none" />
//           <circle
//             cx="60" cy="60" r="50" stroke="url(#g)" strokeWidth="12" fill="none" strokeLinecap="round"
//             style={{
//               strokeDasharray: 314.1592653589793,
//               strokeDashoffset: 314.1592653589793 * (1 - pct / 100),
//               transition: 'stroke-dashoffset 0.7s cubic-bezier(.2,.9,.2,1)'
//             }}
//           />
//         </svg>
//         <div className="absolute inset-0 grid place-items-center">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-sky-200">{pct}%</div>
//             <div className="text-xs text-slate-400">polarity</div>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="text-xs text-slate-400 mb-1">Meter</div>
//         <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400"
//             style={{ width: `${pct}%`, transition: 'width 0.6s cubic-bezier(.2,.9,.2,1)' }}
//           />
//         </div>
//         <div className="mt-1 text-xs text-slate-400">-1 (negative) → +1 (positive)</div>
//       </div>
//     </div>
//   );
// };

// // ----------------- Highlighted text explanation -----------------
// const ExplainText: React.FC<{ text?: string; highlights?: Highlight[] }> = ({ text, highlights }) => {
//   if (!text) return null;
//   const parts: Array<{ type: 'plain' | 'hl'; content: string; weight?: number }> = [];
//   let last = 0;
//   const hs = [...(highlights || [])].sort((a, b) => a.start - b.start);
//   hs.forEach((h) => {
//     if (h.start > last) parts.push({ type: 'plain', content: text.slice(last, h.start) });
//     parts.push({ type: 'hl', content: text.slice(h.start, h.end), weight: h.weight });
//     last = h.end;
//   });
//   if (last < text.length) parts.push({ type: 'plain', content: text.slice(last) });

//   return (
//     <p className="leading-relaxed">
//       {parts.map((p, i) => (
//         <span key={i} className={p.type === 'hl' ? 'px-1 rounded-md bg-sky-500/10 text-sky-200' : ''}>
//           {p.content}
//         </span>
//       ))}
//     </p>
//   );
// };

// // ----------------- Result Card -----------------
// const ResultCard: React.FC<{ result: Result | null; onRerun?: (text: string) => void }> = ({ result, onRerun }) => {
//   if (!result) return (
//     <div className={cn(tokens.card, 'p-6 grid place-items-center text-slate-400')}>Không có kết quả <button className={tokens.btn.subtle + ' ml-3'}>Sample</button></div>
//   );
//   const color = result.label === 'Positive' ? 'text-emerald-300' : result.label === 'Negative' ? 'text-rose-300' : 'text-slate-300';
//   return (
//     <GlowCard>
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="text-sm uppercase tracking-widest text-slate-400">Text Sentiment</div>
//           <div className={cn('mt-1 text-2xl font-semibold', color)} style={{ transition: 'transform .32s ease, opacity .32s ease', transform: 'translateY(0)', opacity: 1 }}>{result.label}</div>
//         </div>
//         <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">{result.latency} ms</div>
//       </div>

//       <div className="mt-4 grid md:grid-cols-2 gap-6">
//         <Meter polarity={result.polarity} />
//         <div>
//           <div className="text-xs text-slate-400 mb-2">Top‑K</div>
//           <div className="grid grid-cols-2 gap-2">
//             {result.topK.map((k, i) => (
//               <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
//                 <span className="text-slate-200">{k.label}</span>
//                 <span className="text-slate-400 text-sm">{Math.round(k.score * 100)}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <div className="text-xs text-slate-400 mb-2">Giải thích nhanh</div>
//         <ExplainText text={result.input} highlights={result.highlights} />
//       </div>
//       {onRerun && (
//         <div className="mt-4 flex justify-end">
//           <button className={tokens.btn.subtle} onClick={() => onRerun(result.input)}>Re-run this line</button>
//         </div>
//       )}
//     </GlowCard>
//   );
// };

// // ----------------- Batch Table -----------------
// const BatchTable: React.FC<{ rows?: (BatchRow & { id: string; ts: number })[]; onRowClick?: (id: string) => void; selectedId?: string | null; onDeleteRow?: (id: string) => void }> = ({ rows = [], onRowClick, selectedId, onDeleteRow }) => {
//   return (
//     <div className={cn(tokens.card, 'overflow-hidden')}>
//       <table className="w-full text-sm">
//         <thead className="bg-white/5 border-b border-white/10 text-slate-300">
//           <tr>
//             <th className="text-left px-3 py-2 font-medium">#</th>
//             <th className="text-left px-3 py-2 font-medium">Văn bản</th>
//             <th className="text-left px-3 py-2 font-medium">Nhãn</th>
//             <th className="text-left px-3 py-2 font-medium">Polarity</th>
//             <th className="text-left px-3 py-2 font-medium">Confidence</th>
//             <th className="text-left px-3 py-2 font-medium"> </th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="p-6 text-center text-slate-400">No batch results yet.</td>
//             </tr>
//           ) : (
//             rows.map((r, i) => (
//               <tr key={r.id} onClick={() => onRowClick?.(r.id)} className={cn('hover:bg-white/5 cursor-pointer', selectedId === r.id && 'bg-sky-700/10')}>
//                 <td className="px-3 py-2 text-slate-300">{i + 1}</td>
//                 <td className="px-3 py-2 text-slate-200 truncate max-w-[460px]" title={r.text}>{r.text}</td>
//                 <td className="px-3 py-2"><span className={r.label === 'Positive' ? 'text-emerald-300' : r.label === 'Negative' ? 'text-rose-300' : 'text-slate-300'}>{r.label}</span></td>
//                 <td className="px-3 py-2 text-slate-300">{r.polarity.toFixed(2)}</td>
//                 <td className="px-3 py-2 text-slate-300">{Math.round((r as any).confidence * 100)}%</td>
//                 <td className="px-3 py-2 text-slate-300">
//                   <button className="text-sm text-rose-400 hover:text-rose-300" onClick={(e) => { e.stopPropagation(); onDeleteRow?.(r.id); }}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ----------------- Main Page -----------------
// export default function TextSentimentPage(): React.ReactElement {
//   const [text, setText] = useState("");
//   const [isBatch, setIsBatch] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<Result | null>(null);
//   // persistent history of all batch rows across analyzes
//   const [historyRows, setHistoryRows] = useState<(BatchRow & { id: string; ts: number })[]>([]);
//   const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
//   const [filterQ, setFilterQ] = useState<string>("");

//   const chars = text.length;
//   const over = chars > 5000;

//   const sample = () => {
//     setText("Dịch vụ rất tuyệt! Nhân viên thân thiện và mình sẽ quay lại nữa.");
//   };

//   const warn = useMemo(() => {
//     const arr: string[] = [];
//     if (over) arr.push("Vượt quá 5.000 ký tự.");
//     if (text && !/[ăâđêôơưáàảãạ]/i.test(text) && /[a-zA-Z]/.test(text) && !/\p{Extended_Pictographic}/u.test(text)) {
//       arr.push("Văn bản không dấu có thể giảm độ chính xác.");
//     }
//     return arr;
//   }, [text, over]);

//   const analyze = async () => {
//     if (!text || over) return;
//     setLoading(true);
//     setResult(null);

//     await new Promise((r) => setTimeout(r, 650)); // mock latency

//     if (!isBatch) {
//       const polarity = 0.62;
//       const topK = [{ label: 'Positive', score: 0.82 }, { label: 'Neutral', score: 0.14 }, { label: 'Negative', score: 0.04 }];
//       const highlights: Highlight[] = [{ start: 11, end: 21, weight: 0.7 }, { start: 34, end: 43, weight: 0.5 }];
//       setResult({ label: 'Positive', /*confidence: undefined,*/ polarity, topK, latency: 312, input: text, highlights });
//       setSelectedRowIndex(null);
//     } else {
//       const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 200);
//       const ts = Date.now();
//       const newRows = lines.map((t, i) => ({ id: `${ts}-${i}`, ts, text: t, label: i % 5 === 0 ? 'Negative' : 'Positive', polarity: i % 5 === 0 ? -0.3 : 0.6, confidence: i % 5 === 0 ? 0.65 : 0.86 }));
//       setHistoryRows((prev) => {
//         const priorLen = prev.length;
//         const out = [...prev, ...newRows];
//         // select the first of the newly appended rows
//         setSelectedRowIndex(priorLen);
//         return out;
//       });
//     }
//     setLoading(false);
//   };

//   // analyze single text directly (used for rerun of one line)
//   const analyzeTextDirect = async (inputText: string) => {
//     if (!inputText || inputText.length > 5000) return;
//     setLoading(true);
//     setResult(null);
//     // simulate latency
//     await new Promise((r) => setTimeout(r, 500));
//     const polarity = Math.random() * 0.6 - 0.1; // small mock
//     const topK = [{ label: 'Positive', score: 0.7 }, { label: 'Neutral', score: 0.2 }, { label: 'Negative', score: 0.1 }];
//     const res = { label: polarity > 0 ? 'Positive' : 'Negative', polarity, topK, latency: 120, input: inputText, highlights: [] };
//     setResult(res);
//     // also append to historyRows so single rerun is preserved
//     const id = `${Date.now()}-single`;
//     setHistoryRows((prev) => [...prev, { id, ts: Date.now(), text: inputText, label: res.label, polarity: res.polarity, confidence: Math.round((res.topK?.[0]?.score ?? 0) * 100) / 100 } as any]);
//     setLoading(false);
//   };

//   // clear only the text input (preserve results/table)
//   const clearText = () => { setText(""); };

//   // Export functions for batch (history)
//   const exportJSON = () => {
//     const data = { rows: historyRows };
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'text_sentiment_batch.json';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportCSV = () => {
//     if (!historyRows.length) return;
//     const header = ['index', 'text', 'label', 'polarity', 'confidence'];
//     const rows = historyRows.map((r, i) => [String(i + 1), (r.text || '').replace(/"/g, '""'), r.label, String(r.polarity), String((r as any).confidence ?? '')]);
//     const csv = [header.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'text_sentiment_batch.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Demo runner: fill sample lines and run analyze
//   const runDemo = () => {
//     const demo = [
//       'Dịch vụ rất tuyệt! Nhân viên thân thiện và mình sẽ quay lại nữa.',
//       'Với cấu trúc như này thì phải làm sao đạt được độ chính xác cao nhất có thể',
//       'tôi đang rất bực, đừng làm tôi buồn!'
//     ].join('\n');
//     setText(demo);
//     setIsBatch(true);
//     // give state a tick before analyze
//     setTimeout(() => analyze(), 120);
//   };

//   const clearAllResults = () => {
//     setHistoryRows([]);
//     setSelectedRowIndex(null);
//   };

//   const filteredRows = historyRows.filter(r => {
//     if (!filterQ) return true;
//     const q = filterQ.toLowerCase();
//     return r.text.toLowerCase().includes(q) || r.label.toLowerCase().includes(q);
//   });

//   return (
//     <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className={tokens.title}>Text Sentiment</h1>
//         <div className="text-sm text-slate-400">Hỗ trợ tiếng Việt & Anh</div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Input */}
//         <GlowCard>
//           <div className="text-slate-200 font-semibold mb-2">Text Input</div>
//           <div className="relative">
//             <textarea
//               rows={5}
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Nhập văn bản hoặc dán bình luận/tweet…"
//               className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
//             />
//             <div className="absolute bottom-2 right-3 text-xs text-slate-400">{chars}/5000</div>
//           </div>

//           <div className="mt-3 flex items-center gap-4">
//             <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
//               <input type="checkbox" className="accent-sky-500" checked={isBatch} onChange={(e) => setIsBatch(e.target.checked)} />
//               Batch by line
//             </label>
//             <div className="flex items-center gap-2">
//               <button className={tokens.btn.subtle} onClick={sample}>Sample</button>
//               <button className={tokens.btn.ghost} onClick={runDemo}>Demo</button>
//             </div>
//           </div>

//           {warn.length > 0 && (
//             <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
//               {warn.map((w, i) => (<div key={i}>• {w}</div>))}
//             </div>
//           )}

//           <div className="mt-4 flex gap-3">
//             <button className={tokens.btn.primary} onClick={analyze} disabled={loading || !text || over}>{loading ? 'Analyzing…' : 'Analyze'}</button>
//             <button className={tokens.btn.ghost} onClick={clearText}>Clear text</button>
//           </div>
//         </GlowCard>

//         {/* Result */}
//         <div>
//           {loading ? (
//             <div className={cn(tokens.card, 'p-6')}>
//               <div className="animate-pulse space-y-3">
//                 <div className="h-6 bg-white/5 rounded w-1/3" />
//                 <div className="h-4 bg-white/5 rounded w-1/2" />
//                 <div className="h-40 bg-white/5 rounded" />
//               </div>
//             </div>
//           ) : (
//             <ResultCard
//               result={selectedRowIndex != null && historyRows[selectedRowIndex] ? {
//                 label: historyRows[selectedRowIndex].label,
//                 polarity: historyRows[selectedRowIndex].polarity,
//                 topK: [{ label: historyRows[selectedRowIndex].label, score: (historyRows[selectedRowIndex] as any).confidence ?? 0 }],
//                 latency: 0,
//                 input: historyRows[selectedRowIndex].text,
//                 highlights: [],
//               } : result}
//               onRerun={(txt) => analyzeTextDirect(txt)}
//             />
//           )}
//         </div>
//       </div>

//       {/* Batch Table */}
//       <div className="mt-6">
//         <div className="flex items-center gap-3 mb-3">
//           <input value={filterQ} onChange={(e) => setFilterQ(e.target.value)} placeholder="Search text or label…" className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-slate-200" />
//           <button className={tokens.btn.subtle} onClick={clearAllResults}>Clear all results</button>
//           <button className={tokens.btn.ghost} onClick={exportJSON} disabled={!historyRows.length}>Export JSON</button>
//           <button className={tokens.btn.ghost} onClick={exportCSV} disabled={!historyRows.length}>Export CSV</button>
//         </div>

//         <BatchTable rows={filteredRows} onRowClick={(id) => setSelectedRowIndex(historyRows.findIndex(r => r.id === id))} selectedId={selectedRowIndex != null ? historyRows[selectedRowIndex]?.id ?? null : null} onDeleteRow={(id) => { setHistoryRows(prev => prev.filter(r => r.id !== id)); if (selectedRowIndex != null && historyRows[selectedRowIndex]?.id === id) setSelectedRowIndex(null); }} />
//       </div>
//     </div>
//   );
// }







// src/pages/TextSentimentPage.tsx
import React, { useEffect, useMemo, useState } from "react";

/* =============== tiny utils =============== */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

const tokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-sky-900/20 hover:shadow-xl animate-[fadeIn_.42s_ease] will-change-transform",
  btn: {
    primary:
      "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 hover:from-sky-400 hover:to-fuchsia-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10 disabled:opacity-60",
    subtle:
      "px-3 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-60",
  },
};

const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes floatDot{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes runLine{0%{left:-35%}100%{left:100%}}
`;

/* =============== Animated Header (đổi màu được qua props) =============== */
type AnimatedHeaderProps = {
  bgColors?: [string, string, string, string];
  lineColors?: [string, string, string];
};
const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  bgColors = ["#0ea5e9", "#4f46e5", "#a855f7", "#4f46e5"],
  lineColors = ["#22d3ee", "#a855f7", "#22d3ee"],
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
    <style>{KEYFRAMES}</style>

    {/* moving gradient bg */}
    <div
      className="absolute inset-0 opacity-75"
      style={{
        background: `linear-gradient(90deg,${bgColors[0]},${bgColors[1]},${bgColors[2]},${bgColors[3]},${bgColors[0]})`,
        backgroundSize: "300% 100%",
        animation: "moveX 16s linear infinite",
      }}
    />
    {/* dark veil */}
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />

    {/* floating dots */}
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
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              d="M3 12h4l2-5 3 10 2-5h5"
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
            Text Sentiment
          </h1>
          <p className="text-slate-200/85">
            Nền tảng phân tích cảm xúc cho <b>Text</b> (mở rộng <i>Audio</i>,{" "}
            <i>Vision</i>).
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

    {/* moving stripe bottom — chạy đều trái → phải */}
    <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
      <div
        className="absolute top-0 h-[3px] w-[35%] rounded-full"
        style={{
          background: `linear-gradient(90deg,${lineColors[0]},${lineColors[1]},${lineColors[2]})`,
          animation: "runLine 2.8s linear infinite",
        }}
      />
    </div>
  </div>
);

/* =============== Gauge =============== */
const Meter: React.FC<{ polarity?: number; size?: number }> = ({
  polarity = 0,
  size = 180,
}) => {
  const pct = Math.round(((polarity + 1) / 2) * 100);
  const r = 70;
  const C = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full rotate-[-90deg]" role="img">
          <defs>
            <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r={r} stroke="rgba(255,255,255,.12)" strokeWidth="18" fill="none" />
          <circle
            cx="100"
            cy="100"
            r={r}
            stroke="url(#gauge)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: C,
              strokeDashoffset: C * (1 - pct / 100),
              transition: "stroke-dashoffset .7s cubic-bezier(.2,.9,.2,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-sky-200">{pct}%</div>
            <div className="text-xs text-slate-400">polarity</div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-400 mb-1">Thang đo</div>
        <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400"
            style={{ width: `${pct}%`, transition: "width .6s cubic-bezier(.2,.9,.2,1)" }}
          />
        </div>
        <div className="mt-1 text-xs text-slate-400">−1 (negative) → +1 (positive)</div>
      </div>
    </div>
  );
};

/* =============== Types =============== */
type BatchRow = {
  id: string;
  ts: number;
  text: string;
  label: string;
  polarity: number;
  confidence: number;
};

/* =============== Modal Detail =============== */
const DetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  row?: BatchRow | null;
}> = ({ open, onClose, row }) => {
  if (!open || !row) return null;

  const top = [
    { label: row.label, score: row.confidence },
    { label: row.label === "Positive" ? "Neutral" : "Positive", score: Math.max(0.1, 1 - row.confidence - 0.1) },
    { label: "Negative", score: row.label === "Negative" ? row.confidence / 2 : 0.1 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-[fadeIn_.25s_ease]" onClick={onClose}>
      <div className={cx(tokens.card, "w-[min(960px,92vw)] mx-auto mt-16 p-6 md:p-7")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-2xl font-bold text-sky-200">Chi tiết phân tích</h3>
          <button className="w-12 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-7">
          <div>
            <div className="text-xs text-slate-400 mb-1">Văn bản</div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-slate-200">{row.text}</div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-slate-400">Nhãn:</span>
              <span
                className={cx(
                  "px-2 py-1 rounded-lg border border-white/10",
                  row.label === "Positive" ? "text-emerald-300" : row.label === "Negative" ? "text-rose-300" : "text-slate-200"
                )}
              >
                {row.label}
              </span>
              <span className="text-xs text-slate-400">Confidence: {Math.round(row.confidence * 100)}%</span>
            </div>
          </div>

          <div>
            <Meter polarity={row.polarity} size={180} />
          </div>
        </div>

        {/* mini bar chart */}
        <div className="mt-6">
          <div className="text-xs text-slate-400 mb-2">Top-K (minh họa)</div>
          <div className="grid grid-cols-3 gap-3">
            {top.map((k) => (
              <div key={k.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">{k.label}</span>
                  <span className="text-slate-400 text-sm">{Math.round(k.score * 100)}%</span>
                </div>
                <div className="h-2 rounded bg-slate-700/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400" style={{ width: `${Math.min(100, Math.max(0, k.score * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============== Table =============== */
const Table: React.FC<{
  rows: BatchRow[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
  selectedId?: string | null;
}> = ({ rows, onRowClick, onDelete, selectedId }) => (
  <div className={cx(tokens.card, "overflow-hidden")}>
    <table className="w-full text-sm">
      <thead className="bg-white/5 border-b border-white/10 text-slate-300">
        <tr>
          <th className="text-left px-3 py-2 font-medium">#</th>
          <th className="text-left px-3 py-2 font-medium">Văn bản</th>
          <th className="text-left px-3 py-2 font-medium">Nhãn</th>
          <th className="text-left px-3 py-2 font-medium">Polarity</th>
          <th className="text-left px-3 py-2 font-medium">Confidence</th>
          <th className="text-left px-3 py-2 font-medium"> </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-6 text-center text-slate-400">No batch results yet.</td>
          </tr>
        ) : (
          rows.map((r, i) => (
            <tr
              key={r.id}
              onClick={() => onRowClick(r.id)}
              className={cx("hover:bg-white/5 cursor-pointer", selectedId === r.id && "bg-sky-700/10")}
              title="Click để xem chi tiết"
            >
              <td className="px-3 py-2">{i + 1}</td>
              <td className="px-3 py-2 truncate max-w-[560px]" title={r.text}>{r.text}</td>
              <td className="px-3 py-2">
                <span className={r.label === "Positive" ? "text-emerald-300" : r.label === "Negative" ? "text-rose-300" : "text-slate-300"}>
                  {r.label}
                </span>
              </td>
              <td className="px-3 py-2">{r.polarity.toFixed(2)}</td>
              <td className="px-3 py-2">{Math.round(r.confidence * 100)}%</td>
              <td className="px-3 py-2">
                <button
                  className="text-rose-400 hover:text-rose-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(r.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* =============== Main Page =============== */
export default function TextSentimentPage(): React.ReactElement {
  const [text, setText] = useState("");
  const [isBatch, setIsBatch] = useState(false); // giữ nguyên vị trí cũ
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    label: string;
    polarity: number;
    latency: number;
    top: { label: string; score: number }[];
    input: string;
  } | null>(null);

  const [rows, setRows] = useState<BatchRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  // Modal
  const [open, setOpen] = useState(false);
  const current = selectedId ? rows.find((r) => r.id === selectedId) ?? null : null;

  // placeholders động
  const placeholders = useMemo(
    () => [
      "Nhập văn bản hoặc dán bình luận/tweet…",
      "Ví dụ: Dịch vụ quá tuyệt vời, sẽ quay lại!",
      "Gợi ý: 'Sản phẩm giao chậm, mình hơi thất vọng.'",
    ],
    []
  );
  const [pi, setPi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPi((i) => (i + 1) % placeholders.length), 4500);
    return () => clearInterval(t);
  }, [placeholders.length]);

  const sample = () => setText("Dịch vụ rất tuyệt! Nhân viên thân thiện và mình sẽ quay lại nữa.");

  const analyze = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600));

    if (!isBatch) {
      const polarity = 0.55;
      const top = [
        { label: "Positive", score: 0.8 },
        { label: "Neutral", score: 0.15 },
        { label: "Negative", score: 0.05 },
      ];
      setResult({ label: "Positive", polarity, latency: 280, top, input: text });
      setSelectedId(null);
    } else {
      const lines = text.split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 200);
      const now = Date.now();
      const newRows: BatchRow[] = lines.map((t, i) => ({
        id: `${now}-${i}`,
        ts: now,
        text: t,
        label: i % 5 === 0 ? "Negative" : "Positive",
        polarity: i % 5 === 0 ? -0.3 : 0.6,
        confidence: i % 5 === 0 ? 0.65 : 0.86,
      }));
      setRows((prev) => [...prev, ...newRows]);
      setSelectedId(newRows[0]?.id ?? null);
    }
    setLoading(false);
  };

  const clearText = () => setText("");
  const clearAll = () => {
    setRows([]);
    setSelectedId(null);
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ rows }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text_sentiment_batch.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportCSV = () => {
    if (!rows.length) return;
    const header = ["index", "text", "label", "polarity", "confidence"];
    const body = rows.map((r, i) => [String(i + 1), r.text.replace(/"/g, '""'), r.label, String(r.polarity), String(r.confidence)]);
    const csv = [header, ...body].map((line) => line.map((c) => `"${c}"`).join(",")).join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text_sentiment_batch.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = rows.filter((r) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return r.text.toLowerCase().includes(q) || r.label.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Header động */}
      <AnimatedHeader
        // Có thể tuỳ chỉnh màu như sau:
        // bgColors={["#00C6FF","#0072FF","#6A00FF","#0072FF"]}
        // lineColors={["#00FFFF","#8A2BE2","#FF00FF"]}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className={tokens.card + " p-5 md:p-6"}>
          <div className="text-slate-200 font-semibold mb-2">Text Input</div>
          <div className="relative">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholders[pi]}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <div className="absolute bottom-2 right-3 text-xs text-slate-400">{text.length}/5000</div>
          </div>

          {/* giữ nguyên chỗ checkbox */}
          <label className="mt-3 flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
            <input type="checkbox" className="accent-sky-500" checked={isBatch} onChange={(e) => setIsBatch(e.target.checked)} />
            Batch by line
          </label>

          {/* 4 nút cùng hàng */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className={tokens.btn.primary} onClick={analyze} disabled={loading || !text}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
            <button className={tokens.btn.ghost} onClick={clearText}>Clear text</button>
            <button className={tokens.btn.subtle} onClick={sample}>Sample</button>
            <button className={tokens.btn.ghost} onClick={() => setText("Dịch vụ rất tệ. Tôi buồn và thất vọng!")}>
              Demo
            </button>
          </div>
        </div>

        {/* Result big card (ưu tiên dòng được chọn) */}
        <div className={tokens.card + " p-6 md:p-7"}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm uppercase tracking-widest text-slate-400">TEXT SENTIMENT</div>
              <div
                className={cx(
                  "mt-1 text-3xl md:text-4xl font-extrabold",
                  (current?.label ?? result?.label) === "Positive"
                    ? "text-emerald-300"
                    : (current?.label ?? result?.label) === "Negative"
                    ? "text-rose-300"
                    : "text-slate-200"
                )}
              >
                {current?.label ?? result?.label ?? "—"}
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">
              {result?.latency ?? 0} ms
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-7">
            <Meter polarity={current?.polarity ?? result?.polarity ?? 0} size={180} />

            <div className="space-y-3">
              <div className="text-xs text-slate-400">Top-K</div>
              <div className="grid grid-cols-2 gap-2">
                {(current ? [{ label: current.label, score: current.confidence }] : result?.top ?? []).map((k) => (
                  <div key={k.label} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-200">{k.label}</span>
                    <span className="text-slate-400 text-sm">{Math.round(k.score * 100)}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-slate-400 mb-1">Văn bản</div>
                <div className="text-slate-200">{current?.text ?? result?.input ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kết quả + search + export */}
      <div className="mt-9">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-sky-200">Kết quả phân tích</h3>
          <div className="flex items-center gap-3">
            <button className={tokens.btn.subtle} onClick={clearAll}>Clear all results</button>
            <button className={tokens.btn.ghost} onClick={exportJSON} disabled={!rows.length}>Export JSON</button>
            <button className={tokens.btn.ghost} onClick={exportCSV} disabled={!rows.length}>Export CSV</button>
          </div>
        </div>

        <div className="relative mb-3">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search text or label…"
            className="w-full pl-9 pr-9 rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-slate-200 focus:ring-2 focus:ring-sky-500/40 outline-none"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {filter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-7 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-slate-200"
              onClick={() => setFilter("")}
              title="Clear search"
            >
              x
            </button>
          )}
        </div>

        <Table
          rows={filtered}
          selectedId={selectedId}
          onRowClick={(id) => {
            setSelectedId(id);
            setOpen(true); // mở modal chi tiết
          }}
          onDelete={(id) => {
            setRows((prev) => prev.filter((r) => r.id !== id));
            if (selectedId === id) setSelectedId(null);
          }}
        />
      </div>

      {/* Modal chi tiết với gauge + top-K mini bars */}
      <DetailModal open={open} onClose={() => setOpen(false)} row={current} />
    </div>
  );
}
