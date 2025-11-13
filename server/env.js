require('dotenv/config');

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const ENV = {
  GEMINI_API_KEY: required('GEMINI_API_KEY'),
  PORT: parseInt(process.env.PORT || '5174', 10),
  SHARED_SECRET: required('SHARED_SECRET'),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '')
    .split(',')               // nhớ .env dùng dấu phẩy
    .map(s => s.trim())
    .filter(Boolean),
};

module.exports = { ENV };
