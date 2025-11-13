// src/features/log/pages/LogPage.tsx
import React from "react";
import { Filter, Search, Download, Trash2 } from "lucide-react";
import { useLogs } from "../hooks/useLogs";
import { LogTable } from "../components/LogTable";
import { LogDetailModal } from "../components/LogDetailModal";

export default function LogPage() {
  const {
    filtered,
    loading,
    search,
    setSearch,
    level,
    setLevel,
    selected,
    setSelected,
    handleClear,
    handleExport,
  } = useLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-900/0 p-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Logs</h1>
          <p className="text-sm text-gray-400 mt-1">
            Lịch sử hoạt động của các mô-đun (Vision, Audio, Text, Max Fusion...)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/30 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500/60"
              placeholder="Search message, source, user..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLevel("all")}
              className={
                "px-3 py-2 rounded-xl text-sm flex items-center gap-1 " +
                (level === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-900/40 text-gray-300 hover:bg-slate-700/40")
              }
            >
              <Filter className="w-4 h-4" />
              All
            </button>
            <SelectLevelButton current={level} setLevel={setLevel} level="info">
              Info
            </SelectLevelButton>
            <SelectLevelButton current={level} setLevel={setLevel} level="warning">
              Warning
            </SelectLevelButton>
            <SelectLevelButton current={level} setLevel={setLevel} level="error">
              Error
            </SelectLevelButton>
            <SelectLevelButton current={level} setLevel={setLevel} level="audit">
              Audit
            </SelectLevelButton>
          </div>
        </div>
        <p className="text-xs text-gray-400 md:text-right">
          {filtered.length} log(s) found
        </p>
      </div>

      {/* Table */}
      <LogTable logs={filtered} loading={loading} onShowDetail={setSelected} />

      {/* Detail modal */}
      <LogDetailModal log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SelectLevelButton({
  current,
  setLevel,
  level,
  children,
}: {
  current: string;
  setLevel: (l: any) => void;
  level: "info" | "warning" | "error" | "audit";
  children: React.ReactNode;
}) {
  const active = current === level;
  const color =
    level === "error"
      ? "text-rose-200 bg-rose-500/10"
      : level === "warning"
      ? "text-amber-100 bg-amber-500/10"
      : level === "audit"
      ? "text-purple-100 bg-purple-500/10"
      : "text-sky-100 bg-sky-500/10";

  return (
    <button
      onClick={() => setLevel(level)}
      className={
        "px-3 py-2 rounded-xl text-sm transition " +
        (active ? color : "bg-slate-900/40 text-gray-200 hover:bg-slate-700/40")
      }
    >
      {children}
    </button>
  );
}
