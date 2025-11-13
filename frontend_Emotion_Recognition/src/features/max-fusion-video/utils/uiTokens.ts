// src/features/max-fusion/utils/uiTokens.ts

export const tokens = {
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

export const cn = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

export const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
`;
