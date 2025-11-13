// import React, { useState } from "react";

// // ----- Utility -----
// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// const tokens = {
//     card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl p-6",
//     title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
//     btn: {
//         primary:
//             "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
//         ghost:
//             "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
//         icon:
//             "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
//     },
// };

// const ResultCard = ({ result }: { result: any }) => {
//     if (!result) return null;

//     const getEmotionIcon = (label: string) => {
//         switch (label.toLowerCase()) {
//             case 'happy':
//             case 'positive':
//                 return (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
//                         <circle cx="12" cy="12" r="10" />
//                         <path d="M8 14s1.5 2 4 2 4-2 4-2" />
//                         <line x1="9" y1="9" x2="9.01" y2="9" />
//                         <line x1="15" y1="9" x2="15.01" y2="9" />
//                     </svg>
//                 );
//             case 'neutral':
//                 return (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                         <circle cx="12" cy="12" r="10" />
//                         <line x1="8" y1="15" x2="16" y2="15" />
//                         <line x1="9" y1="9" x2="9.01" y2="9" />
//                         <line x1="15" y1="9" x2="15.01" y2="9" />
//                     </svg>
//                 );
//             case 'sad':
//             case 'negative':
//                 return (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
//                         <circle cx="12" cy="12" r="10" />
//                         <path d="M8 15s1.5 -2 4 -2 4 2 4 2" />
//                         <line x1="9" y1="9" x2="9.01" y2="9" />
//                         <line x1="15" y1="9" x2="15.01" y2="9" />
//                     </svg>
//                 );
//             default:
//                 return (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
//                         <circle cx="12" cy="12" r="10" />
//                         <line x1="9" y1="9" x2="9.01" y2="9" />
//                         <line x1="15" y1="9" x2="15.01" y2="9" />
//                     </svg>
//                 );
//         }
//     };

//     const getEmotionColor = (label: string) => {
//         switch (label.toLowerCase()) {
//             case 'happy':
//             case 'positive':
//                 return 'text-emerald-300';
//             case 'neutral':
//                 return 'text-sky-300';
//             case 'sad':
//             case 'negative':
//                 return 'text-rose-300';
//             default:
//                 return 'text-violet-300';
//         }
//     };

//     return (
//         <div className={cn(tokens.card, "mt-6")}>
//             <div className="text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                     <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
//                     <path d="M7 14.25c2 2.25 4 2.25 6 0" />
//                     <path d="M7 9h.01" />
//                     <path d="M17 9h.01" />
//                 </svg>
//                 Fusion Results
//             </div>

