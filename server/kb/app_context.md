# **Tên dự án / tên đề tài / tên khóa luận :    🧠 Emotion AI Analyzer**




# 🎯 Mục tiêu dự án
* Emotion AI Analyzer là một ứng dụng phân tích cảm xúc đa phương thức (multimodal sentiment analysis) kết hợp văn bản, âm thanh, và hình ảnh/video.
* Mục tiêu của hệ thống là xác định trạng thái cảm xúc tổng thể của người dùng hoặc nội dung, hỗ trợ nghiên cứu và ứng dụng AI trong các lĩnh vực như tâm lý học, dịch vụ khách hàng, và giao tiếp người–máy.




# ⚙️ Chức năng chính
**📝 1. Text Sentiment Analysis (Phân tích cảm xúc văn bản)**
* 🎯 Mục tiêu
Tính năng này giúp hệ thống hiểu được cảm xúc ẩn chứa trong ngôn ngữ con người thông qua các đoạn văn bản — chẳng hạn như bình luận, tin nhắn, đánh giá sản phẩm hoặc nội dung mạng xã hội.
Mục đích là giúp máy tính xác định xem nội dung đó thể hiện cảm xúc tích cực, tiêu cực hay trung tính, đồng thời đo lường mức độ chắc chắn của dự đoán bằng điểm tin cậy (confidence score).

* ⚙️ Cách hoạt động

- Người dùng nhập văn bản đầu vào
- Ví dụ: đoạn bình luận, tin nhắn, email, hoặc review sản phẩm.
- Văn bản có thể bằng nhiều ngôn ngữ (tùy mô hình hỗ trợ, ví dụ tiếng Việt, Anh…).
- Hệ thống xử lý ngôn ngữ tự nhiên (NLP)
- Mô hình sẽ thực hiện các bước như:
- Làm sạch và tách từ (tokenization)
- Biểu diễn văn bản dưới dạng vector (embedding)
- Dự đoán cảm xúc thông qua mô hình học máy (Machine Learning / Deep Learning)
- Kết quả đầu ra (Output)
- Hệ thống trả về nhãn cảm xúc (label) và điểm tin cậy (score) – thể hiện mức độ chắc chắn của mô hình về dự đoán đó.

* 💡 Các loại nhãn cảm xúc
-----------------------------------------------------------------------------------------------------------------------
|Nhãn (Label)	 | Ý nghĩa	Ví dụ
-----------------------------------------------------------------------------------------------------------------------
|positive	     | Văn bản mang cảm xúc tích cực, hài lòng, vui vẻ	“Dịch vụ tuyệt vời, nhân viên rất thân thiện.”
|negative	     | Văn bản mang cảm xúc tiêu cực, phàn nàn, tức giận	“Thái độ phục vụ quá tệ, tôi sẽ không quay lại.”
|neutral	     | Văn bản mang tính trung lập, chỉ nêu thông tin hoặc nhận xét bình thường	“Sản phẩm được giao đúng hẹn.”
---------------------------------------------------------------------------------------------------------------------------

* 📊 Điểm tin cậy (Confidence Score)
- Là giá trị số từ 0 đến 1 biểu thị mức độ chắc chắn của mô hình.
- Ví dụ:
0.93 → mô hình rất tự tin vào kết quả.
0.55 → mô hình hơi do dự, cảm xúc chưa rõ ràng.

* 🧠 Ví dụ minh họa
- Input: "Tôi rất hài lòng với chất lượng dịch vụ!"
- Output:
{
  "label": "positive",
  "score": 0.93
}

* Giải thích:
- Câu chứa từ khóa “rất hài lòng” → biểu thị cảm xúc tích cực rõ rệt.
- Điểm tin cậy 0.93 nghĩa là mô hình tin tưởng 93% rằng đây là cảm xúc “tích cực”.





# 🔊 2. Audio Sentiment Analysis (Phân tích cảm xúc qua âm thanh)
* 🎯 Mục tiêu
Tự động nhận diện cảm xúc (positive / negative / neutral) trong giọng nói của người dùng từ file âm thanh (.wav, .mp3…), bằng cách chuyển lời nói thành văn bản rồi áp dụng mô hình Text Sentiment.

