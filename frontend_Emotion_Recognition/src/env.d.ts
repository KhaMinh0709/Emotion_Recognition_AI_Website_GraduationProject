/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_SHARED_SECRET: string;
  // Nếu bạn còn dùng thêm biến khác, thêm ở đây:
  // readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
