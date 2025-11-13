// import React, { useMemo, useState } from "react";

// // =================== Design Tokens ===================
// const tokens = {
//     card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
//     title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
//     btn: {
//         primary:
//             "px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
//         ghost:
//             "px-4 h-10 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-100 border border-white/10",
//         danger:
//             "px-4 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/30",
//         subtle:
//             "px-3 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
//         icon:
//             "inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
//     },
// };
// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// // =================== Mock Data & Icons ===================
// const ICON = {
//     folder: (
//         <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300"><path fill="currentColor" d="M10 4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h6z" /></svg>
//     ),
//     file: (
//         <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-300"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path fill="currentColor" d="M14 2v6h6" /></svg>
//     ),
//     notebook: (
//         <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-300"><path fill="currentColor" d="M4 3h12a2 2 0 012 2v14a2 2 0 01-2 2H4V3z" /><path fill="currentColor" d="M20 6h-2v12h2a1 1 0 001-1V7a1 1 0 00-1-1z" /></svg>
//     ),
// };

// type Item = {
//     id: string;
//     type?: string;
//     name: string;
//     owner?: string;
//     removedAt?: string;
//     size?: number | null;
//     origin?: string;
//     ext?: string;
// };

// const SAMPLE: Item[] = [
//     { id: "1", type: "notebook", name: "OCR_FULL_CLASS.ipynb", owner: "Bạn", removedAt: "2025-10-22T03:12:00Z", size: 43800, origin: "OCR_FULL_CLASS", ext: "ipynb" },
//     { id: "2", type: "folder", name: "runs_char-sao", owner: "Bạn", removedAt: "2025-10-17T10:00:00Z", size: null, origin: "Chau" },
//     { id: "3", type: "notebook", name: "ALPR_OpenAI_Colab.ipynb", owner: "Bạn", removedAt: "2025-10-17T09:55:00Z", size: 25400, origin: "DATASET_ALPR" },
//     { id: "4", type: "zip", name: "PLATE_OCR_MERGED_20250927.zip", owner: "Bạn", removedAt: "2025-10-17T08:22:00Z", size: 771500000, origin: "DATASET_PLATE" },
//     { id: "5", type: "zip", name: "PLATE_OCR_PREP_20250927.zip", owner: "Bạn", removedAt: "2025-10-17T08:20:00Z", size: 1570000000, origin: "DATASET_PLATE" },
//     { id: "6", type: "notebook", name: "Untitled0.ipynb", owner: "Bạn", removedAt: "2025-10-17T07:15:00Z", size: 35000, origin: "DATASET_PLATE" },
//     { id: "7", type: "notebook", name: "Untitled1.ipynb", owner: "Bạn", removedAt: "2025-10-17T07:10:00Z", size: 12000, origin: "DATASET_PLATE" },
// ];

// function fmtBytes(bytes: number | null | undefined) {
//     if (bytes == null) return "—";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB", "TB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
// }
// function fmtDate(iso?: string) {
//     if (!iso) return "—";
//     const d = new Date(iso);
//     return d.toLocaleString();
// }