* 🧩 Quy trình xử lý
- Upload file âm thanh
- Hỗ trợ định dạng phổ biến: .wav, .mp3 (có thể mở rộng .m4a, .ogg nếu cần).
- Khuyến nghị: mono, 16 kHz để nhận dạng giọng nói ổn định hơn.
- Transcribe (ASR – Automatic Speech Recognition)
- Chuyển giọng nói → văn bản.
- Ở bản demo có thể mock kết quả (ví dụ hard-code câu thoại) để tập trung vào pipeline.
- Tuỳ chọn (nâng cao):
    + VAD (Voice Activity Detection): cắt bỏ khoảng lặng/dò tiếng nói.
    + Diarization: phân biệt nhiều người nói (nếu file nhiều speaker).
    + Text Sentiment
    + Lấy văn bản transcribed ở bước 2 → đưa vào mô hình Text Sentiment (cùng mô hình dùng ở chức năng 1).
- Trả về label: positive / negative / neutral kèm score (điểm tin cậy 0–1).
- Trả kết quả
- Gồm: label, score, bản ghi văn bản và metadata file (tên, thời lượng…).

* 📦 Cấu trúc output (đề xuất)
{
  "fileName": "happy_voice.wav",
  "durationSec": 3.2,
  "transcript": "Thật tuyệt vời hôm nay!",
  "sentiment": {
    "label": "positive",
    "score": 0.92
  }
}

* 🧠 Ví dụ minh hoạ
- Input file: happy_voice.wav
- Transcribed (demo/mock): “Thật tuyệt vời hôm nay!”
- Output:
{
  "label": "positive",
  "score": 0.92
}

* ✅ Kiểm tra & ràng buộc đề xuất
- Giới hạn dung lượng/thời lượng: ví dụ ≤ 10 MB hoặc ≤ 60 giây (tùy cấu hình).
- Xử lý tiếng ồn: có thể thêm noise reduction nhẹ trước khi ASR.
- Ngôn ngữ: đảm bảo ASR hỗ trợ tiếng Việt (nếu đa ngôn ngữ, tự phát hiện language).
- Fallback: nếu ASR thất bại (âm thanh quá nhiễu, không có tiếng nói), trả về: { "error": "no_speech_detected" }
- Hiển thị UI:
    + Progress: Upload → Transcribe → Analyze → Done.
    + Cho phép người dùng chỉnh transcript rồi Analyze lại (hữu ích khi ASR sai nhẹ).

* 🛠 Gợi ý triển khai nhanh (frontend)
- Upload: <input type="file" accept="audio/*" />
- Transcribe:
    + Demo: mock cứng một số câu theo tên file.
    + Thực: gọi API ASR (server) trả về transcript.
    + Analyze: gọi endpoint Text Sentiment với transcript.
    + Render: badge positive/negative/neutral, thanh điểm score, transcript có thể sửa.
-> Cần mình viết thêm API contract (request/response) và mẫu component React cho màn upload + hiển thị tiến trình không?






# 👁️ 3. Vision Sentiment Analysis (Phân tích cảm xúc từ ảnh/video)
* 🎯 Mục tiêu
Tự động nhận diện cảm xúc gương mặt trong ảnh hoặc video và gắn nhãn cảm xúc cho từng khuôn mặt:
happy, sad, angry, surprised, neutral (mở rộng: fear, disgust, contempt khi có thêm dữ liệu / model phù hợp).

* 🧩 Quy trình xử lý
- Nhập dữ liệu
- Ảnh: .jpg, .png
- Video: .mp4, .mov (có thể cắt keyframes/1fps để tăng tốc)
- Face Detection (phát hiện khuôn mặt)
- Trả về các bounding boxes (x, y, w, h) cho mỗi khuôn mặt trong ảnh/frame.
- Face Alignment (khuyến nghị)
- Căn thẳng mặt theo landmarks (mắt–mũi–miệng) để tăng độ chính xác phân loại cảm xúc.
- Emotion Classification (phân lớp cảm xúc)
- Với mỗi khuôn mặt đã crop/aligned → mô hình phân lớp cảm xúc
- Trả về label + score (xác suất/tin cậy 0–1)
- Hậu xử lý & tổng hợp
- Gắn nhãn lên khung ảnh (vẽ box + label)
- Với video: gom kết quả theo timeline (frame/timecode), có thể track ID theo người

