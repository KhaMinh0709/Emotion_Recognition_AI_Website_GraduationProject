// import { useMemo, useState } from "react";
// import {
//   Plus, Home as HomeIcon, AlertCircle, Trash2, Cloud,
//   ChevronRight, ChevronDown, Settings, HelpCircle,
//   Upload, Video, Music, FileText, Mic, Image, Layers, Film,
//   ShieldAlert
// } from "lucide-react";
// import "../types/drive-sidebar.css";
// import SettingsButton from "./SettingsButton";
// import HelpButton from "./HelpButton";

// type ItemKey =
//   | "home" | "dashboard" | "new-analysis"
//   | "text-sentiment" | "audio-sentiment" 
//   | "vision-sentiment" | "fused-model" 
//   | "max-fusion" | "review-queue" | "trash" 
//   | "storage" | "storage-upgrade";

// type SidebarItem = {
//   key: ItemKey;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
//   badge?: string;
//   className?: string;
// };

// const PRIMARY: SidebarItem[] = [
//   { key: "home", label: "Home", icon: HomeIcon },
//   { key: "dashboard", label: "Dashboard", icon: HomeIcon },

//   { key: "text-sentiment", label: "Text Sentiment", icon: FileText },
//   { key: "audio-sentiment", label: "Audio Sentiment", icon: Mic },
//   { key: "vision-sentiment", label: "Vision Sentiment", icon: Image },
//   { key: "fused-model", label: "Fused Model", icon: Layers },
//   { key: "max-fusion", label: "Max Fusion (Video)", icon: Film },

//   { key: "review-queue", label: "Review Queue", icon: ShieldAlert, badge: "12" },
//   { key: "trash", label: "Trash", icon: Trash2 },

//   { key: "storage", label: "Storage", icon: Cloud, badge: "" },
// ];

// export interface DriveLeftSidebarProps {
//   active?: ItemKey;
//   onChange?: (key: ItemKey) => void;
//   usedStorageGB?: number;
//   totalStorageGB?: number;
//   className?: string;
//   onUploadClick?: () => void;
//   onRecord?: (mode: 'video' | 'audio') => void;
//   onBuyStorage?: () => void;  
// }

// export default function DriveLeftSidebar({
//   active = "home",
//   onChange,
//   usedStorageGB = 13.39,
//   totalStorageGB = 2048,
//   className = "",
//   onUploadClick,
//   onRecord,
//   onBuyStorage, 
// }: DriveLeftSidebarProps) {
//   const [open, setOpen] = useState(true);

//   const pct = Math.min(100, Math.round((usedStorageGB / totalStorageGB) * 10000) / 100);
//   const storageText = `${usedStorageGB.toLocaleString("vi-VN")} GB trong tổng số ${(totalStorageGB / 1024).toLocaleString("vi-VN")} TB`;

//   /** ===== pretty groups ===== */
//   const nonStorageItems = useMemo(() => PRIMARY.filter(i => i.key !== "storage"), []);
//   const storageItem = useMemo(() => PRIMARY.find(i => i.key === "storage"), []);

//   /** ===== item component with glow/indicator ===== */
//   const Item = ({ item }: { item: SidebarItem }) => {
//     const Icon = item.icon;
//     const isActive = active === item.key;

//     return (
//       <button
//         onClick={() => onChange?.(item.key)}
//         className={[
//           "relative w-full overflow-hidden rounded-xl text-sm px-3 py-2.5",
//           "flex items-center gap-3 transition-all duration-300 group",
//           isActive
//             ? "bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/15 text-blue-300 ring-1 ring-inset ring-blue-500/30"
//             : "text-gray-300 hover:text-white hover:bg-white/5"
//         ].join(" ")}
//       >
//         {/* left indicator bar */}
//         <span
//           className={[
//             "absolute left-0 top-0 h-full w-[3px] rounded-r",
//             "bg-gradient-to-b from-fuchsia-400 via-purple-400 to-sky-400",
//             "transition-transform duration-300",
//             isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
//           ].join(" ")}
//           aria-hidden
//         />
//         {/* soft glow */}
//         <span
//           className="pointer-events-none absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl
//                      bg-[radial-gradient(60px_60px_at_left,theme(colors.sky.500/.15),transparent),
//                          radial-gradient(80px_80px_at_right,theme(colors.fuchsia.500/.12),transparent)]"
//           aria-hidden
//         />
//         {/* ripple */}
//         <span className="pointer-events-none absolute inset-0 opacity-0 group-active:opacity-100 animate-ripple"
//               aria-hidden />

