// src/components/HelpButton.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HelpCircle,
  X,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  Mail,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

const btn = {
  icon:
    "inline-flex items-center justify-center rounded-xl h-9 w-9 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition",
  subtle:
    "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition",
  primary:
    "px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg hover:from-sky-400 hover:to-indigo-400 transition",
};

export default function HelpButton({
  renderTrigger,
}: {
  renderTrigger?: (p: { onClick: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"guide" | "faq" | "troubleshoot" | "contact">(
    "guide"
  );

  // ESC & scroll lock
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

  const Trigger = renderTrigger ? (
    renderTrigger({ onClick: () => setOpen(true) })
  ) : (
    <button
      className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5 transition text-gray-300"
      onClick={() => setOpen(true)}
    >
      <HelpCircle className="w-4 h-4" />
      <span className="text-sm">Trợ giúp</span>
    </button>
  );

  const tabs = [
    { key: "guide", label: "Hướng dẫn nhanh", icon: BookOpen },
    { key: "faq", label: "Câu hỏi thường gặp", icon: MessageCircle },
    { key: "troubleshoot", label: "Xử lý sự cố", icon: AlertTriangle },
    { key: "contact", label: "Liên hệ hỗ trợ", icon: Mail },
  ] as const;

  const Content = () => {
    switch (tab) {
      case "guide":
        return (
          <div className="space-y-4 animate-fadein">
            <h3 className="text-xl font-semibold text-slate-100">
              Hướng Dẫn Nhanh
            </h3>
            <p className="text-slate-300">
              👋 Xin chào! Đây là trung tâm trợ giúp. Dưới đây là một số bước
              cơ bản để bắt đầu:
            </p>
            <ul className="list-disc ml-6 text-slate-300 space-y-1">
              <li>Điều hướng qua thanh bên để mở từng chức năng.</li>
              <li>Tùy chỉnh cài đặt trong mục <b>Settings</b>.</li>
              <li>Mở dấu <b>?</b> để xem thêm mô tả/tooltip.</li>
            </ul>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  t: "Phân tích nhanh",
                  d: "Tải lên file hoặc ghi video/audio để bắt đầu.",
                },
                {
                  t: "Kết quả chi tiết",
                  d: "Xem confidence, timeline và biểu đồ tổng hợp.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="text-slate-100 font-medium">{c.t}</div>
                  <div className="text-sm text-slate-400 mt-1">{c.d}</div>
                </div>
              ))}
            </div>

            <div className="pt-1 flex gap-2">
              <button className={btn.primary}>Xem hướng dẫn chi tiết</button>
              <button className={btn.subtle}>Tài liệu API</button>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-3 animate-fadein">
            <h3 className="text-xl font-semibold text-slate-100 mb-1">
              Câu Hỏi Thường Gặp
            </h3>
            {FAQ_LIST.map((item, i) => (
              <Accordion key={i} title={item.q} body={item.a} />
            ))}
          </div>
        );

      case "troubleshoot":
        return (
          <div className="space-y-3 animate-fadein">
            <h3 className="text-xl font-semibold text-slate-100 mb-1">
              Xử Lý Sự Cố
            </h3>
            {TROUBLE_LIST.map((t) => (
              <div
                key={t.title}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  {t.title}
                </div>
                <div className="text-sm text-slate-400 mt-1">{t.fix}</div>
              </div>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4 animate-fadein">
            <h3 className="text-xl font-semibold text-slate-100">Liên Hệ Hỗ Trợ</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                📧 Email:{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-sky-300 hover:underline"
                >
                  support@example.com
                </a>
              </li>
              <li>
                💬 Discord:{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sky-300 hover:underline inline-flex items-center gap-1"
                >
                  Tham gia cộng đồng <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-slate-200 font-medium mb-2">Gửi phản hồi</div>
              <textarea
                placeholder="Mô tả vấn đề hoặc góp ý của bạn…"
                className="w-full h-28 rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-slate-100"
              />
              <div className="mt-3">
                <button className={btn.primary}>Gửi</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Trigger}

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fadein"
              onClick={() => setOpen(false)}
            />

            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div
                className="pointer-events-auto relative w-[min(1040px,94vw)] max-h-[85vh] overflow-hidden rounded-2xl border border-white/10
                           bg-[linear-gradient(180deg,rgba(15,23,42,.85),rgba(15,23,42,.76))] shadow-2xl animate-zoomIn"
              >
                {/* header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sky-400" />
                    Trợ giúp
                  </div>
                  <button
                    className={btn.icon}
                    onClick={() => setOpen(false)}
                    aria-label="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-[260px_1fr]">
                  {/* LEFT NAV – không tràn chữ, tự wrap */}
                  <aside className="border-r border-white/10 p-3 overflow-y-auto max-h-[73vh]">
                    <nav className="space-y-1">
                      {tabs.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.key;
                        return (
                          <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cx(
                              // dùng grid + whitespace-normal để text không tràn
                              "w-full text-left grid grid-cols-[20px_1fr] gap-3 items-start px-3 py-2.5 rounded-xl",
                              "whitespace-normal break-words leading-snug",
                              active
                                ? "bg-sky-500/15 text-sky-200 ring-1 ring-inset ring-sky-500/30"
                                : "text-slate-300 hover:bg-white/5"
                            )}
                          >
                            <Icon className="w-4.5 h-4.5 mt-[2px]" />
                            <span className="text-sm">{t.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </aside>

                  {/* RIGHT CONTENT */}
                  <main className="p-6 overflow-y-auto max-h-[73vh]">
                    <Content />
                  </main>
                </div>
              </div>
            </div>

            <style>{`
              .h-4.5{height:1.125rem}.w-4.5{width:1.125rem}
              @keyframes fadein{from{opacity:0}to{opacity:1}}
              .animate-fadein{animation:fadein .22s ease-out}
              @keyframes zoomIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
              .animate-zoomIn{animation:zoomIn .2s ease-out}
              @keyframes acc{from{opacity:.0;transform:translateY(-4px)}to{opacity:1;transform:none}}
              .acc-enter{animation:acc .18s ease-out}
            `}</style>
          </div>,
          document.body
        )}
    </>
  );
}

/* ---------- Data & UI helpers ---------- */

const FAQ_LIST = [
  {
    q: "Làm sao để lưu cấu hình?",
    a: "Mọi thay đổi trong phần Settings sẽ tự động lưu vào LocalStorage của trình duyệt.",
  },
  {
    q: "Tôi có thể đổi ngôn ngữ không?",
    a: "Có, mở tab 'General' trong Cài đặt → mục Language.",
  },
  {
    q: "Ứng dụng có hoạt động ngoại tuyến không?",
    a: "Một phần tính năng vẫn hoạt động offline, tuy nhiên một số API yêu cầu kết nối mạng.",
  },
  {
    q: "Phân tích video có giới hạn thời lượng?",
    a: "Ở chế độ demo là 60 giây. Bản đầy đủ có thể cấu hình theo nhu cầu.",
  },
];

const TROUBLE_LIST = [
  {
    title: "Không lưu được cài đặt",
    fix: "Hãy kiểm tra quyền truy cập LocalStorage hoặc tắt chế độ ẩn danh.",
  },
  {
    title: "Không hiển thị panel",
    fix: "Có thể bị xung đột CSS/z-index. Đặt panel ở cấp root (fixed trên <body>).",
  },
  {
    title: "Không kết nối API",
    fix: "Kiểm tra API key, CORS và kết nối Internet.",
  },
];

function Accordion({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left hover:bg-white/5 transition"
      >
        <div className="font-medium text-slate-100">{title}</div>
        <ChevronDown
          className={cx(
            "w-4 h-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="px-4 pb-4 text-slate-300 acc-enter">{body}</div>}
    </div>
  );
}