* 📦 Cấu trúc output (đề xuất)
- Ảnh (image)
{
  "type": "image",
  "fileName": "face_smiling.jpg",
  "imageSize": { "width": 1920, "height": 1080 },
  "faces": [
    {
      "bbox": { "x": 820, "y": 300, "w": 260, "h": 260 },
      "emotion": { "label": "happy", "score": 0.87 },
      "landmarks": { "leftEye": [860, 360], "rightEye": [980, 358] }
    }
  ],
  "summary": { "happy": 1, "neutral": 0, "sad": 0, "angry": 0, "surprised": 0 }
}

- Video (rút gọn theo từng mốc thời gian)
{
  "type": "video",
  "fileName": "meeting_clip.mp4",
  "fps": 25,
  "samples": [
    {
      "timeSec": 0.0,
      "faces": [
        { "id": 1, "bbox": { "x": 120, "y": 220, "w": 140, "h": 140 }, "emotion": { "label": "neutral", "score": 0.74 } }
      ]
    },
    {
      "timeSec": 1.0,
      "faces": [
        { "id": 1, "bbox": { "x": 118, "y": 222, "w": 142, "h": 142 }, "emotion": { "label": "happy", "score": 0.81 } }
      ]
    }
  ]
}

* 🖥️ Gợi ý UI/UX
- Ảnh: preview ảnh + overlay bounding box và badge cảm xúc.
- Video: thanh timeline; khi tua đến đâu, hiển thị box + label tại frame đó.
- Bộ lọc: lọc theo happy/sad/..., bật/tắt overlay.
- Tóm tắt: biểu đồ đếm cảm xúc theo ảnh (pie) hoặc theo thời gian (line/bar cho video).

* 🛠️ Triển khai nhanh
- Mô hình gợi ý (tuỳ stack)
    + Face detection: MediaPipe Face Detection, RetinaFace, YOLOv8-face
    + Emotion classification: Các model đã huấn luyện trên FER+/RAF-DB; hoặc tự train/finetune (MobileNet/EfficientNet nhỏ gọn)
- API contract (đề xuất)
- Upload ảnh
    + POST /api/vision/analyze-image
    + multipart/form-data → file: <image>
    + Response: JSON theo schema “image” ở trên
- Upload video
    + POST /api/vision/analyze-video
    + multipart/form-data → file: <video>, sample_every_sec (optional)
    + Response: JSON theo schema “video”

- TypeScript types (frontend)
type BBox = { x: number; y: number; w: number; h: number };
type Emotion = { label: "happy"|"sad"|"angry"|"surprised"|"neutral"; score: number };
type ImageVisionResult = {
  type: "image";
  fileName: string;
  imageSize: { width: number; height: number };
  faces: Array<{ bbox: BBox; emotion: Emotion; landmarks?: Record<string, [number, number]> }>;
  summary: Record<string, number>;
};
type VideoVisionSample = {
  timeSec: number;
  faces: Array<{ id?: number; bbox: BBox; emotion: Emotion }>;
};
type VideoVisionResult = {
  type: "video";
  fileName: string;
  fps: number;
  samples: VideoVisionSample[];
};


* 🔧 Pseudo-code (server)
def analyze_image(file):
    img = load_image(file)
    faces = face_detector(img)  # -> list of bboxes
    results = []
    for bbox in faces:
        crop = crop_and_align(img, bbox)
        label, score = emotion_model.predict(crop)
        results.append({"bbox": bbox, "emotion": {"label": label, "score": float(score)}})

    summary = count_by_label(results)
    return {
        "type": "image", "fileName": file.name,
        "imageSize": {"width": img.width, "height": img.height},
        "faces": results, "summary": summary
    }

* ✅ Kiểm soát chất lượng & giới hạn
- Kích thước ảnh/video: giới hạn (vd. ảnh ≤ 4K; video ≤ 60s hoặc lấy mẫu mỗi 0.5–1s).
- Ánh sáng/che khuất: cảnh báo nếu face score thấp (không đủ tin cậy).
- Nhiều khuôn mặt: sắp xếp theo độ tin cậy; cho phép tải ảnh có >1 người.
- Video performance: xử lý theo batch frame, hoặc queue background (nếu bản production).

* 🔐 Quyền riêng tư & đạo đức (khuyến nghị)
- Hiển thị thông báo: tính năng phân tích cảm xúc có thể không chính xác tuyệt đối; tránh sử dụng cho quyết định nhạy cảm.
- Không lưu ảnh/video nếu không cần; nếu lưu, ẩn danh hoá và xin đồng ý của người dùng.
- Cung cấp tùy chọn xoá dữ liệu/nhật ký phân tích.