//             <div className="mt-3 grid md:grid-cols-2 gap-4">
//                 {Object.entries(result.modalities).map(([mod, val]: any) => (
//                     <div key={mod} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors">
//                         <div className="flex items-center gap-2">
//                             <span className="text-slate-400 text-sm capitalize">{mod}</span>
//                             <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
//                                 {Math.round(val.confidence * 100)}%
//                             </span>
//                         </div>
//                         <div className="mt-2 flex items-center gap-2">
//                             {getEmotionIcon(val.label)}
//                             <span className={cn("text-xl font-semibold", getEmotionColor(val.label))}>{val.label}</span>
//                         </div>
//                         <div className="mt-2 h-1.5 rounded-full bg-slate-950/50 border border-white/5 overflow-hidden">
//                             <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.round(val.confidence * 100)}%` }} />
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-white/5">
//                 <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
//                         <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//                         <circle cx="12" cy="12" r="3" />
//                     </svg>
//                     Fused Result
//                 </div>
//                 <div className="mt-2 flex items-center gap-3">
//                     {getEmotionIcon(result.fusion.label)}
//                     <span className={cn("text-2xl font-semibold", getEmotionColor(result.fusion.label))}>{result.fusion.label}</span>
//                     <span className="text-sm px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 border border-white/5 ml-auto">
//                         {Math.round(result.fusion.confidence * 100)}% confidence
//                     </span>
//                 </div>
//                 <div className="mt-3 h-2 rounded-full bg-slate-950/50 border border-white/5 overflow-hidden">
//                     <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${Math.round(result.fusion.confidence * 100)}%` }} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FusionSettings = ({
//     strategy,
//     setStrategy,
//     weights,
//     setWeights,
//     temperature,
//     setTemperature,
//     result
// }: {
//     strategy: string;
//     setStrategy: (s: string) => void;
//     weights: number[];
//     setWeights: (w: number[]) => void;
//     temperature: number;
//     setTemperature: (t: number) => void;
//     result: any;
// }) => {
//     return (
//         <div className={tokens.card}>
//             <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                     <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//                     <circle cx="12" cy="12" r="3" />
//                 </svg>
//                 Fusion Settings
//             </h2>
//             <div className="space-y-6">
//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
//                     <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-7H4a2 2 0 0 0-2 2v17Z" />
//                             <path d="M15 8V1" />
//                         </svg>
//                         Strategy
//                     </div>
//                     <div className="grid grid-cols-3 gap-2">
//                         {['Weighted', 'Stacking', 'Rule-based'].map(s => (
//                             <label key={s} className={cn(
//                                 "flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm border whitespace-nowrap",
//                                 strategy === s
//                                     ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
//                                     : "border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-300"
//                             )}>
//                                 <input
//                                     type="radio"
//                                     name="strategy"
//                                     checked={strategy === s}
//                                     onChange={() => {
//                                         setStrategy(s);
//                                         // Reset weights based on strategy
//                                         if (s === 'Weighted') {
//                                             setWeights([0.33, 0.33, 0.34]);
//                                         } else if (s === 'Stacking') {
//                                             setWeights([0.5, 0.3, 0.2]);
//                                         } else {
//                                             setWeights([0.4, 0.4, 0.2]);
//                                         }
//                                     }}
//                                     className="hidden"
//                                 />
//                                 <span>{s}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
//                     <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
//                         </svg>
//                         Weights
//                     </div>
//                     {['Text', 'Audio', 'Vision'].map((mod, i) => (
//                         <div key={mod} className="flex items-center gap-3 mb-3 bg-slate-950/30 p-3 rounded-lg border border-white/5">
//                             <span className="w-16 text-slate-300 text-sm font-medium">{mod}</span>
//                             <input
//                                 type="range"
//                                 min="0"
//                                 max="1"
//                                 step="0.01"
//                                 value={weights[i]}
//                                 onChange={(e) => {
//                                     const newW = [...weights];
//                                     newW[i] = parseFloat(e.target.value);
//                                     setWeights(newW);
//                                 }}
//                                 className="flex-1 accent-sky-500"
//                             />
//                             <span className="text-slate-300 text-sm w-12 text-right tabular-nums">{weights[i].toFixed(2)}</span>
//                         </div>
//                     ))}
//                     <div className="flex gap-2 mt-4">
//                         <button
//                             className={cn(tokens.btn.ghost, "text-sm px-3 h-9 whitespace-nowrap")}
//                             onClick={() => {
//                                 // Normalize weights to sum to 1
//                                 const sum = weights.reduce((a: number, b: number) => a + b, 0);
//                                 if (sum === 0) return;
//                                 const normalizedWeights = weights.map((w: number) => Number((w / sum).toFixed(2)));
//                                 // Ensure exact sum of 1 by adjusting last weight
//                                 const currentSum = normalizedWeights.reduce((a: number, b: number) => a + b, 0);
//                                 if (currentSum !== 1) {
//                                     normalizedWeights[normalizedWeights.length - 1] = Number((normalizedWeights[normalizedWeights.length - 1] + (1 - currentSum)).toFixed(2));
//                                 }
//                                 setWeights(normalizedWeights);
//                             }}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//                                 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//                                 <path d="M3.29 7 12 12l8.71-5" />
//                                 <path d="M12 22V12" />
//                             </svg>
//                             Normalize (sum=1)
//                         </button>
//                         <button
//                             className={cn(tokens.btn.ghost, "text-sm px-3 h-9 whitespace-nowrap")}
//                             onClick={() => {
//                                 // Set weights based on the confidence scores of each modality
//                                 const confidenceScores = {
//                                     text: result?.modalities?.text?.confidence || 0.33,
//                                     audio: result?.modalities?.audio?.confidence || 0.33,
//                                     vision: result?.modalities?.vision?.confidence || 0.34
//                                 } as const;

