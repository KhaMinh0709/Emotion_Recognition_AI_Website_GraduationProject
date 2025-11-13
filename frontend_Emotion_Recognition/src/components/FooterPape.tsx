// import React from "react";
// import { Bot, Github, Mail, Heart, Linkedin } from "lucide-react";

// /* ================= DATA ================= */
// const techs = [
//   {
//     name: "React",
//     url: "https://react.dev",
//     Logo: () => (
//       <svg viewBox="0 0 128 128" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="64" cy="64" r="10" fill="currentColor" />
//         <g stroke="currentColor" strokeWidth="6">
//           <ellipse cx="64" cy="64" rx="58" ry="24"/>
//           <ellipse cx="64" cy="64" rx="58" ry="24" transform="rotate(60 64 64)"/>
//           <ellipse cx="64" cy="64" rx="58" ry="24" transform="rotate(120 64 64)"/>
//         </g>
//       </svg>
//     ),
//   },
//   {
//     name: "Vite",
//     url: "https://vitejs.dev/",
//     Logo: () => (
//       <svg viewBox="0 0 256 257" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
//         <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor"/></linearGradient></defs>
//         <path d="M3 40l125 213L253 40 129 12 3 40z" fill="none" stroke="currentColor" strokeWidth="14"/>
//         <path d="M129 30l74 14-74 146L55 44l74-14z" fill="currentColor" opacity=".2"/>
//       </svg>
//     ),
//   },
//   {
//     name: "TypeScript",
//     url: "https://www.typescriptlang.org/",
//     Logo: () => (
//       <svg viewBox="0 0 120 120" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
//         <rect width="120" height="120" rx="14" fill="currentColor" opacity=".25"/>
//         <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace" fontWeight="700" fontSize="52" fill="currentColor">TS</text>
//       </svg>
//     ),
//   },
//   {
//     name: "TailwindCSS",
//     url: "https://tailwindcss.com/",
//     Logo: () => (
//       <svg viewBox="0 0 128 80" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
//         <path d="M64 12c-16 0-24 8-28 16 6-4 12-6 18-6 9 0 15 5 20 12 5 6 11 10 20 10 6 0 12-2 18-6-4 8-12 16-28 16-9 0-15-5-20-12-5-6-11-10-20-10-6 0-12 2-18 6 4-8 12-16 28-16z"/>
//       </svg>
//     ),
//   },
//   {
//     name: "HTML5",
//     url: "https://developer.mozilla.org/docs/Web/HTML",
//     Logo: () => (
//       <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
//         <path d="M19 5l9 101 36 10 36-10 9-101H19zm77 29H47l2 17h43l-4 44-24 7-24-7-2-22h14l1 11 11 3 11-3 2-21H41l-4-45h63l-4 16z"/>
//       </svg>
//     ),
//   },
//   {
//     name: "CSS3",
//     url: "https://developer.mozilla.org/docs/Web/CSS",
//     Logo: () => (
//       <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
//         <path d="M19 5l9 101 36 10 36-10 9-101H19zm69 86l-24 7-24-7-1-14h14l1 6 10 3 11-3 1-11H41l-2-17h49l-1 11H54l1 6h33l-1 16z"/>
//       </svg>
//     ),
//   },
//   {
//     name: "JavaScript",
//     url: "https://developer.mozilla.org/docs/Web/JavaScript",
//     Logo: () => (
//       <svg viewBox="0 0 120 120" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
//         <rect width="120" height="120" rx="12" fill="currentColor" opacity=".25"/>
//         <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace" fontWeight="700" fontSize="48" fill="currentColor">JS</text>
//       </svg>
//     ),
//   },
//   {
//     name: "Git",
//     url: "https://git-scm.com/",
//     Logo: () => (
//       <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
//         <path d="M9 64l32-32 48 48-32 32L9 64zm58-10l7 7-10 10 7 7-8 8-14-14 8-8 10 10 10-10-10-10z"/>
//       </svg>
//     ),
//   },
//   {
//     name: "GitHub",
//     url: "https://github.com/",
//     Logo: () => (
//       <svg viewBox="0 0 16 16" className="w-6 h-6" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 .2a8 8 0 00-2.53 15.6c.4.07.55-.17.55-.38v-1.3c-2.25.49-2.72-1.09-2.72-1.09-.37-.93-.9-1.18-.9-1.18-.74-.51.06-.5.06-.5.83.06 1.27.86 1.27.86.73 1.25 1.91.89 2.38.68.07-.53.29-.89.52-1.1-1.8-.2-3.69-.9-3.69-4a3.1 3.1 0 01.83-2.16 2.9 2.9 0 01.08-2.13s.68-.22 2.22.82a7.7 7.7 0 012.03-.27c.69 0 1.39.09 2.04.27 1.54-1.04 2.22-.82 2.22-.82.3.77.11 1.65.05 1.82.52.58.83 1.33.83 2.16 0 3.11-1.9 3.8-3.71 4 .3.26.56.78.56 1.58v2.34c0 .21.15.46.55.38A8 8 0 008 .2z"/></svg>
//     ),
//   },
// ];