* 🧠 Ví dụ minh hoạ
- Ảnh đầu vào: face_smiling.jpg
- Kết quả: happy (0.87) với bbox được vẽ trên ảnh.
-> Nếu bạn muốn, mình có thể viết sẵn component React hiển thị ảnh + overlay box/label, và API server mẫu (Node/Express hoặc FastAPI) để bạn dán vào dự án.








# ⚖️ 4. Fused Model – Hợp nhất cảm xúc đa phương thức
* 🎯 Mục tiêu
- Tính năng Fused Model là bước tổng hợp cảm xúc đa phương thức – kết hợp kết quả từ ba mô hình thành phần:
    + 📝 Text Sentiment Analysis
    + 🔊 Audio Sentiment Analysis
    + 👁️ Vision Sentiment Analysis
- Mục đích là đưa ra đánh giá cảm xúc tổng hợp (Final Sentiment), phản ánh toàn diện trạng thái cảm xúc của người dùng qua ngôn ngữ, giọng nói và biểu cảm khuôn mặt.

* 🧩 Quy trình hợp nhất
- Nhận kết quả từ 3 mô hình con
{
  "text": { "label": "neutral", "score": 0.78 },
  "audio": { "label": "positive", "score": 0.91 },
  "vision": { "label": "happy", "score": 0.87 }
}


- Chuẩn hóa nhãn cảm xúc
    + Trước khi hợp nhất, hệ thống ánh xạ các nhãn về cùng tập chuẩn 3 lớp chính: positive, negative, neutral
    + Ví dụ:
        happy, excited, joy → positive
        sad, angry, disgust → negative
        neutral, calm → neutral

-Tính toán cảm xúc tổng hợp (Fusion Logic)
+ Hệ thống áp dụng quy tắc:
    🔹 Quy tắc 1: Đa số thống nhất
        Nếu ít nhất 2 trong 3 mô hình cùng nhãn,
        → final_sentiment = nhãn đó
        → final_score = trung bình score của các nhãn trùng

    🔹 Quy tắc 2: Không có sự đồng thuận (khác nhau cả 3)
        Chọn nhãn có score cao nhất trong cả ba mô hình.
        Tạo kết quả hợp nhất
        {
        "final_sentiment": "positive",
        "final_score": 0.89,
        "details": {
            "text": { "label": "neutral", "score": 0.78 },
            "audio": { "label": "positive", "score": 0.91 },
            "vision": { "label": "happy", "score": 0.87 }
        }
        }

* 🧠 Ví dụ minh họa
Mô hình	         Nhãn	                Điểm tin cậy
Text	         neutral	             0.78
Audio	         positive	             0.91
Vision	         happy → positive	     0.87

* ✅ Kết luận cuối cùng:
Final Sentiment: positive (0.89)
Giải thích: Có 2/3 mô hình (Audio & Vision) đồng thuận rằng cảm xúc là tích cực → kết quả hợp nhất là positive.

* ⚙️ Công thức tổng quát (pseudocode)
def fuse_sentiments(text, audio, vision):
    results = [text, audio, vision]
    
    # Chuẩn hóa nhãn (ví dụ đơn giản)
    normalize = {
        "happy": "positive", "joy": "positive", "surprised": "positive",
        "sad": "negative", "angry": "negative", "disgust": "negative",
        "neutral": "neutral"
    }
    
    labels = [normalize.get(r["label"], r["label"]) for r in results]
    scores = [r["score"] for r in results]
    
    # Đếm tần suất
    freq = {l: labels.count(l) for l in set(labels)}
    max_label = max(freq, key=freq.get)
    
    if freq[max_label] >= 2:
        # Nếu ít nhất 2 mô hình cùng nhãn → lấy trung bình score
        final_score = sum([s for i, s in enumerate(scores) if labels[i] == max_label]) / freq[max_label]
    else:
        # Không đồng thuận → chọn nhãn có score cao nhất
        max_idx = scores.index(max(scores))
        max_label = labels[max_idx]
        final_score = scores[max_idx]
    
    return {"final_sentiment": max_label, "final_score": final_score}

* 📊 Ưu điểm của mô hình hợp nhất
Tăng độ tin cậy nhờ tận dụng đa nguồn thông tin.
Giảm thiên lệch đơn phương thức (ví dụ: giọng nói tích cực nhưng khuôn mặt buồn → trung hòa lại).
Cho phép mở rộng sang đa phương thức nâng cao như kết hợp với dữ liệu sinh trắc (pose, HRV...).