// // =================== Confirm Dialog ===================
// const Confirm: React.FC<{
//     open: boolean;
//     title: string;
//     msg: string;
//     confirmLabel?: string;
//     tone?: "danger" | "primary";
//     onClose: () => void;
//     onConfirm?: () => void;
// }> = ({ open, title, msg, confirmLabel = "Xác nhận", tone = "danger", onClose, onConfirm }) => {
//     if (!open) return null;
//     return (
//         <div className="fixed inset-0 z-50 grid place-items-center">
//             <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
//             <div className={cn(tokens.card, "w-[min(640px,92vw)] p-6 relative z-10")}>
//                 <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
//                 <p className="text-slate-300 mb-5">{msg}</p>
//                 <div className="flex justify-end gap-3">
//                     <button className={tokens.btn.ghost} onClick={onClose}>Hủy</button>
//                     <button className={tone === "danger" ? tokens.btn.danger : tokens.btn.primary} onClick={() => { onConfirm?.(); onClose?.(); }}>
//                         {confirmLabel}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // =================== Toolbar ===================
// const Toolbar: React.FC<{
//     selected: string[];
//     onRestore: () => void;
//     onDelete: () => void;
//     onEmpty: () => void;
//     filters: { type: string; order: string; q: string };
//     setFilters: React.Dispatch<React.SetStateAction<{ type: string; order: string; q: string }>>;
// }> = ({ selected, onRestore, onDelete, onEmpty, filters, setFilters }) => {
//     const any = selected.length > 0;
//     return (
//         <div className={cn(tokens.card, "p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3")}>
//             <div className="flex items-center gap-2">
//                 <button className={tokens.btn.primary} disabled={!any} onClick={onRestore}>Khôi phục</button>
//                 <button className={tokens.btn.danger} disabled={!any} onClick={onDelete}>Xóa vĩnh viễn</button>
//                 <div className="h-6 w-px bg-white/10 mx-2" />
//                 <button className={tokens.btn.subtle} onClick={onEmpty}>Dọn sạch thùng rác</button>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//                 <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200" value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
//                     <option value="all">Loại: Tất cả</option>
//                     <option value="folder">Thư mục</option>
//                     <option value="notebook">Notebook</option>
//                     <option value="zip">Tập tin nén</option>
//                     <option value="file">Tập tin khác</option>
//                 </select>
//                 <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200" value={filters.order} onChange={(e) => setFilters(f => ({ ...f, order: e.target.value }))}>
//                     <option value="recent">Lần sửa đổi gần đây nhất</option>
//                     <option value="oldest">Cũ nhất</option>
//                     <option value="size">Kích thước</option>
//                 </select>
//                 <input placeholder="Tìm trong thùng rác…" className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 w-[220px]" value={filters.q} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
//             </div>
//         </div>
//     );
// };

// // =================== Table ===================
// const Row: React.FC<{ item: Item; checked: boolean; onToggle: (id: string, checked: boolean) => void }> = ({ item, checked, onToggle }) => (
//     <tr className="hover:bg-white/5">
//         <td className="px-3 py-2"><input type="checkbox" checked={checked} onChange={(e) => onToggle(item.id, e.target.checked)} className="accent-sky-500" /></td>
//         <td className="px-3 py-2">
//             <div className="flex items-center gap-3">
//                 {item.type === 'folder' ? ICON.folder : item.type === 'notebook' ? ICON.notebook : ICON.file}
//                 <div className="text-slate-200 truncate max-w-[360px]" title={item.name}>{item.name}</div>
//             </div>
//         </td>
//         <td className="px-3 py-2 text-slate-300">{item.owner}</td>
//         <td className="px-3 py-2 text-slate-300 whitespace-nowrap">{fmtDate(item.removedAt)}</td>
//         <td className="px-3 py-2 text-slate-300 text-right">{fmtBytes(item.size)}</td>
//         <td className="px-3 py-2 text-slate-300 truncate max-w-[220px]" title={item.origin}>{item.origin}</td>
//     </tr>
// );

// const TrashTable: React.FC<{ items: Item[]; selected: string[]; setSelected: React.Dispatch<React.SetStateAction<string[]>> }> = ({ items, selected, setSelected }) => {
//     const allChecked = items.length > 0 && selected.length === items.length;
//     const toggleAll = (checked: boolean) => setSelected(checked ? items.map(i => i.id) : []);
//     const toggleOne = (id: string, checked: boolean) => setSelected((prev: string[]) => checked ? Array.from(new Set([...prev, id])) : prev.filter((x: string) => x !== id));