// const FooterPape: React.FC = () => {
//   return (
//     <footer className="relative text-gray-300 border-t border-purple-800/30 overflow-hidden">
//       {/* ===== Background remains (aurora + stars) ===== */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1e] via-[#120a2f] to-[#1a1042]" />
//         <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-56 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-sky-400/20 blur-3xl animate-aurora" />
//         <div className="absolute top-10 right-0 w-[70%] h-40 bg-gradient-to-l from-violet-500/20 via-blue-500/20 to-emerald-400/20 blur-2xl animate-aurora-delayed" />
//         {Array.from({ length: 36 }).map((_, i) => (
//           <span
//             key={i}
//             className="absolute w-1 h-1 bg-white/25 rounded-full animate-twinkle"
//             style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${i * 0.18}s` }}
//           />
//         ))}
//       </div>

//       {/* ===== CONTENT GRID ===== */}
//       <div className="relative container mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-3 gap-10 text-center lg:text-left">
//         {/* --- PROJECT (narrower) --- */}
//         <section className="fade-in">
//           <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">VỀ DỰ ÁN</h3>
//           <div className="space-y-3 max-w-[54ch] mx-auto lg:mx-0 text-left">
//             <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
//               Emotion AI Analyzer – Nhận diện cảm xúc đa phương thức <span className="text-gray-300">(Văn bản + Âm thanh + Video)</span>
//             </p>
//             <p className="text-sm sm:text-[15px] text-gray-300/95 leading-7 text-justify">
//               Dự án <b>Emotion AI Analyzer</b> là một <b>Luận văn Tốt nghiệp</b> ngành <b>Khoa học máy tính</b>, tập trung vào việc phát triển một hệ thống toàn diện có khả năng phân tích và nhận diện cảm xúc của người dùng từ dữ liệu <b>đa phương thức</b>, bao gồm <b>văn bản</b>, <b>âm thanh</b>, và <b>video</b>.
//             </p>
//           </div>
//         </section>

//         {/* --- TEAM (new animated cards) --- */}
//         <section className="fade-in delay-1">
//           <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">NHÓM PHÁT TRIỂN</h3>

//           {/* Group badges */}
//           <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 animate-float-slow">
//             {[
//               { text: "Nhóm 25 • Lớp DHKHMT17B" },
//               { text: "Khoa CNTT • Chuyên ngành: Khoa học máy tính" },
//               { text: "Trường ĐH Công nghiệp TP.HCM • Khóa: 2021 – 2025" },
//               ].map((item, i) => (
//                 <span
//                   key={i}
//                   className="px-3 py-1 text-xs bg-gradient-to-r 
//                             from-fuchsia-600/30 via-purple-600/30 
//                             to-sky-500/30 rounded-full border 
//                             border-purple-500/30 shadow-inner 
//                             text-white animate-tag"
//                   style={{ animationDelay: `${i * 0.2}s` }}
//                 >
//                 {item.text}
//                 </span>
//             ))}
//           </div>