//                                 const total = Object.values(confidenceScores).reduce((a: number, b: number) => a + b, 0);
//                                 const newWeights = [
//                                     Number((confidenceScores.text / total).toFixed(2)),
//                                     Number((confidenceScores.audio / total).toFixed(2)),
//                                     Number((confidenceScores.vision / total).toFixed(2))
//                                 ];

//                                 // Ensure sum is exactly 1
//                                 const weightSum = newWeights.reduce((a: number, b: number) => a + b, 0);
//                                 if (weightSum !== 1) {
//                                     newWeights[newWeights.length - 1] = Number((newWeights[newWeights.length - 1] + (1 - weightSum)).toFixed(2));
//                                 }

//                                 setWeights(newWeights);
//                             }}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//                                 <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
//                             </svg>
//                             Auto from confidence
//                         </button>
//                     </div>
//                 </div>

//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
//                     <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
//                         </svg>
//                         Temperature
//                     </div>
//                     <div className="flex gap-3 items-center">
//                         <input
//                             type="number"
//                             min="0.1"
//                             step="0.1"
//                             value={temperature}
//                             onChange={(e) => setTemperature(parseFloat(e.target.value))}
//                             className="w-24 bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
//                         />
//                         <span className="text-sm text-slate-400">Higher = more random</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InputHub = ({ text, setText, audioFile, setAudioFile, imageFile, setImageFile }: any) => {
//     return (
//         <div className={tokens.card}>
//             <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                     <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24" />
//                     <path d="M21 3v4h-4" />
//                 </svg>
//                 Input Hub
//             </h2>
//             <div className="grid gap-4">
//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
//                     <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 1 1 2.5 8.242" />
//                             <path d="M12 12v9" />
//                             <path d="m8 17 4 4 4-4" />
//                         </svg>
//                         Text Analysis
//                     </div>
//                     <textarea
//                         placeholder="Paste text or use existing..."
//                         className="w-full rounded-lg bg-slate-950/50 border border-white/5 px-3 py-2.5 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-600"
//                         rows={3}
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                     />
//                 </div>

//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
//                     <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="M12 2v20" />
//                             <rect x="4" y="6" width="16" height="16" rx="2" />
//                             <path d="M8 18v-7" />
//                             <path d="M12 18v-3" />
//                             <path d="M16 18v-5" />
//                         </svg>
//                         Audio Input
//                     </div>
//                     <label className="block w-full rounded-lg border-2 border-dashed border-slate-700/60 hover:border-sky-500/30 transition-colors p-4 text-center cursor-pointer group-hover:bg-slate-950/30">
//                         <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
//                         <div className="text-slate-400 text-sm">Drop audio file or click to browse</div>
//                         {audioFile && (
//                             <div className="mt-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm inline-flex items-center gap-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
//                                     <circle cx="17" cy="7" r="5" />
//                                 </svg>
//                                 {audioFile.name}
//                             </div>
//                         )}
//                     </label>
//                 </div>

//                 <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
//                     <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                             <path d="M15 8h.01" />
//                             <rect width="16" height="16" x="4" y="4" rx="3" />
//                             <path d="M4 15l4-4a3 5 0 0 1 3 0l5 5" />
//                             <path d="M14 14l1-1a3 5 0 0 1 3 0l2 2" />
//                         </svg>
//                         Vision Input
//                     </div>
//                     <label className="block w-full rounded-lg border-2 border-dashed border-slate-700/60 hover:border-sky-500/30 transition-colors p-4 text-center cursor-pointer group-hover:bg-slate-950/30">
//                         <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
//                         <div className="text-slate-400 text-sm">Drop image or click to browse</div>
//                         {imageFile && (
//                             <div className="mt-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm inline-flex items-center gap-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M15 8h.01" />
//                                     <rect width="16" height="16" x="4" y="4" rx="3" />
//                                 </svg>
//                                 {imageFile.name}
//                             </div>
//                         )}
//                     </label>
//                 </div>
//             </div>
//         </div>
//     );
// };

// interface ModalityResult {
//     confidence: number;
//     label: string;
// }