//     return (
//         <div className={cn(tokens.card, "overflow-hidden")}>
//             <table className="w-full text-sm">
//                 <thead className="bg-white/5 border-b border-white/10 text-slate-300">
//                     <tr>
//                         <th className="text-left px-3 py-2"><input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className="accent-sky-500" /></th>
//                         <th className="text-left px-3 py-2 font-medium">Tên</th>
//                         <th className="text-left px-3 py-2 font-medium">Chủ sở hữu</th>
//                         <th className="text-left px-3 py-2 font-medium">Ngày chuyển vào thùng rác</th>
//                         <th className="text-right px-3 py-2 font-medium">Kích thước tệp</th>
//                         <th className="text-left px-3 py-2 font-medium">Vị trí gốc</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {items.map((it) => (
//                         <Row key={it.id} item={it} checked={selected.includes(it.id)} onToggle={toggleOne} />
//                     ))}
//                 </tbody>
//             </table>
//             {items.length === 0 && (
//                 <div className="p-12 text-center text-slate-400">Thùng rác trống.</div>
//             )}
//         </div>
//     );
// };

// // =================== Main Component ===================
// export default function TrashManager(): React.ReactElement {
//     // In real app, fetch from API
//     const [data, setData] = useState<Item[]>(SAMPLE);
//     const [selected, setSelected] = useState<string[]>([]);
//     const [filters, setFilters] = useState<{ type: string; order: string; q: string }>({ type: 'all', order: 'recent', q: '' });

//     const filtered = useMemo(() => {
//         let out = [...data];
//         if (filters.q) out = out.filter(i => i.name.toLowerCase().includes(filters.q.toLowerCase()));
//         if (filters.type !== 'all') out = out.filter(i => (i.type === filters.type));
//         if (filters.order === 'recent') out.sort((a, b) => (new Date(b.removedAt || 0).getTime()) - (new Date(a.removedAt || 0).getTime()));
//         if (filters.order === 'oldest') out.sort((a, b) => (new Date(a.removedAt || 0).getTime()) - (new Date(b.removedAt || 0).getTime()));
//         if (filters.order === 'size') out.sort((a, b) => (b.size || 0) - (a.size || 0));
//         return out;
//     }, [data, filters]);

//     // confirm dialogs
//     const [ask, setAsk] = useState<{ type: 'delete' | 'restore' | 'empty'; ids?: string[] } | null>(null);

//     const restore = (ids: string[]) => {
//         // call API: POST /trash/restore {ids}
//         setData(prev => prev.filter(x => !ids.includes(x.id)));
//         setSelected([]);
//     };
//     const deleteForever = (ids: string[]) => {
//         // call API: DELETE /trash {ids}
//         setData(prev => prev.filter(x => !ids.includes(x.id)));
//         setSelected([]);
//     };
//     const emptyTrash = () => {
//         // call API: DELETE /trash/all
//         setData([]);
//         setSelected([]);
//     };

//     return (
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
//             <div className="flex items-center justify-between mb-4">
//                 <h1 className={tokens.title}>Trash</h1>
//                 <div className="text-sm text-slate-400">Các mục trong thùng rác sẽ bị xóa vĩnh viễn sau 30 ngày.</div>
//             </div>

//             <Toolbar
//                 selected={selected}
//                 onRestore={() => setAsk({ type: 'restore', ids: selected })}
//                 onDelete={() => setAsk({ type: 'delete', ids: selected })}
//                 onEmpty={() => setAsk({ type: 'empty' })}
//                 filters={filters}
//                 setFilters={setFilters}
//             />

//             <div className="mt-4">
//                 <TrashTable items={filtered} selected={selected} setSelected={setSelected} />
//             </div>

