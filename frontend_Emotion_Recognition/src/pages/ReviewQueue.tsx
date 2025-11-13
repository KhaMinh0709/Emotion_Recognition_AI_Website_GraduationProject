// src/components/ReviewQueue.tsx
import React, { useMemo, useState } from "react";
import { Check, Trash2, Info, Filter, Undo2, Search } from "lucide-react";

/* ===== helpers ===== */
type Row = {
  id: string;
  source: "Text" | "Audio" | "Vision" | "Fused";
  label: string;
  confidence: number; // 0..1
  time: string; // ISO
  flagged?: boolean;
  note?: string;
};

const MOCK: Row[] = [
  { id: "r1", source: "Text",  label: "Neutral", confidence: 0.56, time: "2025-10-30T08:25:12Z", note: "phrase uncertain" },
  { id: "r2", source: "Audio", label: "Happy",  confidence: 0.48, time: "2025-10-30T08:23:01Z", flagged: true, note: "noise>threshold" },
  { id: "r3", source: "Vision",label: "Sad",    confidence: 0.58, time: "2025-10-30T08:20:31Z" },
  { id: "r4", source: "Fused", label: "Angry",  confidence: 0.45, time: "2025-10-30T08:18:09Z", note: "modalities conflict" },
];

const fmtPct  = (p: number) => `${Math.round(p * 100)}%`;
const fmtTime = (iso: string) => new Date(iso).toLocaleString();
const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(" ");