// interface FusionResult {
//     modalities: {
//         text?: ModalityResult;
//         audio?: ModalityResult;
//         vision?: ModalityResult;
//     };
//     fusion: ModalityResult;
// }

// export default function FusedModelPage() {
//     const [text, setText] = useState<string>("");
//     const [audioFile, setAudioFile] = useState<File | null>(null);
//     const [imageFile, setImageFile] = useState<File | null>(null);

//     const [strategy, setStrategy] = useState<string>('Weighted');
//     const [weights, setWeights] = useState<number[]>([0.33, 0.33, 0.34]);
//     const [temperature, setTemperature] = useState<number>(1.0);

//     const [result, setResult] = useState<FusionResult | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);

//     const runFusion = async () => {
//         setLoading(true);
//         await new Promise(r => setTimeout(r, 600));
//         setResult({
//             modalities: {
//                 text: { label: 'Positive', confidence: 0.7 },
//                 audio: { label: 'Neutral', confidence: 0.6 },
//                 vision: { label: 'Happy', confidence: 0.8 },
//             },
//             fusion: { label: 'Happy (Overall)', confidence: 0.85 },
//         });
//         setLoading(false);
//     };

//     const clearAll = () => {
//         // Reset all state to initial values
//         setText("");
//         setAudioFile(null);
//         setImageFile(null);
//         setStrategy('Weighted');
//         setWeights([0.33, 0.33, 0.34]);
//         setTemperature(1.0);
//         setResult(null);
//         setLoading(false);

//         // Reload the page to clear any cached data
//         window.location.reload();
//     };

//     return (
//         <div className="max-w-7xl mx-auto p-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//                 <h1 className={tokens.title}>Fusion Model</h1>
//                 <button
//                     className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1"
//                     onClick={clearAll}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M3 12h18" />
//                         <path d="M12 3v18" />
//                     </svg>
//                     Reset All
//                 </button>
//             </div>

//             {/* Top Grid - Input Hub and Fusion Settings */}
//             <div className="grid lg:grid-cols-2 gap-6 mb-6">
//                 {/* Left Column - Input Hub */}
//                 <InputHub
//                     text={text}
//                     setText={setText}
//                     audioFile={audioFile}
//                     setAudioFile={setAudioFile}
//                     imageFile={imageFile}
//                     setImageFile={setImageFile}
//                 />

//                 {/* Right Column - Fusion Settings */}
//                 <FusionSettings
//                     strategy={strategy}
//                     setStrategy={setStrategy}
//                     weights={weights}
//                     setWeights={setWeights}
//                     temperature={temperature}
//                     setTemperature={setTemperature}
//                     result={result || { modalities: {}, fusion: { confidence: 0, label: '' } }}
//                 />
//             </div>

//             {/* Bottom Section - Results Card */}
//             <div className={tokens.card}>
//                 <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                         <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
//                         <path d="M7 14.25c2 2.25 4 2.25 6 0" />
//                         <path d="M7 9h.01" />
//                         <path d="M17 9h.01" />
//                     </svg>
//                     Results
//                 </h2>

//                 <div className="space-y-4">
//                     <button
//                         className={cn(
//                             tokens.btn.primary,
//                             "w-full flex items-center justify-center gap-2",
//                             loading && "bg-gradient-to-r from-sky-500/50 to-indigo-500/50"
//                         )}
//                         onClick={runFusion}
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <>
//                                 <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//                                 </svg>
//                                 Running Fusion...
//                             </>
//                         ) : (
//                             <>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//                                     <circle cx="12" cy="12" r="3" />
//                                 </svg>
//                                 Run Fusion
//                             </>
//                         )}
//                     </button>

//                     <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
//                         <div className="text-sm text-slate-300 flex items-center gap-2">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
//                                 <circle cx="12" cy="12" r="10" />
//                                 <line x1="12" y1="16" x2="12" y2="12" />
//                                 <line x1="12" y1="8" x2="12.01" y2="8" />
//                             </svg>
//                             Tips
//                         </div>
//                         <ul className="mt-2 space-y-1 text-sm text-slate-400">
//                             <li>• Choose one or more input modalities</li>
//                             <li>• Adjust fusion weights as needed</li>
//                             <li>• Higher temperature = more random</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {/* Results Card */}
//             {result && <ResultCard result={result} />}
//         </div>
//     );
// }











