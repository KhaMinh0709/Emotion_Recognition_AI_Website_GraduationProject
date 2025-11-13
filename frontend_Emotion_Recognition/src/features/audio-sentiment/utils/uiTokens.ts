// audio-sentiment/utils/uiTokens.ts

export const uiTokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-sky-900/20 hover:shadow-xl animate-[fadeIn_.42s_ease] will-change-transform",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  subtle: "text-slate-300/80",
  btn: {
    primary:
      "inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10 disabled:opacity-60",
    tab:
      "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
    icon:
      "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
    subtle:
      "px-3 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-60",
  },
};

export const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");