//         <Icon className="h-4.5 w-4.5 shrink-0 text-current" />
//         <span className="flex-1 text-left">{item.label}</span>

//         {item.badge && (
//           <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-gray-300">
//             {item.badge}
//           </span>
//         )}
//       </button>
//     );
//   };

//   return (
//     <aside
//       className={[
//         "drive-sidebar relative h-full w-72 min-w-56 max-w-80",
//         "bg-[rgba(8,12,28,0.6)] backdrop-blur-xl",
//         "border-r border-slate-800/70 px-3 py-3",
//         "overflow-hidden", // for particles
//         className
//       ].join(" ")}
//     >
//       {/* floating particles (auto) */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         {Array.from({ length: 24 }).map((_, i) => (
//           <span
//             key={i}
//             className="absolute w-1 h-1 bg-white/15 rounded-full animate-float-slow"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 80}%`,
//               animationDelay: `${i * 0.25}s`,
//               animationDuration: `${8 + (i % 7)}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex gap-2 items-center">
//           <button
//             className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white
//                        hover:from-fuchsia-500 hover:to-sky-500 transition-all shadow-lg shadow-sky-900/20 px-3 py-2
//                        ring-1 ring-white/10 hover:ring-white/20"
//             onClick={() => onChange?.("new-analysis")}
//             aria-label="New Analysis"
//           >
//             <Plus className="h-4.5 w-4.5" />
//             <span className="font-medium">New Analysis</span>
//           </button>
//         </div>

//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-300"
//           onClick={() => setOpen(!open)}
//           aria-label="Toggle menu"
//         >
//           {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//         </button>
//       </div>

//       {/* Quick actions */}
//       <div className="mb-4 grid grid-cols-3 gap-2">
//         <button
//           onClick={() => onUploadClick ? onUploadClick() : onChange?.("text-sentiment")}
//           className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-all
//                      ring-1 ring-inset ring-white/10 hover:ring-white/20 group"
//           title="Upload file"
//         >
//           <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
//           <span>Upload</span>
//         </button>
//         <button
//           onClick={() => onRecord ? onRecord('video') : onChange?.("max-fusion")}
//           className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-all
//                      ring-1 ring-inset ring-white/10 hover:ring-white/20 group"
//           title="Record video"
//         >
//           <Video className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
//           <span>Video</span>
//         </button>
//         <button
//           onClick={() => onRecord ? onRecord('audio') : onChange?.("audio-sentiment")}
//           className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-all
//                      ring-1 ring-inset ring-white/10 hover:ring-white/20 group"
//           title="Record audio"
//         >
//           <Music className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
//           <span>Audio</span>
//         </button>
//       </div>

//       {/* Menu */}
//       <nav className={`${open ? "block" : "hidden md:block"} space-y-1`}>
//         {nonStorageItems.map((item) => (
//           <Item key={item.key} item={item} />
//         ))}

//         {/* Storage block */}
//         {storageItem && (
//           <div className="pt-2 mt-2 border-t border-gray-800/70">
//             <Item item={storageItem} />
//             <div className="px-3 py-2">
//               <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden ring-1 ring-inset ring-white/10">
//                 <div
//                   className="h-full rounded-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-purple-500
//                              animate-stripes"
//                   style={{ width: `${pct}%` }}
//                 />
//               </div>
//               <div className="mt-2 text-xs text-gray-400">{storageText}</div>

              

//               <button
//                 className="sb-btn mt-2 w-full text-center text-sm rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition
//                            ring-1 ring-inset ring-white/10 hover:ring-white/20"
//                 onClick={() => (onBuyStorage ? onBuyStorage() : onChange?.("storage"))}
//               >
//                 Mua thêm bộ nhớ
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Footer actions */}
//       <div className="mt-3 flex items-center justify-between px-1 text-gray-400">
//         <SettingsButton
//           onChange={(s) => console.log("Saved settings:", s)}
//           renderTrigger={({ onClick }) => (
//             <button
//               className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5 transition"
//               onClick={onClick}
//             >
//               <Settings className="h-4.5 w-4.5" />
//               <span className="text-sm">Cài đặt</span>
//             </button>
//           )}
//         />