// src/pages/FusedModel.tsx
import React, { useMemo, useState } from "react";

/* ================= utils & tokens ================= */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

const tokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl animate-[fadeIn_.42s_ease] will-change-transform",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  btn: {
    primary:
      "inline-flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
    subtle:
      "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
    icon:
      "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
    tab: "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
  },
};

/* ========= keyframes & small viz components ========= */
const KEYFRAMES = `
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes pulseG{0%{opacity:.7}50%{opacity:1}100%{opacity:.7}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
`;

/** Animated linear bar */
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

/** Animated ring with conic-gradient */
const Ring = ({
  value,
  size = 132,
}: {
  value: number;
  size?: number;
}) => {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  const ring = `conic-gradient(#22d3ee ${pct * 3.6}deg, #0b1220 0)`;
  return (
    <div
      className="grid place-items-center"
      style={{ width: size, height: size }}
    >
      <div
        className="rounded-full p-2"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(120deg,#22d3ee33,#6366f133)",
          animation: "pulseG 2.2s ease-in-out infinite",
        }}
      >
        <div
          className="rounded-full grid place-items-center"
          style={{
            width: "100%",
            height: "100%",
            background: ring,
          }}
        >
          <div className="rounded-full bg-slate-900/80 border border-white/10 w-[78%] h-[78%] grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-sky-200">
                {pct}%
              </div>
              <div className="text-xs text-slate-400">confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= types ================= */
type Modality = "text" | "audio" | "vision";

type ModalityResult = {
  label: string;
  confidence: number; // 0..1
};

type FusionResult = {
  modalities: Partial<Record<Modality, ModalityResult>>;
  fusion: ModalityResult & { latencyMs: number };
};

type RowItem = {
  id: string;
  source: string;
  label: string;
  confidence: number; // %
  latency: number; // ms
  time: string;
  raw: FusionResult;
};

/* ================= helpers ================= */
const nowTime = () =>
  new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();

/* ================= modal ================= */
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ open, onClose, children, title }) =>
  !open ? null : (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={cx(tokens.card, "w-full max-w-3xl p-6")}>
          <div className="flex items-center justify-between">
            <div className="text-sky-100 text-lg font-semibold">
              {title ?? "Details"}
            </div>
            <button className={tokens.btn.subtle} onClick={onClose}>
              Close
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );

/* ================= main ================= */
export default function FusedModel(): React.ReactElement {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  // UI tabs for the Input Hub (upload chỉ để minh hoạ)
  const [tab, setTab] = useState<"text" | "audio" | "vision">("text");

  // results + table
  const [result, setResult] = useState<FusionResult | null>(null);
  const [rows, setRows] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // modal
  const [activeRow, setActiveRow] = useState<RowItem | null>(null);

  // filtered rows
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q)
    );
  }, [rows, query]);

  /* ============ mock analyze / fusion ============ */
  const analyze = async () => {
    setLoading(true);
    // fake latency
    await new Promise((r) => setTimeout(r, 650));

    // MOCKED – dựa trên có input nào
    const mods: Partial<Record<Modality, ModalityResult>> = {};
    if (text) mods.text = { label: "Positive", confidence: 0.7 };
    if (audio) mods.audio = { label: "Neutral", confidence: 0.6 };
    if (image) mods.vision = { label: "Happy", confidence: 0.8 };

    // nếu chưa có gì, vẫn trả về neutral demo
    if (!text && !audio && !image) {
      mods.text = { label: "Neutral", confidence: 0.5 };
    }

    // gộp – demo: lấy max theo confidence
    const pool = Object.values(mods);
    const best =
      pool.length > 0
        ? pool.reduce((a, b) => (a.confidence >= b.confidence ? a : b))
        : { label: "Neutral", confidence: 0.5 };

    const latency = 620 + Math.round(Math.random() * 60);

    const fused: FusionResult = {
      modalities: mods,
      fusion: { label: `${best.label} (Overall)`, confidence: 0.85, latencyMs: latency },
    };

    setResult(fused);

    // add to table
    const srcParts = [];
    if (text) srcParts.push("Text");
    if (audio) srcParts.push(`Audio • ${audio.name}`);
    if (image) srcParts.push(`Image • ${image.name}`);
    const source = srcParts.join(" + ") || "Empty inputs";

    const row: RowItem = {
      id: crypto.randomUUID(),
      source,
      label: fused.fusion.label,
      confidence: Math.round(fused.fusion.confidence * 100),
      latency: latency,
      time: nowTime(),
      raw: fused,
    };
    setRows((r) => [row, ...r]);
    setLoading(false);
  };

  const reset = () => {
    setText("");
    setAudio(null);
    setImage(null);
    setResult(null);
  };

  const clearAllRows = () => setRows([]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fusion-results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = "id,source,label,confidence,latency,time\n";
    const body = rows
      .map(
        (r) =>
          `${r.id},"${r.source.replaceAll('"', '""')}",${r.label},${r.confidence},${r.latency},${r.time}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fusion-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ==================== render ==================== */
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <style>{KEYFRAMES}</style>

      {/* Glow header (giống phong cách Audio/Text) */}
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
                  d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
                Fusion Model
              </h1>
              <p className="text-slate-200/85">
                Kết hợp Text · Audio · Vision — demo UI có hiệu ứng động.
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
            className="absolute top-0 left-[-35%] h-[3px] w-[35%] rounded-full will-change-left"
            style={{
              background: "linear-gradient(90deg,#22d3ee,#a855f7,#22d3ee)",
              animation: "sweepX 2.8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* GRID 4 KHUNG */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* KHUNG 1: Input Hub (trái trên) */}
        <div className={cx(tokens.card, "p-6")}>
          <div className="flex items-center gap-2 mb-4">
            <button
              className={tokens.btn.tab}
              data-active={tab === "text"}
              onClick={() => setTab("text")}
            >
              Text
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "audio"}
              onClick={() => setTab("audio")}
            >
              Audio
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "vision"}
              onClick={() => setTab("vision")}
            >
              Vision
            </button>
          </div>

          {tab === "text" && (
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Text Analysis</div>
              <textarea
                rows={6}
                className="w-full rounded-xl bg-slate-900/50 border border-white/10 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-600"
                placeholder="Paste or type your text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}

          {tab === "audio" && (
            <label className="block rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-400/60 transition-colors p-6 text-center cursor-pointer bg-slate-900/40">
              <div className="text-sky-200 font-medium">
                Drop audio here or click to browse
              </div>
              <div className="mt-1 text-sm text-slate-400">up to 25MB</div>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
              />
              {audio && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path
                      d="M12 2v20M4 6v12M20 8v8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {audio.name}
                </div>
              )}
            </label>
          )}

          {tab === "vision" && (
            <label className="block rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-400/60 transition-colors p-6 text-center cursor-pointer bg-slate-900/40">
              <div className="text-sky-200 font-medium">
                Drop image here or click to browse
              </div>
              <div className="mt-1 text-sm text-slate-400">PNG/JPG up to 25MB</div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {image && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M8 16l3-3 4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {image.name}
                </div>
              )}
            </label>
          )}
        </div>

        {/* KHUNG 2: Preview (phải trên) */}
        <div className={cx(tokens.card, "p-6")}>
          <div className="text-sm text-slate-400 mb-2">Preview</div>
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 min-h-[260px] grid place-items-center">
            {!image && !audio && !text && (
              <div className="text-slate-500">Upload text/audio/image để xem preview…</div>
            )}
            {!!image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="max-h-[420px] object-contain"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
            )}
            {!!audio && !image && (
              <audio
                controls
                src={URL.createObjectURL(audio)}
                className="w-full max-w-xl"
                onLoadedData={(e) =>
                  URL.revokeObjectURL((e.target as HTMLAudioElement).src!)
                }
              />
            )}
            {!!text && !audio && !image && (
              <div className="p-4 text-slate-200 text-center">{text}</div>
            )}
          </div>
        </div>

        {/* KHUNG 3: dưới-trái – Actions + Tips (theo yêu cầu) */}
        <div className={cx(tokens.card, "p-6")}>
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-center">
            <div className="flex gap-3">
              <button
                className={tokens.btn.primary}
                onClick={analyze}
                disabled={loading}
                title="Run fusion"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-0.5 mr-1 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 12a9 9 0 1 1-6.219-8.56"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>Analyze</>
                )}
              </button>
              <button className={tokens.btn.ghost} onClick={reset}>
                Reset
              </button>
            </div>
            <div className="text-xs text-slate-400">
              Latency:{" "}
              <span className="px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40">
                {result ? `${result.fusion.latencyMs} ms` : "—"}
              </span>
            </div>
          </div>

          {/* panel lấp đầy – Tips + info */}
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-slate-900/60 border border-white/10">
              <div className="text-slate-300 font-medium mb-2">Tips</div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Chọn 1 hoặc nhiều modality (Text/Audio/Vision).</li>
                <li>• Dữ liệu càng rõ chất lượng càng tốt (âm lượng/ánh sáng).</li>
                <li>• Kết quả ở đây là demo UI (không phải server thật).</li>
              </ul>
            </div>
            <div className="rounded-xl p-4 bg-slate-900/60 border border-white/10">
              <div className="text-slate-300 font-medium mb-2">
                Current Inputs
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div>Text: {text ? "✅" : "—"}</div>
                <div>Audio: {audio ? audio.name : "—"}</div>
                <div>Image: {image ? image.name : "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* KHUNG 4: dưới-phải – Fusion Results, gọn & đẹp */}
        <div className={cx(tokens.card, "p-6")}>
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>Text</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
                    {result?.modalities.text
                      ? Math.round(result.modalities.text.confidence * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-emerald-300 font-semibold">
                  {result?.modalities.text?.label ?? "—"}
                </div>
                <Bar value={result?.modalities.text?.confidence ?? 0} />
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>Audio</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
                    {result?.modalities.audio
                      ? Math.round(result.modalities.audio.confidence * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-sky-300 font-semibold">
                  {result?.modalities.audio?.label ?? "—"}
                </div>
                <Bar value={result?.modalities.audio?.confidence ?? 0} />
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>Vision</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
                    {result?.modalities.vision
                      ? Math.round(result.modalities.vision.confidence * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-violet-300 font-semibold">
                  {result?.modalities.vision?.label ?? "—"}
                </div>
                <Bar value={result?.modalities.vision?.confidence ?? 0} />
              </div>
            </div>

            <div className="shrink-0">
              <Ring value={result?.fusion.confidence ?? 0} />
            </div>
          </div>

          <div className="mt-5">
            <div className="text-slate-300 text-sm mb-1">Fused Result</div>
            <div className="text-2xl font-semibold text-sky-100">
              {result?.fusion.label ?? "—"}
            </div>
            <div className="mt-2">
              <Bar value={result?.fusion.confidence ?? 0} />
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG KẾT QUẢ */}
      <div className={cx(tokens.card, "mt-8 p-6")}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-xl font-semibold text-sky-100 flex-1">
            Analysis Results
          </div>

          {/* Search kéo dài sát các nút */}
          <div className="flex-1">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
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

          <button className={tokens.btn.subtle} onClick={clearAllRows}>
            Clear all
          </button>
          <button className={tokens.btn.subtle} onClick={exportJSON}>
            Export JSON
          </button>
          <button className={tokens.btn.subtle} onClick={exportCSV}>
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
                  <td className="px-3 py-2 text-slate-400">{rows.length - idx}</td>
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

      {/* MODAL chi tiết dòng */}
      <Modal
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

            <div className="grid place-items-center">
              <Ring value={activeRow.confidence / 100} size={180} />
            </div>

            <div className="md:col-span-2">
              <div className="text-slate-300 text-sm mb-2">Modality breakdown</div>
              <div className="grid md:grid-cols-3 gap-3">
                {(["text", "audio", "vision"] as Modality[]).map((m) => (
                  <div
                    key={m}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/10"
                  >
                    <div className="text-slate-400 text-xs capitalize">{m}</div>
                    <div className="text-slate-100 font-medium">
                      {activeRow.raw.modalities[m]?.label ?? "—"}
                    </div>
                    <div className="mt-1">
                      <Bar
                        value={
                          activeRow.raw.modalities[m]?.confidence ?? 0
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