//           {/* members */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0">
//             {[{name:"Trần Minh Châu", id:"MSSV: 21070211"}, {name:"Nguyễn Khả Minh", id:"MSSV: 21124661"}].map((m, i) => (
//               <div key={m.name} className="relative rounded-2xl p-4 bg-white/5 border border-white/10 overflow-hidden">
//                 {/* animated gradient border */}
//                 <div className="pointer-events-none absolute inset-0 rounded-2xl">
//                   <div className="absolute -inset-[2px] rounded-2xl bg-[conic-gradient(at_0%_0%,theme(colors.fuchsia.500/.35),theme(colors.purple.500/.35),theme(colors.sky.400/.35),transparent)] animate-border"/>
//                 </div>
//                 <div className="relative z-10">
//                   <p className="text-white font-semibold">{m.name}</p>
//                   <p className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-200 border border-emerald-600/40">{m.id}</p>
//                 </div>
//                 {/* auto float shimmer */}
//                 <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-sky-400/20 blur-2xl animate-float"/>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- TECHNOLOGIES (logos + links) --- */}
//         <section className="fade-in delay-2">
//           <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">CÔNG NGHỆ PHÁT TRIỂN</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {techs.map((t, idx) => (
//               <a
//                 key={t.name}
//                 href={t.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 overflow-hidden hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/40"
//                 aria-label={`Mở trang chính thức của ${t.name}`}
//                 title={`Trang chính thức ${t.name}`}
//               >
//                 <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-purple-500/25 to-sky-400/25 opacity-40 animate-soft-pulse" style={{ animationDelay: `${idx * 0.12}s` }} />
//                 <div className="relative flex items-center gap-3 text-slate-100">
//                   <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10">
//                     <t.Logo />
//                   </div>
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-white group-hover:underline underline-offset-2">{t.name}</p>
//                     <p className="text-[11px] text-gray-400">Official site →</p>
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* ===== Divider ===== */}
//       <div className="relative max-w-7xl mx-auto px-6">
//         <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
//       </div>

//       {/* ===== Bottom bar ===== */}
//       <div className="relative w-full py-6 px-4">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <Bot className="w-6 h-6 text-blue-400" />
//             <span className="font-semibold text-lg text-white">Emotion AI Analyzer</span>
//           </div>
//           <div className="text-sm text-gray-400 text-center md:text-left">
//             <p>
//               Emotion AI Analyzer — <span className="text-gray-300">Nhận diện cảm xúc đa phương thức (Text • Audio • Vision)</span> © {new Date().getFullYear()} 
//             </p>
//             <p className="text-xs text-gray-500">Được phát triển bởi <b>Nhóm 25</b> – Khóa luận tốt nghiệp — Khoa CNTT – ĐH Công nghiệp TP.HCM</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <a href="mailto:emotionai.team@gmail.com" className="hover:text-blue-400 transition-colors" aria-label="Email nhóm phát triển"><Mail className="w-5 h-5" /></a>
//             <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="GitHub Repository"><Github className="w-5 h-5" /></a>
//             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
//             <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
//           </div>
//         </div>
//         <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
//           <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 animate-marquee" />
//         </div>
//       </div>