//         <HelpButton
//           renderTrigger={({ onClick }) => (
//             <button
//               className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5 transition"
//               onClick={onClick}
//             >
//               <HelpCircle className="w-4 h-4" />
//               <span className="text-sm">Trợ giúp</span>
//             </button>
//           )}
//         />
//       </div>

//       </nav>

//       {/* local styles for micro-animations */}
//       <style>{`
//         .h-4.5 { height: 1.125rem; }
//         .w-4.5 { width: 1.125rem; }

//         @keyframes floatSlow {
//           0%,100% { transform: translateY(0) }
//           50% { transform: translateY(-6px) }
//         }
//         .animate-float-slow { animation: floatSlow 7.5s ease-in-out infinite; }

//         @keyframes ripple {
//           0% { opacity: .0; }
//           30% { opacity: .12; }
//           100% { opacity: 0; }
//         }
//         .animate-ripple {
//           background: radial-gradient(120px 120px at var(--mx,50%) var(--my,50%), rgba(255,255,255,.08), transparent 60%);
//           animation: ripple .6s ease-out 1;
//         }
//         /* let ripple follow cursor */
//         .group:active .animate-ripple { --mx: 50%; --my: 50%; }

//         @keyframes stripes {
//           0% { background-position: 0 0; }
//           100% { background-position: 40px 0; }
//         }
//         .animate-stripes {
//           background-size: 40px 100%;
//           mask-image: linear-gradient(90deg, rgba(0,0,0,.2), rgba(0,0,0,1));
//           animation: stripes 1.8s linear infinite;
//         }

//         @keyframes bgFlow {
//           0%,100% { transform: translateY(0) }
//           50% { transform: translateY(-10px) }
//         }
//         .animate-bgflow { animation: bgFlow 10s ease-in-out infinite; }
//       `}</style>
//     </aside>
//   );
// }
















import { useMemo, useState } from "react";
import {
  Plus,
  Home as HomeIcon,
  LayoutDashboard,
  Mic,
  Image,
  Film,
  ShieldAlert,
  ScrollText,
  Trash2,
  Users,
  Settings,
  Bell,
  HelpCircle,
  Upload,
  Video,
  Music,
} from "lucide-react";
import "../types/drive-sidebar.css";
import SettingsButton from "./SettingsButton";
import HelpButton from "./HelpButton";

export type ItemKey =
  | "home"
  | "dashboard"
  | "new-analysis"
  | "text-sentiment"
  | "audio-sentiment"
  | "vision-sentiment"
  | "fused-model"
  | "max-fusion"
  | "review-queue"
  | "trash"
  | "storage"
  | "storage-upgrade"
  | "log"
  | "users";

type SidebarItem = {
  key: ItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const VISIBLE_ITEMS: SidebarItem[] = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "audio-sentiment", label: "Audio Sentiment", icon: Mic },
  { key: "vision-sentiment", label: "Vision Sentiment", icon: Image },
  { key: "max-fusion", label: "Max Fusion (Video)", icon: Film },
  { key: "review-queue", label: "Review Queue", icon: ShieldAlert, badge: "12" },
  { key: "log", label: "Log", icon: ScrollText },
  { key: "trash", label: "Trash", icon: Trash2 },
  { key: "users", label: "Users", icon: Users },
];

export interface DriveLeftSidebarProps {
  active?: ItemKey;
  onChange?: (key: ItemKey) => void;
  className?: string;
  onUploadClick?: () => void;
  onRecord?: (mode: "video" | "audio") => void;
}

