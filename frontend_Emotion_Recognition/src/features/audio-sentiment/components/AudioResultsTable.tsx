import React, { useMemo, useState } from "react";
import { AudioHistoryRow } from "../types";
import { uiTokens } from "../utils/uiTokens";

type Props = {
  rows: AudioHistoryRow[];
  onClear: () => void;
  onDeleteRow: (id: string) => void;
};

const AudioResultsTable: React.FC<Props> = ({
  rows,
  onClear,
  onDeleteRow,
}) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(s) ||
        r.label.toLowerCase().includes(s) ||
        String(Math.round(r.confidence * 100)).includes(s)
    );
  }, [q, rows]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ results: rows }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio_sentiment_results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = ["index", "source", "label", "confidence", "latency", "time"];
    const body = rows.map((r, i) => [
      String(i + 1),
      r.source.replace(/"/g, '""'),
      r.label,
      String(Math.round(r.confidence * 100) + "%"),
      String(r.latency),
      new Date(r.ts).toLocaleString(),
    ]);
    const csv =
      [header, ...body]
        .map((line) => line.map((c) => `"${c}"`).join(","))
        .join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio_sentiment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <div className={uiTokens.card}>
        {/* toolbar */}
        <div className="flex items-center gap-3 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-3 h-10 text-slate-200 focus:ring-2 focus:ring-sky-500/40 outline-none"
          />
          <button className={uiTokens.btn.subtle} onClick={onClear}>
            Clear all
          </button>
          <button
            className={uiTokens.btn.subtle}
            onClick={exportJSON}
            disabled={!rows.length}
          >
            Export JSON
          </button>
          <button
            className={uiTokens.btn.subtle}
            onClick={exportCSV}
            disabled={!rows.length}
          >
            Export CSV
          </button>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="text-left px-3 py-2 font-medium w-[60px]">#</th>
                <th className="text-left px-3 py-2 font-medium">Source</th>
                <th className="text-left px-3 py-2 font-medium">Label</th>
                <th className="text-left px-3 py-2 font-medium">Confidence</th>
                <th className="text-left px-3 py-2 font-medium">Latency</th>
                <th className="text-left px-3 py-2 font-medium">Time</th>
                <th className="text-right px-6 py-2 font-medium w-[90px]">
                  {/* actions */}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-slate-400 bg-slate-900/20"
                  >
                    No results yet.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2">
                      {rows.findIndex((x) => x.id === r.id) + 1}
                    </td>
                    <td
                      className="px-3 py-2 truncate max-w-[380px]"
                      title={r.source}
                    >
                      {r.source}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          r.label === "Positive"
                            ? "text-emerald-300"
                            : r.label === "Negative"
                            ? "text-rose-300"
                            : "text-slate-300"
                        }
                      >
                        {r.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {Math.round(r.confidence * 100)}%
                    </td>
                    <td className="px-3 py-2">{r.latency} ms</td>
                    <td className="px-3 py-2">
                      {new Date(r.ts).toLocaleString()}
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button
                        onClick={() => onDeleteRow(r.id)}
                        className="text-rose-400 hover:text-rose-300 text-sm"
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
      </div>
    </div>
  );
};

export default AudioResultsTable;
