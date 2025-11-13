## ============ CONFIG =========
# 1. Tạo file trong frontend -> .env 
{
* VITE_API_URL=http://localhost:...

* VITE_CHAT_API=http://localhost:...
* VITE_CHAT_SHARED_SECRET=....              // cái này và cái "SHARED_SECRET" phải giống nhau
}

# 2. Tạo file trong server -> .env
{
* ALLOWED_ORIGINS=http://localhost:...
* PORT=...
* SHARED_SECRET=...                        // cái này và cái "VITE_CHAT_SHARED_SECRET" phải giống nhau
* GEMINI_API_KEY=....                      // api_key của m
* GEMINI_MODEL=...                         // tùy theo model của m
}

# 3. Nhớ config file package.json phù hợp với m