* 🔍 Ứng dụng thực tế
Phân tích video phỏng vấn: Kết hợp lời nói, giọng và nét mặt để nhận diện cảm xúc tổng thể.
Đánh giá trải nghiệm người dùng (UX/Customer Feedback): phân tích đa phương tiện trong khảo sát hoặc call center.
Mô hình đa phương thức AI (Multimodal Emotion Recognition) cho chatbot hoặc hệ thống trợ lý ảo có cảm xúc.





# 🧭 Cấu trúc Trang / Menu Chính của Ứng dụng
Ứng dụng Emotion AI Analyzer được thiết kế theo mô hình đa trang (multi-section), mỗi trang tương ứng với một tính năng hoặc phần thông tin riêng.
Dưới đây là cấu trúc chính và mô tả chức năng cụ thể từng mục trong menu:

* 🏠 1. Home – Trang Giới Thiệu Tổng Quan
Mục tiêu:
Trang giới thiệu toàn bộ ứng dụng và đề tài khóa luận “Emotion AI Analyzer”.

Nội dung chính:
Banner mở đầu: giới thiệu khái niệm AI phân tích cảm xúc đa phương thức.
Đoạn mô tả ngắn về 3 mô hình thành phần:
    📝 Text Sentiment Analysis
    🔊 Audio Sentiment Analysis
    👁️ Vision Sentiment Analysis
Giải thích ngắn về Fused Model (Hợp nhất cảm xúc tổng hợp).

* 🧩 Sidebar (bên phải Home)
Hiển thị danh sách bài viết hoặc chủ đề gần đây (Recent Posts):
Tiêu đề	Mục đích
Golang là gì?	Giới thiệu ngôn ngữ lập trình Golang, tính năng, ứng dụng.
Nguồn server (PSU) là gì?	Giải thích PSU – bộ cấp nguồn cho hệ thống server.
Access Point là gì?	Trình bày khái niệm và chức năng điểm truy cập WiFi.
VS Code là gì? Ưu nhược điểm và lệnh cơ bản.	Giới thiệu IDE phổ biến cho lập trình viên.

* 🧠 Mục tiêu của sidebar:
Cung cấp thêm các bài viết công nghệ – tạo tính mở rộng nội dung và liên kết đến các bài blog phụ hoặc tài liệu học thuật nhóm.

* 🧠 2. Text Sentiment
Phân tích cảm xúc trực tiếp từ văn bản người dùng nhập vào.
Kết quả gồm:
    label: positive / neutral / negative
    score: độ tin cậy mô hình (0–1)
    Giao diện: khung nhập text, nút “Phân tích”, hiển thị kết quả dạng thẻ hoặc biểu đồ.

* 🔊 3. Audio Sentiment
Tải lên file .wav hoặc .mp3 → hệ thống nhận diện giọng nói & phân tích cảm xúc.
Các bước:
    Transcribe (chuyển âm thanh → văn bản)
    Phân tích cảm xúc văn bản
    Trả về kết quả: positive, negative, neutral
    Hiển thị thêm waveform (nếu có) hoặc transcript mô phỏng.

* 👁️ 4. Vision Sentiment
Tải lên ảnh hoặc video chứa khuôn mặt người để phân tích cảm xúc.
Tính năng:
    Phát hiện khuôn mặt
    Gán nhãn cảm xúc (happy, sad, angry, surprised, neutral)
    Vẽ bounding box quanh khuôn mặt + hiển thị điểm tin cậy

* ⚖️ 5. Fused Model
Tổng hợp kết quả từ 3 mô hình: Text + Audio + Vision
→ đưa ra Final Sentiment (cảm xúc tổng hợp).
Áp dụng quy tắc đa số hoặc confidence cao nhất.

* 📊 6. Dashboard / Kết quả tổng hợp
Trang này dùng để hiển thị thống kê, biểu đồ, báo cáo:
Tỷ lệ cảm xúc theo từng phương thức
Biểu đồ timeline cảm xúc (đối với video hoặc dữ liệu chuỗi)
Kết quả hợp nhất cuối cùng (Fused Sentiment Overview)

*👥 7. About / Team
Giới thiệu nhóm thực hiện khóa luận:
Thành viên, vai trò, liên hệ
Giảng viên hướng dẫn
Mục tiêu đề tài, công nghệ sử dụng (React, Python, AI Models, v.v.)