export default function DriveLeftSidebar({
  active = "home",
  onChange,
  className = "",
  onUploadClick,
  onRecord,
}: DriveLeftSidebarProps) {
  const [open, setOpen] = useState(true);
  const items = useMemo(() => VISIBLE_ITEMS, []);

  const Item = ({ item }: { item: SidebarItem }) => {
    const Icon = item.icon;
    const isActive = active === item.key;

    return (
      <button
        onClick={() => onChange?.(item.key)}
        className={[
          "relative w-full overflow-hidden rounded-xl px-3 py-2.5",
          "flex items-center gap-3 transition-all duration-300 group",
          "text-[15.5px]", // chữ to hơn
          isActive
            ? "bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-fuchsia-600/10 text-white ring-1 ring-inset ring-indigo-400/40"
            : "text-slate-200/85 hover:text-white hover:bg-white/5",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0 top-0 h-full w-[3px] rounded-r",
            "bg-gradient-to-b from-fuchsia-400 via-purple-400 to-sky-400",
            "transition-transform duration-300",
            isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
          ].join(" ")}
        />
        <span
          className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl
                     bg-[radial-gradient(70px_70px_at_left,theme(colors.sky.500/.16),transparent),radial-gradient(90px_90px_at_right,theme(colors.fuchsia.500/.14),transparent)]"
          aria-hidden
        />
        <Icon className="h-5 w-5 shrink-0 text-current" />
        <span className="flex-1 text-left tracking-tight">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-gray-100">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={[
        "drive-sidebar relative h-full w-72 min-w-60 max-w-80",
        "bg-[rgba(8,12,28,0.6)] backdrop-blur-xl",
        "border-r border-slate-800/70",
        "overflow-hidden",
        "flex flex-col",
        className,
      ].join(" ")}
    >
      {/* particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white/12 rounded-full animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 80}%`,
              animationDelay: `${i * 0.25}s`,
              animationDuration: `${8 + (i % 7)}s`,
            }}
          />
        ))}
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center text-white font-semibold">
            EA
          </div>
          <div className="leading-tight">
            <div className="text-[14.5px] font-semibold text-white">Emotion AI</div>
            <div className="text-[11.5px] text-slate-400">Recognition Suite</div>
          </div>
        </div>
        <button
          onClick={() => onChange?.("new-analysis")}
          className="h-10 w-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-sky-500 grid place-items-center text-white shadow-lg shadow-fuchsia-500/20 ring-1 ring-white/10 hover:scale-[1.02] transition"
          aria-label="New analysis"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-3 pb-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => (onUploadClick ? onUploadClick() : onChange?.("home"))}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11.5px] transition-all ring-1 ring-inset ring-white/10"
        >
          <Upload className="w-5 h-5 text-sky-400" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => (onRecord ? onRecord("video") : onChange?.("max-fusion"))}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11.5px] transition-all ring-1 ring-inset ring-white/10"
        >
          <Video className="w-5 h-5 text-emerald-400" />
          <span>Video</span>
        </button>
        <button
          onClick={() => (onRecord ? onRecord("audio") : onChange?.("audio-sentiment"))}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11.5px] transition-all ring-1 ring-inset ring-white/10"
        >
          <Music className="w-5 h-5 text-rose-400" />
          <span>Audio</span>
        </button>
      </div>

      {/* MENU */}
      <nav className={`${open ? "block" : "hidden md:block"} px-3 space-y-1`}>
        {items.map((item) => (
          <Item key={item.key} item={item} />
        ))}
      </nav>

      {/* BOTTOM – dính sát đáy, đi theo 1 cột */}
      <div className="mt-auto pt-4">
        <div className="h-px w-full bg-slate-800/60 mb-3 mx-3" />

        {/* 3 nút dọc */}
        <div className="px-3 flex flex-col gap-2 mb-3">
          <SettingsButton
            onChange={(s) => console.log("Saved settings:", s)}
            renderTrigger={({ onClick }) => (
              <button
                onClick={onClick}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-white/5 transition text-[14.5px]"
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Settings</span>
              </button>
            )}
          />

          <button
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-white/5 transition text-[14.5px]"
            onClick={() => console.log("Notifications")}
          >
            <Bell className="w-4.5 h-4.5" />
            <span>Notifications</span>
          </button>

          <HelpButton
            renderTrigger={({ onClick }) => (
              <button
                onClick={onClick}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-white/5 transition text-[14.5px]"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                <span>Support</span>
              </button>
            )}
          />
        </div>

        {/* account card */}
        <div className="px-3 pb-3">
          <div className="w-full rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center text-sm font-semibold">
              M
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-sm text-white">minh.nguyen</p>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* local styles */}
      <style>{`
        .h-4.5 { height: 1.125rem; }
        .w-4.5 { width: 1.125rem; }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-6px) }
        }
        .animate-float-slow { animation: floatSlow 7.5s ease-in-out infinite; }
      `}</style>
    </aside>
  );
}
