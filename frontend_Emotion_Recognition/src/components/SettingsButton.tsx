// src/components/SettingsButton.tsx
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Settings,
  X,
  Bell,
  Palette,
  Shield,
  Database,
  PlugZap,
  CalendarDays,
  Users,
  User2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

/** small helpers */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

/** Toggle UI */
const Switch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={cx(
      "relative h-6 w-10 rounded-full transition-colors",
      checked ? "bg-emerald-500/80" : "bg-slate-600"
    )}
    aria-checked={checked}
    role="switch"
  >
    <span
      className={cx(
        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
        checked ? "translate-x-4" : "translate-x-0"
      )}
    />
  </button>
);

/** Select UI */
const Select = ({
  value,
  items,
  onChange,
}: {
  value: string;
  items: string[];
  onChange: (v: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pr-8 pl-3 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
    >
      {items.map((i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
    <ChevronRight className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
  </div>
);

/** Button style tokens */
const btn = {
  icon:
    "inline-flex items-center justify-center rounded-xl h-9 w-9 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition",
  subtle:
    "px-3 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition",
  primary:
    "px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg hover:from-sky-400 hover:to-indigo-400 transition",
};

export default function SettingsButton({
  onChange,
  renderTrigger,
}: {
  onChange?: (state: Record<string, any>) => void;
  /** Tùy chọn: render nút trigger từ bên ngoài (sidebar) */
  renderTrigger?: (p: { onClick: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // fake settings state (giữ nguyên logic & UI từ code của bạn)
  const [appearance, setAppearance] = useState("System");
  const [language, setLanguage] = useState("Tiếng Việt");
  const [accent, setAccent] = useState("Default");
  const [showExtra, setShowExtra] = useState(true);

  const leftNav = useMemo(
    () => [
      { key: "general", label: "General", icon: Sparkles },
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "personal", label: "Personalization", icon: Palette },
      { key: "apps", label: "Apps & Connectors", icon: PlugZap },
      { key: "schedules", label: "Schedules", icon: CalendarDays },
      { key: "data", label: "Data controls", icon: Database },
      { key: "security", label: "Security", icon: Shield },
      { key: "parental", label: "Parental controls", icon: Users },
      { key: "account", label: "Account", icon: User2 },
    ],
    []
  );
  const [tab, setTab] = useState("general");

  /* ===== PANEL BEHAVIOR: portal + body scroll lock + ESC close ===== */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  /* ===== Right content (giữ nguyên UI từ code bạn) ===== */
  const Content = () => {
    if (tab === "general")
      return (
        <div className="space-y-6 animate-fadein">
          <Section title="Appearance">
            <Select
              value={appearance}
              items={["System", "Light", "Dark"]}
              onChange={setAppearance}
            />
            <span className="text-slate-400">Giao diện</span>
          </Section>

          <Section title="Language">
            <Select
              value={language}
              items={["Tiếng Việt", "English", "日本語", "한국어"]}
              onChange={setLanguage}
            />
            <span className="text-slate-400">Ngôn ngữ hiển thị</span>
          </Section>

          <Section title="Accent color">
            <Select
              value={accent}
              items={["Default", "Sky", "Fuchsia", "Emerald", "Amber"]}
              onChange={setAccent}
            />
            <span className="text-slate-400">Màu nhấn</span>
          </Section>

          <Section title="Show additional models">
            <Switch checked={showExtra} onChange={setShowExtra} />
          </Section>
        </div>
      );

    if (tab === "notifications")
      return (
        <CardsGrid
          items={[
            {
              title: "Email alerts",
              desc: "Nhận thông báo kết quả phân tích qua email.",
            },
            {
              title: "Push notifications",
              desc: "Thông báo trạng thái job, lỗi, hoàn tất.",
            },
            {
              title: "Weekly summary",
              desc: "Bản tóm tắt tuần và xu hướng cảm xúc.",
            },
          ]}
        />
      );

    if (tab === "personal")
      return (
        <div className="space-y-4 animate-fadein">
          <CardRow title="Theme presets">
            <Tag text="Neon" />
            <Tag text="Aurora" />
            <Tag text="Minimal" />
          </CardRow>
          <CardRow title="Avatar">
            <button className={btn.subtle}>Upload</button>
            <button className={btn.subtle}>Remove</button>
          </CardRow>
          <CardRow title="Timeline density">
            <input
              type="range"
              className="w-56 accent-sky-500"
              min={0}
              max={100}
              defaultValue={60}
            />
          </CardRow>
        </div>
      );

    if (tab === "apps")
      return (
        <CardsGrid
          items={[
            { title: "Slack", desc: "Gửi kết quả vào kênh #ai-lab." },
            { title: "Zapier", desc: "Tự động hóa workflow của bạn." },
            { title: "Drive", desc: "Lưu export thẳng vào Google Drive." },
          ]}
        />
      );

    if (tab === "schedules")
      return (
        <div className="space-y-3 animate-fadein">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-slate-100">
                  Báo cáo định kỳ #{i}
                </div>
                <div className="text-sm text-slate-400">
                  Thứ 2 – 9:00 • gửi email đội Data
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={btn.subtle}>Edit</button>
                <button className={btn.subtle}>Run now</button>
              </div>
            </div>
          ))}
          <button className={btn.primary}>+ Tạo lịch mới</button>
        </div>
      );

    if (tab === "data")
      return (
        <div className="space-y-3 animate-fadein">
          <CardRow title="Anonymize uploads">
            <Switch checked onChange={() => {}} />
          </CardRow>
          <CardRow title="Auto-delete raw files (days)">
            <input
              type="number"
              defaultValue={30}
              min={0}
              className="w-24 h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-slate-100"
            />
          </CardRow>
          <CardRow title="Export format">
            <Select
              value={"JSON"}
              items={["JSON", "CSV", "Parquet"]}
              onChange={() => {}}
            />
          </CardRow>
        </div>
      );

    if (tab === "security")
      return (
        <div className="space-y-3 animate-fadein">
          <CardRow title="Two-factor authentication">
            <button className={btn.subtle}>Enable</button>
          </CardRow>
          <CardRow title="Sessions">
            <div className="text-slate-400 text-sm">
              MacOS • Chrome • Hoạt động
            </div>
          </CardRow>
          <CardRow title="API Keys">
            <button className={btn.subtle}>Create key</button>
          </CardRow>
        </div>
      );

    if (tab === "parental")
      return (
        <div className="space-y-3 animate-fadein">
          <CardRow title="Content filter">
            <Select
              value={"Standard"}
              items={["Off", "Standard", "Strict"]}
              onChange={() => {}}
            />
          </CardRow>
          <CardRow title="Screen time limit (min)">
            <input
              type="number"
              defaultValue={60}
              className="w-28 h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-slate-100"
            />
          </CardRow>
        </div>
      );

    // account
    return (
      <div className="space-y-3 animate-fadein">
        <CardRow title="Tên hiển thị">
          <input
            className="h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-slate-100 w-64"
            defaultValue="Your Name"
          />
        </CardRow>
        <CardRow title="Email">
          <input
            className="h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-slate-100 w-64"
            defaultValue="you@example.com"
          />
        </CardRow>
        <div className="pt-2">
          <button
            className={btn.primary}
            onClick={() => onChange?.({ appearance, language, accent, showExtra })}
          >
            Save changes
          </button>
        </div>
      </div>
    );
  };

  /* ===== Trigger ===== */
  const Trigger = renderTrigger ? (
    renderTrigger({ onClick: () => setOpen(true) })
  ) : (
    <button
      className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5 transition text-gray-300"
      onClick={() => setOpen(true)}
      aria-label="Open settings"
    >
      <Settings className="w-4 h-4" />
      <span className="text-sm">Cài đặt</span>
    </button>
  );

  return (
    <>
      {Trigger}

      {/* ============== PORTAL: panel giữa màn hình ============== */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fadein"
              onClick={() => setOpen(false)}
            />
            {/* center */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div
                className="pointer-events-auto relative w-[min(1040px,95vw)] max-h-[85vh] overflow-hidden rounded-2xl
                           border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.85),rgba(15,23,42,.76))] shadow-2xl animate-zoomIn"
                role="dialog"
                aria-modal
              >
                {/* header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-sky-400" />
                    Settings
                  </div>
                  {/* Close: icon X */}
                  <button
                    className={btn.icon}
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* layout */}
                <div className="grid grid-cols-[240px_1fr]">
                  {/* left nav */}
                  <aside className="border-r border-white/10 p-3 overflow-y-auto max-h-[73vh]">
                    <nav className="space-y-1">
                      {leftNav.map((m) => {
                        const Icon = m.icon;
                        const active = tab === m.key;
                        return (
                          <button
                            key={m.key}
                            onClick={() => setTab(m.key)}
                            className={cx(
                              "w-full flex items-center gap-2 px-3 h-10 rounded-xl transition text-left",
                              active
                                ? "bg-sky-500/15 text-sky-200 ring-1 ring-inset ring-sky-500/30"
                                : "text-slate-300 hover:bg-white/5"
                            )}
                          >
                            <Icon className="w-4.5 h-4.5" />
                            {m.label}
                          </button>
                        );
                      })}
                    </nav>
                  </aside>

                  {/* content */}
                  <main className="p-6 overflow-y-auto max-h-[73vh]">
                    <h3 className="text-xl font-semibold text-slate-100 mb-4 capitalize">
                      {leftNav.find((x) => x.key === tab)?.label}
                    </h3>
                    <Content />
                  </main>
                </div>
              </div>
            </div>

            {/* animations */}
            <style>{`
              .h-4.5{height:1.125rem}.w-4.5{width:1.125rem}
              @keyframes fadein{from{opacity:0}to{opacity:1}}
              .animate-fadein{animation:fadein .22s ease-out}
              @keyframes zoomIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
              .animate-zoomIn{animation:zoomIn .18s ease-out}
            `}</style>
          </div>,
          document.body
        )}
    </>
  );
}

/** small composition blocks */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="text-slate-300">{title}</div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

function CardRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div className="text-slate-300">{title}</div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

function CardsGrid({
  items,
}: {
  items: { title: string; desc: string }[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3 animate-fadein">
      {items.map((c) => (
        <div
          key={c.title}
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-2 text-slate-100 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {c.title}
          </div>
          <div className="text-sm text-slate-400 mt-1">{c.desc}</div>
          <div className="mt-3 flex gap-2">
            <button className={btn.subtle}>Configure</button>
            <button className={btn.subtle}>Disable</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200">
      {text}
    </span>
  );
}