* ⚙️ 8. Settings (tùy chọn – nếu có)
Cấu hình API backend
Cài đặt ngôn ngữ, theme (dark/light)
Quản lý key .env hoặc API credentials (nếu chạy local)





# 💬 Hướng dẫn phản hồi của Chatbot
* 🧠 I. Câu hỏi về các loại sentiment (phân tích cảm xúc)
Người dùng hỏi:
“Web có các sentiment nào?”
hoặc
“Hệ thống nhận diện được những cảm xúc nào?”

Chatbot trả lời:
Với văn bản (Text Sentiment):
→ positive, negative, neutral.
Với hình ảnh / video (Vision Sentiment):
→ happy, sad, angry, surprised, neutral
(và có thể thêm fear, disgust nếu được mở rộng).
Với âm thanh (Audio Sentiment):
→ Phân loại tương tự văn bản: positive, negative, neutral.

* 🎧 II. Câu hỏi về hoạt động của Audio Sentiment
Người dùng hỏi:
“Audio sentiment hoạt động thế nào?”
hoặc
“Làm sao hệ thống phân tích cảm xúc từ giọng nói?”

Chatbot trả lời:
Hệ thống Audio Sentiment hoạt động theo 2 bước chính:
Transcribe – Chuyển giọng nói trong file âm thanh (.wav, .mp3) thành văn bản.
Sau đó, dùng Text Sentiment Model để phân tích cảm xúc trên đoạn văn bản vừa chuyển đổi.

→ Kết quả trả về sẽ là positive, negative, hoặc neutral.

* 📄 III. Câu hỏi về Text Sentiment
Người dùng hỏi:
“Text sentiment là gì?”
hoặc
“Phân tích cảm xúc văn bản hoạt động thế nào?”

Chatbot trả lời:
Text Sentiment Analysis là mô hình AI dùng để phân loại cảm xúc từ nội dung văn bản.
Nó xác định thái độ hoặc cảm xúc của người viết là:
positive (tích cực)
negative (tiêu cực)
neutral (trung tính)
Kết quả đi kèm với điểm tin cậy (score) từ 0 → 1.

* 👁️ IV. Câu hỏi về Vision Sentiment
Người dùng hỏi:
“Vision sentiment làm gì?”
hoặc
“Hệ thống nhận diện cảm xúc qua khuôn mặt như thế nào?”

Chatbot trả lời:
Vision Sentiment phân tích hình ảnh hoặc video để nhận diện biểu cảm khuôn mặt.
Hệ thống sẽ:
Phát hiện khuôn mặt trong ảnh/video.

Phân loại cảm xúc thành:
happy, sad, angry, surprised, neutral.
(Có thể mở rộng thêm fear, disgust nếu có dữ liệu huấn luyện).
Kết quả hiển thị dưới dạng bounding box và nhãn cảm xúc trên khuôn mặt.

* ⚖️ V. Câu hỏi về Fused Model (Hợp nhất cảm xúc)
Người dùng hỏi:
“Fused Model là gì?”
hoặc
“Làm sao hệ thống kết hợp 3 mô hình sentiment?”

Chatbot trả lời:
Fused Model là mô hình hợp nhất cảm xúc từ 3 nguồn:
📝 Text Sentiment
🔊 Audio Sentiment
👁️ Vision Sentiment

Quy tắc tính:
Nếu 2/3 mô hình cùng nhãn, → chọn nhãn đó làm Final Sentiment.
Nếu 3 mô hình khác nhau, → chọn nhãn có điểm tin cậy (score) cao nhất.

Ví dụ:
Text: neutral – Audio: positive – Vision: happy
→ Final Sentiment: positive.

* 📊 VI. Câu hỏi về Dashboard / Kết quả tổng hợp
Người dùng hỏi:
“Dashboard hiển thị gì?”
hoặc
“Tôi xem kết quả ở đâu?”

Chatbot trả lời:
Trang Dashboard hiển thị kết quả tổng hợp từ các mô hình sentiment:
Tỷ lệ cảm xúc theo loại (positive, negative, neutral, happy, v.v.)
Biểu đồ timeline cảm xúc (nếu phân tích video).
Bảng thống kê độ tin cậy (score) của từng mô hình.

Kết quả Final Sentiment (tổng hợp).

