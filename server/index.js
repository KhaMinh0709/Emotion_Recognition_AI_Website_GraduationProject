// --- env & deps
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- config
const SHARED_SECRET = (process.env.SHARED_SECRET || '').trim();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const KB_DIR = path.join(__dirname, 'kb');
const PORT = process.env.PORT || 5000;

// === TẠO APP (phần bạn thiếu)
const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 })); // tuỳ chỉnh

// ===== KB loader =====
function safeList(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(n => n.toLowerCase().endsWith(ext));
}
function loadKB() {
  const pieces = [];
  ['.md', '.mdx', '.txt'].forEach(ext => {
    for (const f of safeList(KB_DIR, ext)) {
      pieces.push(`\n\n### File: ${f}\n${fs.readFileSync(path.join(KB_DIR, f), 'utf8')}`);
    }
  });
  for (const f of safeList(KB_DIR, '.json')) {
    try {
      const obj = JSON.parse(fs.readFileSync(path.join(KB_DIR, f), 'utf8'));
      pieces.push(`\n\n### JSON: ${f}\n${JSON.stringify(obj, null, 2)}`);
    } catch {}
  }
  return pieces.join('\n');
}
let APP_CONTEXT = loadKB();

// --- health & admin
app.get('/health', (_req, res) => res.json({
  ok: true,
  kb: !!APP_CONTEXT,
  kbBytes: (APP_CONTEXT || '').length,
}));

app.post('/admin/reload-kb', (_req, res) => {
  APP_CONTEXT = loadKB();
  res.json({ ok: true, kbBytes: (APP_CONTEXT || '').length });
});

// ===== Chat: trả lời dựa trên KB =====
app.post('/api/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini not configured', detail: 'Missing GEMINI_API_KEY' });
    }

    const header = (req.header('x-chat-secret') || '').trim();
    if (!SHARED_SECRET || header !== SHARED_SECRET) {
      return res.status(401).json({ error: 'Unauthorized: bad x-chat-secret' });
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const last = messages.at(-1)?.text?.toString().slice(0, 4000) || '';
    if (!last) return res.status(400).json({ error: 'Missing message text' });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: `
      Bạn là trợ lý của website "Emotion AI Analyzer".
      Bạn hãy truy cập vào file "app_context.md" bên dưới để trả lời các câu hỏi của người dùng.
      Bạn hãy đọc "Nguyên tắc Chatbot phải tuân thủ (Phiên bản mở rộng – có phản hồi ngoài phạm vi)" trong file đó kỹ càng trước khi trả lời.
      # NỘI DUNG DỰ ÁN (KB) BẮT ĐẦU
      {{KB_CONTENT_HERE}}
      # NỘI DUNG DỰ ÁN (KB) KẾT THÚC
      `.trim(),
    });

    const kbForThisQuestion = selectKB(APP_CONTEXT, last);
    const userPrompt = `
=== NỘI DUNG DỰ ÁN ===
${kbForThisQuestion}
=== HẾT NỘI DUNG DỰ ÁN ===

Câu hỏi:
"""${last}"""
`.trim();

    // ✅ Cách gọi ổn định với SDK mới
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    res.json({ text });
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err?.message || String(err) });
  }
});


// Lọc KB rất cơ bản — bạn có thể cải tiến sau
function selectKB(full, query) {
  try {
    const q = (query || '').toLowerCase();
    const blocks = full.split('\n\n### ');
    const hit = blocks.filter(b => b.toLowerCase().includes('sentiment')).join('\n\n');
    if (q.includes('vision')) {
      const v = blocks.filter(b => b.toLowerCase().includes('vision')).join('\n\n');
      if (v) return v;
    }
    return hit || blocks.slice(0, 2).join('\n\n');
  } catch {
    return full;
  }
}

// --- start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