//             {/* Confirm dialogs */}
//             <Confirm
//                 open={!!ask && ask.type === 'restore'}
//                 title={`Khôi phục ${ask?.ids?.length || 0} mục?`}
//                 msg="Mục sẽ được đưa về vị trí gốc."
//                 confirmLabel="Khôi phục"
//                 tone="primary"
//                 onClose={() => setAsk(null)}
//                 onConfirm={() => restore(ask?.ids || [])}
//             />
//             <Confirm
//                 open={!!ask && ask.type === 'delete'}
//                 title={`Xóa vĩnh viễn ${ask?.ids?.length || 0} mục?`}
//                 msg="Bạn sẽ không thể khôi phục sau khi xóa."
//                 confirmLabel="Xóa vĩnh viễn"
//                 tone="danger"
//                 onClose={() => setAsk(null)}
//                 onConfirm={() => deleteForever(ask?.ids || [])}
//             />
//             <Confirm
//                 open={!!ask && ask.type === 'empty'}
//                 title="Dọn sạch thùng rác?"
//                 msg="Mọi mục trong thùng rác sẽ bị xóa vĩnh viễn."
//                 confirmLabel="Dọn sạch"
//                 tone="danger"
//                 onClose={() => setAsk(null)}
//                 onConfirm={emptyTrash}
//             />
//         </div>
//     );
// }








import React, { useMemo, useState } from "react";

