import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot, Loader2, ChevronRight } from "lucide-react";

type Msg = { id: string; role: "user" | "model"; text: string };

// ====== CONFIG ======
const RAW_API = (import.meta.env.VITE_CHAT_API as string) || "";
const API =
  (RAW_API || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");
const SHARED = (import.meta.env.VITE_CHAT_SHARED_SECRET as string) || "";
const STORAGE_KEY = "chatwidget_history_v1";
const TIMEOUT_MS = 20000;

// 👉 Robot động: dùng MP4 bạn đã tải. Nếu xuất WebM alpha, đổi link là xong.
const ROBOT_VIDEO = "/assets/Robot.webm";

// localStorage hook
function useLocalStore<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

// parse JSON an toàn
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useLocalStore<Msg[]>(STORAGE_KEY, [
    {
      id: crypto.randomUUID(),
      role: "model",
      text: "Xin chào! Tôi là Emotion AI Chat. Bạn cần hỗ trợ gì?",
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto scroll
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!API || !/^https?:\/\//.test(API)) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: "Thiếu cấu hình VITE_CHAT_API (URL http/https) hoặc không thể suy ra origin hiện tại.",
        },
      ]);
      return;
    }
    if (!SHARED) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: "Thiếu VITE_CHAT_SHARED_SECRET ở frontend/.env",
        },
      ]);
      return;
    }

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const payload = { messages: [{ text }] };
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-chat-secret": SHARED },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await safeJson(res);

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized: sai x-chat-secret (kiểm tra .env frontend & server).");
        const detail = data?.detail || data?.error || `HTTP ${res.status}`;
        throw new Error(detail);
      }

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "model",
        text: (data?.text as string) || "(không có phản hồi)",
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "model",
            text:
              "Xin lỗi, hệ thống đang bận hoặc kết nối lỗi." +
              (e?.message ? `\nChi tiết: ${e.message}` : ""),
          },
        ]);
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "model",
        text: "Bắt đầu hội thoại mới. Hãy hỏi mình về phân tích cảm xúc, AI, hoặc cách dùng ứng dụng nhé!",
      },
    ]);
  };

  return (
    <>
      {/* Robot luôn hiển thị – có thể click để mở chat */}
      <div
        className="fixed z-50 right-5 bottom-5 cursor-pointer hover:scale-105 transition-transform ai-bob"
        aria-label="Chat"
        aria-pressed={open}
        onClick={() => setOpen((prev) => !prev)}   
        title={open ? "Đóng chat" : "Nhấn để trò chuyện"}
      >
        <div className="relative w-32 h-32 drop-shadow-xl ai-bob">
          <video
            src={ROBOT_VIDEO}
            className="w-32 h-32 object-contain"
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
          {/* bóng mờ */}
          <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-blue-600/10 blur-[3px]" />
        </div>
      </div>



      {/* ===== Launcher (viên thuốc) – lắc cùng nhịp robot ===== */}
      {!open && (
        <div className="fixed bottom-[3.50rem] right-[9.00rem] z-50 ai-bob">
          <button
            onClick={() => setOpen(true)}
            className="group relative
                      max-w-[75vw] sm:max-w-md rounded-full bg-blue-600 hover:bg-blue-700
                      text-white shadow-2xl transition-colors px-4 py-3 flex items-center gap-2
                      after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
                      after:-right-1 after:w-3 after:h-3 after:rotate-45
                      after:bg-blue-600 group-hover:after:bg-blue-700 after:shadow"
            aria-label="Open chat"
            title="Tôi có thể giúp gì cho bạn?"
          >
          <span className="text-sm sm:text-base font-medium">Tôi có thể giúp gì cho bạn?</span>
          <span className="w-7 h-7 rounded-full bg-white/20 grid place-items-center">
            <ChevronRight className="w-4 h-4" />
          </span>
          {/* đuôi bubble */}
          <span
            className="
              pointer-events-none
              absolute top-1/2 -translate-y-1/2 -right-1
              w-3 h-3 rotate-45
              bg-blue-600 group-hover:bg-blue-700 shadow
            "
          />

        </button>
        </div>
      )}

      {/* ===== Cửa sổ chat ===== */}
      {open && (
        <div
          className="
            fixed bottom-35 right-[5.25rem]  
            w-[22rem] sm:w-96
            bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700
            flex flex-col max-h-[75vh] z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div className="font-semibold">Emotion AI Chat</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="text-xs px-2 py-1 rounded bg-white/15 hover:bg-white/25"
                title="Xoá hội thoại"
              >
                Reset
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-5 h-5 opacity-80 hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-blue-600" : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang soạn trả lời…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-gray-800 p-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent outline-none text-sm px-2 placeholder:text-gray-500"
            />
            <button
              onClick={send}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-60"
              aria-label="Send"
              title="Gửi"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
