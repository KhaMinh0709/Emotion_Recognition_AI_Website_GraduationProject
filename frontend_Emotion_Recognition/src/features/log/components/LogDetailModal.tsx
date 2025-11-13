// src/features/log/components/LogDetailModal.tsx
import React from "react";
import { X, Copy, Info, AlertTriangle, AlertCircle, Shield } from "lucide-react";
import { LogEntry } from "../utils/logTypes";

interface LogDetailModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const levelIcon =
    log.level === "error"
      ? AlertCircle
      : log.level === "warning"
      ? AlertTriangle
      : log.level === "audit"
      ? Shield
      : Info;

  const LevelIcon = levelIcon;

  const handleCopy = () => {
    const text = JSON.stringify(log, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className={[
                "w-9 h-9 rounded-full flex items-center justify-center",
                log.level === "error"
                  ? "bg-rose-500/15 text-rose-200"
                  : log.level === "warning"
                  ? "bg-amber-400/15 text-amber-100"
                  : log.level === "audit"
                  ? "bg-purple-500/15 text-purple-100"
                  : "bg-sky-500/15 text-sky-100",
              ].join(" ")}
            >
              <LevelIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Log detail</h3>
              <p className="text-xs text-gray-400">ID: {log.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <DetailRow label="Time" value={new Date(log.timestamp).toLocaleString()} />
            <DetailRow label="Source" value={log.source} />
            <DetailRow label="Action" value={log.action} />
            <DetailRow label="Level" value={log.level} />
            {log.user && <DetailRow label="User" value={log.user} />}
            {log.relatedId && <DetailRow label="Related" value={log.relatedId} />}
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-400 mb-2">Message</p>
            <p className="text-sm text-white leading-relaxed">{log.message}</p>
          </div>

          {log.meta && Object.keys(log.meta).length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Metadata</p>
              <pre className="text-xs bg-slate-950/40 rounded-xl p-3 border border-slate-700/40 overflow-x-auto text-gray-200">
                {JSON.stringify(log.meta, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-slate-950/30">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy JSON
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-900/60 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-slate-950/20 border border-white/5 px-3 py-2">
      <span className="text-[10px] uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-white break-all">{value}</span>
    </div>
  );
}