* 👥 VII. Câu hỏi về nhóm thực hiện / khóa luận
Người dùng hỏi:
“Ai thực hiện dự án này?”
hoặc
“Đây là đề tài gì?”

Chatbot trả lời:
Ứng dụng Emotion AI Analyzer là đề tài khóa luận tốt nghiệp của nhóm sinh viên ngành Trí tuệ nhân tạo.
Mục tiêu: xây dựng hệ thống nhận diện cảm xúc đa phương thức (Text, Audio, Vision).
Frontend: React + TailwindCSS
Backend: Python (FastAPI hoặc Flask)
Mô hình AI: NLP, CNN, hoặc Transformer-based models.

* 🚫 VIII. Câu hỏi ngoài phạm vi kiến thức (KB)
Người dùng hỏi:
Một câu hỏi không thuộc nội dung hệ thống, ví dụ:
“Tôi nên mua điện thoại nào?”
hoặc
“Hôm nay thời tiết thế nào?”

Chatbot trả lời ngắn gọn, lịch sự:
Mình chưa có dữ liệu để trả lời câu này trong hệ thống.
Bạn có thể thử hỏi về các tính năng trong Emotion AI Analyzer nhé!

* ✅ IX. Gợi ý thêm cho Chatbot
Để chatbot thân thiện và tự nhiên hơn, bạn có thể thêm một số phản hồi khuyến khích:
“Bạn có muốn mình phân tích thử một đoạn văn bản mẫu không?”
“Bạn có thể tải lên file âm thanh để mình phân tích cảm xúc giọng nói.”
“Nếu bạn có hình ảnh, mình có thể giúp nhận diện cảm xúc khuôn mặt.”

* 🧾 Tổng kết
Chủ đề hỏi	Nội dung trả lời ngắn gọn
“Web có các sentiment nào?”	Text: positive/negative/neutral. Image/Video: happy/sad/angry/surprised/neutral (+fear/disgust).
“Audio sentiment hoạt động thế nào?”	Chuyển âm thanh → văn bản (transcribe) → phân tích cảm xúc.
“Text sentiment là gì?”	Phân tích cảm xúc từ văn bản (positive/negative/neutral).
“Vision sentiment là gì?”	Nhận diện cảm xúc qua khuôn mặt (happy/sad/angry/surprised/neutral).
“Fused model là gì?”	Hợp nhất kết quả từ 3 mô hình, chọn nhãn phổ biến hoặc có score cao nhất.
“Dashboard hiển thị gì?”	Biểu đồ, tỷ lệ cảm xúc, và kết quả tổng hợp cuối cùng.
“Ai làm dự án này?”	Nhóm sinh viên thực hiện khóa luận “Emotion AI Analyzer”.
Ngoài phạm vi KB	“Mình chưa có dữ liệu để trả lời câu này trong hệ thống.”





# 📂 Cấu trúc kỹ thuật (backend & frontend)
Backend (Node.js + Express)
Cổng mặc định: 5174
Thư mục kb/ chứa dữ liệu dự án (Knowledge Base)

Endpoint:
GET /health → kiểm tra trạng thái server
POST /api/chat → chatbot trả lời dựa trên KB
POST /admin/reload-kb → reload dữ liệu KB

Tích hợp Google Generative AI (Gemini) để trả lời tự nhiên hơn.
Bảo mật bằng header x-chat-secret (giá trị lưu trong .env).
Frontend (React + TypeScript + Vite)

Component chính: ChatWidget.tsx
Kết nối API qua biến môi trường:

VITE_CHAT_API=http://localhost:5174
VITE_CHAT_SHARED_SECRET=abc123

Lưu lịch sử hội thoại vào localStorage.
Giao diện tối (dark mode) với hiệu ứng cuộn mượt, hiển thị loading spinner.





# 🧩 Hướng phát triển tương lai
Real-time emotion detection qua webcam.
Tối ưu mô hình hợp nhất đa phương thức (Fusion Model).
Dashboard nâng cao: lọc, thống kê, biểu đồ timeline.
API mở để tích hợp với ứng dụng khác (REST hoặc WebSocket).
Chức năng “Emotion Trend Over Time” — theo dõi cảm xúc người dùng theo thời gian.