/* =================== Design Tokens =================== */
const tokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  btn: {
    primary:
      "px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-10 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-100 border border-white/10",
    danger:
      "px-4 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/30 disabled:opacity-60 disabled:pointer-events-none",
    subtle:
      "px-3 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
    icon:
      "inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
  },
};
const cn = (...c: any[]) => c.filter(Boolean).join(" ");
const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
`;

/* =================== Mock Data & Icons =================== */
const ICON = {
  folder: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300">
      <path
        fill="currentColor"
        d="M10 4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h6z"
      />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-300">
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      />
      <path fill="currentColor" d="M14 2v6h6" />
    </svg>
  ),
  notebook: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-300">
      <path
        fill="currentColor"
        d="M4 3h12a2 2 0 012 2v14a2 2 0 01-2 2H4V3z"
      />
      <path
        fill="currentColor"
        d="M20 6h-2v12h2a1 1 0 001-1V7a1 1 0 00-1-1z"
      />
    </svg>
  ),
};

type Item = {
  id: string;
  type?: string;
  name: string;
  owner?: string;
  removedAt?: string;
  size?: number | null;
  origin?: string;
  ext?: string;
};

const SAMPLE: Item[] = [
  {
    id: "1",
    type: "notebook",
    name: "OCR_FULL_CLASS.ipynb",
    owner: "Bạn",
    removedAt: "2025-10-22T03:12:00Z",
    size: 43800,
    origin: "OCR_FULL_CLASS",
    ext: "ipynb",
  },
  {
    id: "2",
    type: "folder",
    name: "runs_char-sao",
    owner: "Bạn",
    removedAt: "2025-10-17T10:00:00Z",
    size: null,
    origin: "Chau",
  },
  {
    id: "3",
    type: "notebook",
    name: "ALPR_OpenAI_Colab.ipynb",
    owner: "Bạn",
    removedAt: "2025-10-17T09:55:00Z",
    size: 25400,
    origin: "DATASET_ALPR",
  },
  {
    id: "4",
    type: "zip",
    name: "PLATE_OCR_MERGED_20250927.zip",
    owner: "Bạn",
    removedAt: "2025-10-17T08:22:00Z",
    size: 771500000,
    origin: "DATASET_PLATE",
  },
  {
    id: "5",
    type: "zip",
    name: "PLATE_OCR_PREP_20250927.zip",
    owner: "Bạn",
    removedAt: "2025-10-17T08:20:00Z",
    size: 1570000000,
    origin: "DATASET_PLATE",
  },
  {
    id: "6",
    type: "notebook",
    name: "Untitled0.ipynb",
    owner: "Bạn",
    removedAt: "2025-10-17T07:15:00Z",
    size: 35000,
    origin: "DATASET_PLATE",
  },
  {
    id: "7",
    type: "notebook",
    name: "Untitled1.ipynb",
    owner: "Bạn",
    removedAt: "2025-10-17T07:10:00Z",
    size: 12000,
    origin: "DATASET_PLATE",
  },
];

function fmtBytes(bytes: number | null | undefined) {
  if (bytes == null) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}
function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}

/* =================== Confirm Dialog =================== */
const Confirm: React.FC<{
  open: boolean;
  title: string;
  msg: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  onClose: () => void;
  onConfirm?: () => void;
}> = ({
  open,
  title,
  msg,
  confirmLabel = "Xác nhận",
  tone = "danger",
  onClose,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(tokens.card, "w-[min(640px,92vw)] p-6 relative z-10")}>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-300 mb-5">{msg}</p>
        <div className="flex justify-end gap-3">
          <button className={tokens.btn.ghost} onClick={onClose}>
            Hủy
          </button>
          <button
            className={tone === "danger" ? tokens.btn.danger : tokens.btn.primary}
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =================== Toolbar =================== */
const Toolbar: React.FC<{
  selected: string[];
  onRestore: () => void;
  onDelete: () => void;
  onEmpty: () => void;
  filters: { type: string; order: string; q: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ type: string; order: string; q: string }>
  >;
}> = ({ selected, onRestore, onDelete, onEmpty, filters, setFilters }) => {
  const any = selected.length > 0;
  return (
    <div
      className={cn(
        tokens.card,
        "p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      )}
    >
      <div className="flex items-center gap-2">
        <button className={tokens.btn.primary} disabled={!any} onClick={onRestore}>
          Khôi phục
        </button>
        <button className={tokens.btn.danger} disabled={!any} onClick={onDelete}>
          Xóa vĩnh viễn
        </button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <button className={tokens.btn.subtle} onClick={onEmpty}>
          Dọn sạch thùng rác
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <select
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="all">Loại: Tất cả</option>
          <option value="folder">Thư mục</option>
          <option value="notebook">Notebook</option>
          <option value="zip">Tập tin nén</option>
          <option value="file">Tập tin khác</option>
        </select>
        <select
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200"
          value={filters.order}
          onChange={(e) => setFilters((f) => ({ ...f, order: e.target.value }))}
        >
          <option value="recent">Lần sửa đổi gần đây nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="size">Kích thước</option>
        </select>
        <input
          placeholder="Tìm trong thùng rác…"
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 w-[220px]"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>
    </div>
  );
};

/* =================== Table =================== */
const Row: React.FC<{
  item: Item;
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}> = ({ item, checked, onToggle }) => (
  <tr className="hover:bg-white/5">
    <td className="px-3 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(item.id, e.target.checked)}
        className="accent-sky-500"
      />
    </td>
    <td className="px-3 py-2">
      <div className="flex items-center gap-3">
        {item.type === "folder"
          ? ICON.folder
          : item.type === "notebook"
          ? ICON.notebook
          : ICON.file}
        <div
          className="text-slate-200 truncate max-w-[360px]"
          title={item.name}
        >
          {item.name}
        </div>
      </div>
    </td>
    <td className="px-3 py-2 text-slate-300">{item.owner}</td>
    <td className="px-3 py-2 text-slate-300 whitespace-nowrap">
      {fmtDate(item.removedAt)}
    </td>
    <td className="px-3 py-2 text-slate-300 text-right">{fmtBytes(item.size)}</td>
    <td className="px-3 py-2 text-slate-300 truncate max-w-[220px]" title={item.origin}>
      {item.origin}
    </td>
  </tr>
);

const TrashTable: React.FC<{
  items: Item[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ items, selected, setSelected }) => {
  const allChecked = items.length > 0 && selected.length === items.length;
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? items.map((i) => i.id) : []);
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev: string[]) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
    );

  return (
    <div className={cn(tokens.card, "overflow-hidden")}>
      <table className="w-full text-sm">
        <thead className="bg-white/5 border-b border-white/10 text-slate-300">
          <tr>
            <th className="text-left px-3 py-2">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
                className="accent-sky-500"
              />
            </th>
            <th className="text-left px-3 py-2 font-medium">Tên</th>
            <th className="text-left px-3 py-2 font-medium">Chủ sở hữu</th>
            <th className="text-left px-3 py-2 font-medium">
              Ngày chuyển vào thùng rác
            </th>
            <th className="text-right px-3 py-2 font-medium">Kích thước tệp</th>
            <th className="text-left px-3 py-2 font-medium">Vị trí gốc</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <Row
              key={it.id}
              item={it}
              checked={selected.includes(it.id)}
              onToggle={toggleOne}
            />
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="p-12 text-center text-slate-400">Thùng rác trống.</div>
      )}
    </div>
  );
};

/* =================== Main Component =================== */
export default function TrashManager(): React.ReactElement {
  // In real app, fetch from API
  const [data, setData] = useState<Item[]>(SAMPLE);
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ type: string; order: string; q: string }>(
    { type: "all", order: "recent", q: "" }
  );

  const filtered = useMemo(() => {
    let out = [...data];
    if (filters.q)
      out = out.filter((i) =>
        i.name.toLowerCase().includes(filters.q.toLowerCase())
      );
    if (filters.type !== "all") out = out.filter((i) => i.type === filters.type);
    if (filters.order === "recent")
      out.sort(
        (a, b) =>
          new Date(b.removedAt || 0).getTime() -
          new Date(a.removedAt || 0).getTime()
      );
    if (filters.order === "oldest")
      out.sort(
        (a, b) =>
          new Date(a.removedAt || 0).getTime() -
          new Date(b.removedAt || 0).getTime()
      );
    if (filters.order === "size")
      out.sort((a, b) => (b.size || 0) - (a.size || 0));
    return out;
  }, [data, filters]);

  // confirm dialogs
  const [ask, setAsk] = useState<
    { type: "delete" | "restore" | "empty"; ids?: string[] } | null
  >(null);

  const restore = (ids: string[]) => {
    // TODO: POST /trash/restore
    setData((prev) => prev.filter((x) => !ids.includes(x.id)));
    setSelected([]);
  };
  const deleteForever = (ids: string[]) => {
    // TODO: DELETE /trash
    setData((prev) => prev.filter((x) => !ids.includes(x.id)));
    setSelected([]);
  };
  const emptyTrash = () => {
    // TODO: DELETE /trash/all
    setData([]);
    setSelected([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <style>{KEYFRAMES}</style>

      {/* Glow header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-6">
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
              {/* bin icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
                Trash
              </h1>
              <p className="text-slate-200/85">
                Các mục trong thùng rác sẽ bị xóa vĩnh viễn sau 30 ngày.
              </p>
            </div>
          </div>
        </div>
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

      {/* Toolbar */}
      <Toolbar
        selected={selected}
        onRestore={() => setAsk({ type: "restore", ids: selected })}
        onDelete={() => setAsk({ type: "delete", ids: selected })}
        onEmpty={() => setAsk({ type: "empty" })}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Table */}
      <div className="mt-4">
        <TrashTable
          items={filtered}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      {/* Confirm dialogs */}
      <Confirm
        open={!!ask && ask.type === "restore"}
        title={`Khôi phục ${ask?.ids?.length || 0} mục?`}
        msg="Mục sẽ được đưa về vị trí gốc."
        confirmLabel="Khôi phục"
        tone="primary"
        onClose={() => setAsk(null)}
        onConfirm={() => restore(ask?.ids || [])}
      />
      <Confirm
        open={!!ask && ask.type === "delete"}
        title={`Xóa vĩnh viễn ${ask?.ids?.length || 0} mục?`}
        msg="Bạn sẽ không thể khôi phục sau khi xóa."
        confirmLabel="Xóa vĩnh viễn"
        tone="danger"
        onClose={() => setAsk(null)}
        onConfirm={() => deleteForever(ask?.ids || [])}
      />
      <Confirm
        open={!!ask && ask.type === "empty"}
        title="Dọn sạch thùng rác?"
        msg="Mọi mục trong thùng rác sẽ bị xóa vĩnh viễn."
        confirmLabel="Dọn sạch"
        tone="danger"
        onClose={() => setAsk(null)}
        onConfirm={emptyTrash}
      />
    </div>
  );
}
