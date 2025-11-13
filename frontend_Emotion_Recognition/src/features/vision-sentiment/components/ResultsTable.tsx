// vision-sentiment/components/ResultsTable.tsx
import React from "react";
import { tokens } from "../utils/tokens";
import { cx } from "../utils/cx";
import type { ResultRow } from "../types";

type ResultsTableProps = {
  rows: ResultRow[];
  filtered: ResultRow[];
  query: string;
  onQueryChange: (v: string) => void;
  onClearAll: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onRowClick: (row: ResultRow) => void;
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  rows,
  filtered,
  query,
  onQueryChange,
  onClearAll,
  onExportJSON,
  onExportCSV,
  onRowClick,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-sky-200 mb-3">Analysis Results</h3>
      <div className="flex items-center gap-3 mb-3">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-3 h-10 text-slate-200 focus:ring-2 focus:ring-sky-500/40 outline-none"
        />
        <div className="flex items-center gap-2 shrink-0">
          <button className={tokens.btn.subtle} onClick={onClearAll}>
            Clear all
          </button>
          <button
            className={tokens.btn.subtle}
            onClick={onExportJSON}
            disabled={!rows.length}
          >
            Export JSON
          </button>
          <button
            className={tokens.btn.subtle}
            onClick={onExportCSV}
            disabled={!rows.length}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className={cx(tokens.card, "overflow-hidden")}>
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-slate-300">
            <tr>
              <th className="text-left px-3 py-2 font-medium w-[60px]">#</th>
              <th className="text-left px-3 py-2 font-medium">Source</th>
              <th className="text-left px-3 py-2 font-medium">Label</th>
              <th className="text-left px-3 py-2 font-medium">Confidence</th>
              <th className="text-left px-3 py-2 font-medium">Latency</th>
              <th className="text-left px-3 py-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No results yet.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick(r)}
                  className="hover:bg-white/5 cursor-pointer"
                  title="Click for detail"
                >
                  <td className="px-3 py-2">{rows.indexOf(r) + 1}</td>
                  <td className="px-3 py-2 truncate max-w-[520px]" title={r.source}>
                    {r.source}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        r.label === "Happy"
                          ? "text-emerald-300"
                          : r.label === "Angry"
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