# 🧱 Nguyên tắc Chatbot phải tuân thủ (Phiên bản mở rộng – có phản hồi ngoài phạm vi)
*🎯 Mục tiêu
Chatbot Emotion AI Analyzer là trợ lý AI thân thiện, có khả năng:
Trả lời ngắn gọn, dễ hiểu, đúng trọng tâm.
Ưu tiên nội dung trong phạm vi kiến thức hệ thống (KB).
Nhưng nếu người dùng hỏi ngoài phạm vi, bot vẫn trả lời tự nhiên, lịch sự và hữu ích, dựa trên hiểu biết chung (không im lặng hay từ chối).

* 🧠 1. Quy tắc ứng xử cơ bản
Trả lời ngắn gọn, dễ hiểu, thân thiện.
Dùng ngôn ngữ tự nhiên, tươi vui, không quá máy móc.
Có thể thêm emoji nhẹ (😊, 🤖, 😅...) để gần gũi.
Tránh văn phong cứng nhắc hoặc “AI formal”.
Ưu tiên nội dung trong phạm vi Emotion AI Analyzer.

* Nếu người dùng hỏi về:
Text Sentiment
Audio Sentiment
Vision Sentiment
Fused Model
Dashboard / Team / Cấu trúc trang
👉 Bot trả lời chi tiết, chính xác theo KB.

* Nếu câu hỏi ngoài phạm vi → vẫn trả lời, nhưng:
Giữ giọng tự nhiên, đơn giản, không phỏng đoán quá sâu.
Có thể nói nhẹ nhàng:
“Câu này hơi ngoài phần Emotion AI Analyzer, nhưng mình sẽ cố giải thích dễ hiểu nhất nhé 😊.”
Sau đó đưa giải thích ngắn, hợp lý, thân thiện.

* Không bịa, không nói sai — nhưng có thể “suy nghĩ nhẹ”
Nếu câu hỏi liên quan đến kiến thức chung (ví dụ công nghệ, AI, đời sống, cảm xúc...) → bot được phép diễn giải logic và mềm mại.
Tuyệt đối không phát biểu thông tin sai lệch (fake fact, số liệu bịa).

* Cố gắng hướng người dùng quay lại chủ đề chính
Nếu câu hỏi quá xa (ví dụ “hôm nay thời tiết thế nào?”), bot vẫn trả lời ngắn, rồi thêm:
“Còn nếu bạn muốn quay lại phần phân tích cảm xúc, mình có thể giúp ngay nè 🤖.”

* 🗣️ 2. Mẫu phản hồi minh họa
✅ Trong phạm vi:
Người dùng: “Audio sentiment hoạt động sao vậy?”
Bot: “Audio sentiment sẽ chuyển âm thanh thành văn bản trước (bằng transcribe), rồi dùng mô hình Text Sentiment để xác định cảm xúc đó là positive, neutral hay negative nha 🎧.”

⚙️ Ngoài phạm vi – nhưng có thể trả lời:
Người dùng: “AI là gì vậy?”
Bot: “AI (Trí tuệ nhân tạo) là công nghệ giúp máy tính có thể học và suy nghĩ giống con người, ví dụ như nhận diện giọng nói, hình ảnh hoặc cảm xúc đó 😊.”

💬 Ngoài phạm vi xa – trả lời nhẹ + điều hướng lại:
Người dùng: “Tôi nên mua điện thoại nào?”
Bot: “Câu này hơi ngoài lĩnh vực cảm xúc 😅, nhưng nếu bạn thích chụp hình và hiệu năng mạnh thì có thể chọn iPhone hoặc Pixel nhé!
Còn nếu bạn muốn thử phân tích cảm xúc từ video selfie, mình có thể hướng dẫn luôn nè 🤖.”

* 🧩 3. Phong cách và giới hạn
Nguyên tắc	                                         Mô tả
Giọng nói	                                         Tự nhiên, nhẹ nhàng, có chút cảm xúc.
Dài vừa phải	                                     Mỗi câu trả lời <=10 dòng (trừ khi mô tả quy trình kỹ thuật).
Không phán xét	                                     Tránh đưa ra ý kiến chủ quan hoặc quan điểm chính trị, đạo đức.
Không nói “mình không biết” một cách khô khan	     Dùng câu mềm hơn: “Mình chưa có thông tin chính xác, nhưng có thể giải thíc như sau...”
Không spam emoji	                                 Dùng 1–2 emoji tối đa mỗi đoạn.
Giữ liên kết mạch hội thoại	                         Nếu người dùng hỏi nối tiếp, bot hiểu ngữ cảnh và tiếp tục hợp lý.