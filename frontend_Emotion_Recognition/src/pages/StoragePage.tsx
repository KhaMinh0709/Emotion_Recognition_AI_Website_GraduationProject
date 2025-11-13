import React, { useMemo, useState } from "react";
import { HardDrive, Trash2, Database, Download, Archive, Search, Plus } from "lucide-react";

/** helpers */
const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(" ");
const FX = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
@keyframes zoomIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
`;

/** mock data */
type FileRow = {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "other";
  size: number; // bytes
  path: string;
  updatedAt: string;
};

const MOCK: FileRow[] = [
  { id: "f1", name: "interview_raw_01.mp4", type: "video", size: 2_140_000_000, path: "datasets/video/interviews", updatedAt: "2025-10-29T09:12:00Z" },
  { id: "f2", name: "podcast_ep12.wav", type: "audio", size: 380_000_000, path: "datasets/audio/podcasts", updatedAt: "2025-10-28T21:40:00Z" },
  { id: "f3", name: "comments_dump.json", type: "text", size: 120_000_000, path: "datasets/text/exports", updatedAt: "2025-10-27T18:01:00Z" },
  { id: "f4", name: "session_20251030.mp4", type: "video", size: 1_320_000_000, path: "uploads/video", updatedAt: "2025-10-30T06:05:00Z" },
  { id: "f5", name: "mic_test.flac", type: "audio", size: 95_400_000, path: "uploads/audio", updatedAt: "2025-10-24T11:00:00Z" },
];

function fmtBytes(bytes: number) {
  const k = 1024, u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${u[i]}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString();
}

/** small cards */
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-[zoomIn_.22s_ease-out]">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}

export default function StoragePage() {
  /** tổng dùng – thay số thực bằng API của bạn */
  const totalGB = 2048;            // 2 TB
  const usedGB  = 13.39;           // demo giống sidebar
  const percent = Math.min(100, (usedGB / totalGB) * 100);

  const [query, setQuery] = useState("");
  const [type, setType]   = useState<"all" | FileRow["type"]>("all");
  const [rows, setRows]   = useState<FileRow[]>(MOCK);

  const filtered = useMemo(() => {
    let out = rows;
    if (type !== "all") out = out.filter(r => r.type === type);
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(r => r.name.toLowerCase().includes(q) || r.path.toLowerCase().includes(q));
    }
    return [...out].sort((a,b)=> b.size - a.size);
  }, [rows, type, query]);

  /** actions (mock) */
  const remove = (ids: string[]) => setRows(prev => prev.filter(r => !ids.includes(r.id)));
  const archive = (ids: string[]) => {
    // TODO: API move to cold storage
    alert(`Đã chuyển ${ids.length} mục sang Cold Storage (demo)`);
  };
  const download = (id: string) => alert(`Tải xuống ${id} (demo)`);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <style>{FX}</style>

      {/* HEADER phát sáng */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-6">
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background: "linear-gradient(90deg,#06b6d4,#4f46e5,#a855f7,#4f46e5,#06b6d4)",
            backgroundSize: "300% 100%",
            animation: "moveX 16s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        <div className="relative px-6 py-7 md:px-10 md:py-9">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">Storage</h1>
              <p className="text-slate-200/85">Quản lý dung lượng, dọn dẹp tệp lớn & mua thêm bộ nhớ.</p>
            </div>
          </div>
        </div>
        {/* thanh chạy dưới đáy */}
        <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
          <div
            className="absolute top-0 h-[3px] w-[35%] left-[-35%] rounded-full"
            style={{
              background: "linear-gradient(90deg,#22d3ee,#a855f7,#22d3ee)",
              animation: "sweepX 2.8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* SUMMARY + CTA */}
      <div className="grid md:grid-cols-4 gap-3">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-300">Dung lượng đã dùng</div>
            <div className="text-slate-400 text-sm">{percent.toFixed(0)}%</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400"
              style={{ width: `${percent}%` }}
            />
            <div
              className="absolute top-0 h-full w-[35%] left-[-35%] rounded-full"
              style={{
                background: "linear-gradient(90deg,rgba(255,255,255,.0),rgba(255,255,255,.35),rgba(255,255,255,.0))",
                animation: "sweepX 2.8s linear infinite",
              }}
            />
          </div>
          <div className="mt-1.5 text-[12px] text-slate-400">
            {usedGB.toFixed(2)} GB / {(totalGB/1024).toFixed(0)} TB
          </div>

          <div className="mt-3 flex gap-2">
            <button className="px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400 shadow-lg inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Mua thêm bộ nhớ
            </button>
            <button
              className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 inline-flex items-center gap-2"
              onClick={()=>alert("Dọn cache tạm (demo)")}
            >
              <Database className="w-4 h-4" /> Dọn cache tạm
            </button>
          </div>
        </div>

        <StatCard label="Video" value="8.52 GB" sub="Uploads & datasets" />
        <StatCard label="Audio" value="3.59 GB" sub="Recordings" />
      </div>

      {/* TOOLBAR */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-md p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 animate-[zoomIn_.18s_ease-out]">
        <div className="flex items-center gap-2">
          <button
            className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 inline-flex items-center gap-2"
            onClick={() => archive(filtered.slice(0,2).map(r=>r.id))}
            title="Chuyển sang Cold Storage (demo)"
          >
            <Archive className="w-4 h-4" />
            Cold storage
          </button>
          <button
            className="px-3 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white inline-flex items-center gap-2"
            onClick={() => remove(filtered.slice(-1).map(r=>r.id))}
            title="Xóa file cũ nhất (demo)"
          >
            <Trash2 className="w-4 h-4" />
            Xóa file cũ nhất
          </button>
        </div>

        <div className="md:ml-auto flex items-center gap-2">
          <select
            className="h-10 rounded-xl bg-white/5 border border-white/10 px-2 text-slate-200"
            value={type}
            onChange={(e)=>setType(e.target.value as any)}
          >
            <option value="all">Tất cả loại</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="text">Text</option>
            <option value="other">Khác</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 w-[220px] focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="Tìm tệp…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE: Largest files */}
      <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50 animate-[zoomIn_.18s_ease-out]">
        <div className="px-4 py-3 border-b border-white/10 text-slate-200 font-medium">Largest files</div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-300 border-b border-white/10">
            <tr>
              <th className="px-3 py-2 text-left">Tên</th>
              <th className="px-3 py-2 text-left">Vị trí</th>
              <th className="px-3 py-2 text-left">Cập nhật</th>
              <th className="px-3 py-2 text-right">Kích thước</th>
              <th className="px-3 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r)=>(
              <tr key={r.id} className="hover:bg-white/5">
                <td className="px-3 py-2 text-slate-200">{r.name}</td>
                <td className="px-3 py-2 text-slate-300">{r.path}</td>
                <td className="px-3 py-2 text-slate-300">{fmtDate(r.updatedAt)}</td>
                <td className="px-3 py-2 text-slate-200 text-right">{fmtBytes(r.size)}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button className="px-2 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200" onClick={()=>download(r.id)}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="px-2 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200" onClick={()=>archive([r.id])}>
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="px-2 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white" onClick={()=>remove([r.id])}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Không có tệp phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