//       {/* ===== Custom animations ===== */}
//       <style>{`
//         @keyframes aurora { 0%,100% { transform: translateY(0) scale(1); opacity: .9; } 50% { transform: translateY(-20px) scale(1.05); opacity: 1; } }
//         @keyframes auroraDelayed { 0%,100% { transform: translateY(10px) scale(1); opacity: .8; } 50% { transform: translateY(-15px) scale(1.03); opacity: .95; } }
//         @keyframes marquee { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
//         @keyframes twinkle { 0%,100% { opacity: .2; } 50% { opacity: .7; } }
//         @keyframes fadeIn { to { opacity: 1; transform: none; } }
//         @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
//         @keyframes softPulse { 0% { opacity: .25; transform: scale(1); } 50% { opacity: .55; transform: scale(1.06); } 100% { opacity: .25; transform: scale(1); } }
//         @keyframes conic { to { transform: rotate(360deg); } }
//         .animate-aurora { animation: aurora 9s ease-in-out infinite; }
//         .animate-aurora-delayed { animation: auroraDelayed 12s ease-in-out infinite; }
//         .animate-marquee { animation: marquee 6s linear infinite; }
//         .animate-twinkle { animation: twinkle 3.5s ease-in-out infinite; }
//         .fade-in { animation: fadeIn .6s ease forwards; opacity: 0; transform: translateY(6px); }
//         .delay-1 { animation-delay: .15s; }
//         .delay-2 { animation-delay: .3s; }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-soft-pulse { animation: softPulse 4s ease-in-out infinite; }
//         .animate-border::before { content: ""; }
//         .animate-border { mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; border-radius: 1rem; position: absolute; inset: 0; animation: conic 8s linear infinite; }
//         .animate-badge { animation: fadeIn .5s ease forwards; opacity: 0; transform: translateY(6px); }
//       `}</style>
//     </footer>
//   );
// };

// export default FooterPape;









import React from "react";
import { Bot, Github, Mail, Heart, Linkedin } from "lucide-react";