/* ===== animations (toàn cục cho component) ===== */
const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@keyframes zoomIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
.animate-fadein{animation:fadein .22s ease-out}
.animate-zoomIn{animation:zoomIn .18s ease-out}
`;

export default function ReviewQueue() {
  const [rows, setRows] = useState<Row[]>(MOCK);
  const [selected, setSelected] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(0.6);
  const [detail, setDetail] = useState<Row | null>(null);
  const [q, setQ] = useState("");

  const any = selected.length > 0;

  const filtered = useMemo(() => {
    const base = rows.filter(r => r.confidence < threshold || r.flagged);
    if (!q.trim()) return base;
    const term = q.toLowerCase();
    return base.filter(r => {
      const hay = `${r.source} ${r.label} ${fmtTime(r.time)} ${r.note ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [rows, threshold, q]);

  const toggle = (id: string, on: boolean) =>
    setSelected(prev => on ? Array.from(new Set([...prev, id])) : prev.filter(x => x !== id));
  const toggleAll = (on: boolean) =>
    setSelected(on ? filtered.map(r => r.id) : []);

  // Actions
  const approve = (ids: string[]) => {
    // TODO: API: POST /results/approve
    setRows(prev => prev.filter(r => !ids.includes(r.id)));
    setSelected([]);
  };
  const dismiss = (ids: string[]) => {
    // TODO: API: POST /results/dismiss
    setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, flagged: false, confidence: Math.max(r.confidence, threshold) } : r));
    setSelected([]);
  };
  const removeForever = (ids: string[]) => {
    // TODO: API: DELETE /results
    setRows(prev => prev.filter(r => !ids.includes(r.id)));
    setSelected([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <style>{KEYFRAMES}</style>

      {/* ===== Header: glow + sweep bar + slider bên phải ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-4 animate-fadein">
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background: "linear-gradient(90deg,#06b6d4,#4f46e5,#a855f7,#4f46e5,#06b6d4)",
            backgroundSize: "300% 100%",
            animation: "moveX 16s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />

        <div className="relative px-6 py-6 md:px-8 md:py-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M4 12h16M4 6h16M4 18h16" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">Chờ duyệt</h1>
              <p className="text-slate-200/85 text-sm">
                Duyệt/loại các kết quả có độ tự tin thấp hoặc bị gắn cờ trước khi đưa vào báo cáo.
              </p>
            </div>
          </div>

          {/* Slider ngưỡng ở bên phải header */}
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-200/90">
            <Filter className="w-4 h-4" />
            <span>Ngưỡng confidence</span>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-44 accent-sky-500"
            />
            <span className="w-10 text-right">{fmtPct(threshold)}</span>
          </div>
        </div>

        {/* sweep bar */}
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

      {/* ===== Toolbar: nút + ô tìm kiếm nằm NGAY bên phải nút xóa ===== */}
      <div className="rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 p-3 mb-3 flex flex-wrap items-center gap-2 animate-fadein">
        <button
          className="px-3 h-10 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white inline-flex items-center gap-2"
          disabled={!any}
          onClick={() => approve(selected)}
        >
          <Check className="w-4 h-4" /> Duyệt
        </button>
        <button
          className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 inline-flex items-center gap-2"
          disabled={!any}
          onClick={() => dismiss(selected)}
        >
          <Undo2 className="w-4 h-4" /> Bỏ qua
        </button>
        <button
          className="px-3 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white inline-flex items-center gap-2"
          disabled={!any}
          onClick={() => removeForever(selected)}
        >
          <Trash2 className="w-4 h-4" /> Xóa vĩnh viễn
        </button>

        {/* ô tìm kiếm – đặt ngay bên phải nút xóa */}
        <div className="relative ml-1">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm…"
            className="w-[220px] pl-8 pr-3 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <div className="ml-auto text-sm text-slate-400">
          {selected.length} đã chọn • {filtered.length} mục cần duyệt
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50 animate-fadein">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-300 border-b border-white/10">
            <tr>
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  className="accent-sky-500"
                  checked={filtered.length > 0 && selected.length === filtered.length}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="px-3 py-2 text-left">Nguồn</th>
              <th className="px-3 py-2 text-left">Nhãn</th>
              <th className="px-3 py-2 text-left">Confidence</th>
              <th className="px-3 py-2 text-left">Thời gian</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="accent-sky-500"
                    checked={selected.includes(r.id)}
                    onChange={(e) => toggle(r.id, e.target.checked)}
                  />
                </td>
                <td className="px-3 py-2 text-slate-200">{r.source}</td>
                <td className="px-3 py-2 text-slate-200">{r.label}</td>
                <td className="px-3 py-2 text-slate-200">{fmtPct(r.confidence)}</td>
                <td className="px-3 py-2 text-slate-200">{fmtTime(r.time)}</td>
                <td className="px-3 py-2">
                  {r.flagged ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30">
                      Flagged
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-600/30 text-slate-300 border border-white/10">
                      Low conf.
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {/* nhóm nút dịch phải + giãn cách */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="px-2 h-8 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white"
                      onClick={() => approve([r.id])}
                      title="Duyệt"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      className="px-2 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                      onClick={() => dismiss([r.id])}
                      title="Bỏ qua"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      className="px-2 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
                      onClick={() => removeForever([r.id])}
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="px-2 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                      onClick={() => setDetail(r)}
                      title="Chi tiết"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  Không có mục nào cần duyệt. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Detail Modal ===== */}
      {detail && (
        <div className="fixed inset-0 z-[120] grid place-items-center">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setDetail(null)}
          />
          <div className="relative w-[min(560px,92vw)] rounded-2xl border border-white/10 bg-slate-800/90 p-5 shadow-2xl animate-zoomIn">
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-100 font-semibold">Chi tiết #{detail.id}</div>
              <button
                className="px-3 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                onClick={() => setDetail(null)}
              >
                Đóng
              </button>
            </div>
            <div className="space-y-2 text-slate-300">
              <div><b>Nguồn:</b> {detail.source}</div>
              <div><b>Nhãn:</b> {detail.label}</div>
              <div><b>Confidence:</b> {fmtPct(detail.confidence)}</div>
              <div><b>Thời gian:</b> {fmtTime(detail.time)}</div>
              <div><b>Ghi chú:</b> {detail.note || "—"}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-3 h-10 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white inline-flex items-center gap-2"
                onClick={() => { approve([detail.id]); setDetail(null); }}
              >
                <Check className="w-4 h-4" /> Duyệt
              </button>
              <button
                className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 inline-flex items-center gap-2"
                onClick={() => { dismiss([detail.id]); setDetail(null); }}
              >
                <Undo2 className="w-4 h-4" /> Bỏ qua
              </button>
              <button
                className="px-3 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white inline-flex items-center gap-2"
                onClick={() => { removeForever([detail.id]); setDetail(null); }}
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