/* ================= DATA ================= */
const techs = [
  // ... giống của bạn, mình giữ nguyên
  {
    name: "React",
    url: "https://react.dev",
    Logo: () => (
      <svg viewBox="0 0 128 128" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="10" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="6">
          <ellipse cx="64" cy="64" rx="58" ry="24" />
          <ellipse cx="64" cy="64" rx="58" ry="24" transform="rotate(60 64 64)" />
          <ellipse cx="64" cy="64" rx="58" ry="24" transform="rotate(120 64 64)" />
        </g>
      </svg>
    ),
  },
  // ... phần còn lại giữ nguyên
  {
    name: "Vite",
    url: "https://vitejs.dev/",
    Logo: () => (
      <svg viewBox="0 0 256 257" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 40l125 213L253 40 129 12 3 40z" fill="none" stroke="currentColor" strokeWidth="14" />
        <path d="M129 30l74 14-74 146L55 44l74-14z" fill="currentColor" opacity=".2" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    url: "https://www.typescriptlang.org/",
    Logo: () => (
      <svg viewBox="0 0 120 120" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="14" fill="currentColor" opacity=".25" />
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="52"
          fill="currentColor"
        >
          TS
        </text>
      </svg>
    ),
  },
  {
    name: "TailwindCSS",
    url: "https://tailwindcss.com/",
    Logo: () => (
      <svg viewBox="0 0 128 80" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M64 12c-16 0-24 8-28 16 6-4 12-6 18-6 9 0 15 5 20 12 5 6 11 10 20 10 6 0 12-2 18-6-4 8-12 16-28 16-9 0-15-5-20-12-5-6-11-10-20-10-6 0-12 2-18 6 4-8 12-16 28-16z" />
      </svg>
    ),
  },
  {
    name: "HTML5",
    url: "https://developer.mozilla.org/docs/Web/HTML",
    Logo: () => (
      <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M19 5l9 101 36 10 36-10 9-101H19zm77 29H47l2 17h43l-4 44-24 7-24-7-2-22h14l1 11 11 3 11-3 2-21H41l-4-45h63l-4 16z" />
      </svg>
    ),
  },
  {
    name: "CSS3",
    url: "https://developer.mozilla.org/docs/Web/CSS",
    Logo: () => (
      <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M19 5l9 101 36 10 36-10 9-101H19zm69 86l-24 7-24-7-1-14h14l1 6 10 3 11-3 1-11H41l-2-17h49l-1 11H54l1 6h33l-1 16z" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    url: "https://developer.mozilla.org/docs/Web/JavaScript",
    Logo: () => (
      <svg viewBox="0 0 120 120" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="12" fill="currentColor" opacity=".25" />
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="48"
          fill="currentColor"
        >
          JS
        </text>
      </svg>
    ),
  },
  {
    name: "Git",
    url: "https://git-scm.com/",
    Logo: () => (
      <svg viewBox="0 0 128 128" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M9 64l32-32 48 48-32 32L9 64zm58-10l7 7-10 10 7 7-8 8-14-14 8-8 10 10 10-10-10-10z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/",
    Logo: () => (
      <svg viewBox="0 0 16 16" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8 .2a8 8 0 00-2.53 15.6c.4.07.55-.17.55-.38v-1.3c-2.25.49-2.72-1.09-2.72-1.09-.37-.93-.9-1.18-.9-1.18-.74-.51.06-.5.06-.5.83.06 1.27.86 1.27.86.73 1.25 1.91.89 2.38.68.07-.53.29-.89.52-1.1-1.8-.2-3.69-.9-3.69-4a3.1 3.1 0 01.83-2.16 2.9 2.9 0 01.08-2.13s.68-.22 2.22.82a7.7 7.7 0 012.03-.27c.69 0 1.39.09 2.04.27 1.54-1.04 2.22-.82 2.22-.82.3.77.11 1.65.05 1.82.52.58.83 1.33.83 2.16 0 3.11-1.9 3.8-3.71 4 .3.26.56.78.56 1.58v2.34c0 .21.15.46.55.38A8 8 0 008 .2z"
        />
      </svg>
    ),
  },
];

const FooterPape: React.FC = () => {
  return (
    <footer className="relative w-full text-gray-300 border-t border-purple-800/30 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1e] via-[#120a2f] to-[#1a1042]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-56 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-sky-400/20 blur-3xl animate-aurora" />
        <div className="absolute top-10 right-0 w-[70%] h-40 bg-gradient-to-l from-violet-500/20 via-blue-500/20 to-emerald-400/20 blur-2xl animate-aurora-delayed" />
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white/25 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>

      {/* CONTENT (full width) */}
      <div className="relative w-full px-6 py-12 grid lg:grid-cols-3 gap-10 text-center lg:text-left">
        {/* Về dự án */}
        <section className="fade-in">
          <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">VỀ DỰ ÁN</h3>
          <div className="space-y-3 max-w-[54ch] mx-auto lg:mx-0 text-left">
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              Emotion AI Analyzer – Nhận diện cảm xúc đa phương thức{" "}
              <span className="text-gray-300">(Văn bản + Âm thanh + Video)</span>
            </p>
            <p className="text-sm sm:text-[15px] text-gray-300/95 leading-7 text-justify">
              Dự án <b>Emotion AI Analyzer</b> là một <b>Luận văn Tốt nghiệp</b> ngành <b>Khoa học máy tính</b>, tập trung
              vào việc phát triển một hệ thống toàn diện có khả năng phân tích và nhận diện cảm xúc của người dùng từ dữ
              liệu <b>đa phương thức</b>, bao gồm <b>văn bản</b>, <b>âm thanh</b>, và <b>video</b>.
            </p>
          </div>
        </section>

        {/* Nhóm phát triển */}
        <section className="fade-in delay-1">
          <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">NHÓM PHÁT TRIỂN</h3>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 animate-float-slow">
            {[
              { text: "Nhóm 25 • Lớp DHKHMT17B" },
              { text: "Khoa CNTT • Chuyên ngành: Khoa học máy tính" },
              { text: "Trường ĐH Công nghiệp TP.HCM • Khóa: 2021 – 2025" },
            ].map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-gradient-to-r from-fuchsia-600/30 via-purple-600/30 to-sky-500/30 rounded-full border border-purple-500/30 shadow-inner text-white animate-tag"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {item.text}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0">
            {[
              { name: "Trần Minh Châu", id: "MSSV: 21070211" },
              { name: "Nguyễn Khả Minh", id: "MSSV: 21124661" },
            ].map((m) => (
              <div key={m.name} className="relative rounded-2xl p-4 bg-white/5 border border-white/10 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl">
                  <div className="absolute -inset-[2px] rounded-2xl bg-[conic-gradient(at_0%_0%,theme(colors.fuchsia.500/.35),theme(colors.purple.500/.35),theme(colors.sky.400/.35),transparent)] animate-border" />
                </div>
                <div className="relative z-10">
                  <p className="text-white font-semibold">{m.name}</p>
                  <p className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-200 border border-emerald-600/40">
                    {m.id}
                  </p>
                </div>
                <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-sky-400/20 blur-2xl animate-float" />
              </div>
            ))}
          </div>
        </section>

        {/* Công nghệ */}
        <section className="fade-in delay-2">
          <h3 className="text-lg font-bold text-purple-300 tracking-wide mb-4">CÔNG NGHỆ PHÁT TRIỂN</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techs.map((t, idx) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 overflow-hidden hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                aria-label={`Mở trang chính thức của ${t.name}`}
                title={`Trang chính thức ${t.name}`}
              >
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-purple-500/25 to-sky-400/25 opacity-40 animate-soft-pulse"
                  style={{ animationDelay: `${idx * 0.12}s` }}
                />
                <div className="relative flex items-center gap-3 text-slate-100">
                  <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10">
                    <t.Logo />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white group-hover:underline underline-offset-2">{t.name}</p>
                    <p className="text-[11px] text-gray-400">Official site →</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Divider full width */}
      <div className="relative w-full px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* Bottom bar full width */}
      <div className="relative w-full py-6 px-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-400" />
            <span className="font-semibold text-lg text-white">Emotion AI Analyzer</span>
          </div>
          <div className="text-sm text-gray-400 text-center md:text-left">
            <p>
              Emotion AI Analyzer —{" "}
              <span className="text-gray-300">Nhận diện cảm xúc đa phương thức (Text • Audio • Vision)</span> ©{" "}
              {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-500">
              Được phát triển bởi <b>Nhóm 25</b> – Khóa luận tốt nghiệp — Khoa CNTT – ĐH Công nghiệp TP.HCM
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:emotionai.team@gmail.com" className="hover:text-blue-400 transition-colors" aria-label="Email nhóm phát triển">
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
        </div>
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 animate-marquee" />
        </div>
      </div>

      {/* Animations giữ nguyên */}
      <style>{`
        @keyframes aurora { 0%,100% { transform: translateY(0) scale(1); opacity: .9; } 50% { transform: translateY(-20px) scale(1.05); opacity: 1; } }
        @keyframes auroraDelayed { 0%,100% { transform: translateY(10px) scale(1); opacity: .8; } 50% { transform: translateY(-15px) scale(1.03); opacity: .95; } }
        @keyframes marquee { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        @keyframes twinkle { 0%,100% { opacity: .2; } 50% { opacity: .7; } }
        @keyframes fadeIn { to { opacity: 1; transform: none; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes softPulse { 0% { opacity: .25; transform: scale(1); } 50% { opacity: .55; transform: scale(1.06); } 100% { opacity: .25; transform: scale(1); } }
        @keyframes conic { to { transform: rotate(360deg); } }
        .animate-aurora { animation: aurora 9s ease-in-out infinite; }
        .animate-aurora-delayed { animation: auroraDelayed 12s ease-in-out infinite; }
        .animate-marquee { animation: marquee 6s linear infinite; }
        .animate-twinkle { animation: twinkle 3.5s ease-in-out infinite; }
        .fade-in { animation: fadeIn .6s ease forwards; opacity: 0; transform: translateY(6px); }
        .delay-1 { animation-delay: .15s; }
        .delay-2 { animation-delay: .3s; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-soft-pulse { animation: softPulse 4s ease-in-out infinite; }
        .animate-border::before { content: ""; }
        .animate-border { mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; border-radius: 1rem; position: absolute; inset: 0; animation: conic 8s linear infinite; }
        .animate-badge { animation: fadeIn .5s ease forwards; opacity: 0; transform: translateY(6px); }
      `}</style>
    </footer>
  );
};

export default FooterPape;
