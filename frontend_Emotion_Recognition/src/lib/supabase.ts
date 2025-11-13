// src/types/emotions.ts

/** Danh sách emotion cố định (dùng cho select, legend, validate…) */
export const EMOTIONS = [
  "happy",
  "sad",
  "angry",
  "surprised",
  "neutral",
  "fearful",
  "disgusted",
] as const;

export type EmotionType = typeof EMOTIONS[number];
export type DetectionType = "facial" | "vocal";

/** Bản ghi kết quả phát hiện cảm xúc (1 mốc thời gian) */
export interface EmotionResult {
  id: string;
  analysis_id: string;
  /** Thời gian (giây) từ đầu media, có thể là số thực */
  timestamp: number;
  emotion_type: EmotionType;
  /** [0,1] */
  confidence: number;
  detection_type: DetectionType;
  /** Số khuôn mặt phát hiện được ở frame này (nếu có) */
  face_count: number;
  created_at: string;
}

/** Phân phối cảm xúc tổng hợp */
export type EmotionDistribution = Partial<Record<EmotionType, number>> & {
  // Cho phép key khác (nếu backend mở rộng)
  [key: string]: number | undefined;
};

/** Tổng hợp một lần phân tích */
export interface AnalysisSummary {
  id: string;
  analysis_id: string;
  dominant_emotion: EmotionType | null;
  emotion_distribution: EmotionDistribution;
  /** trung bình confidence [0,1] */
  average_confidence: number;
  /** tổng số frame/điểm đã phân tích */
  total_frames_analyzed: number;
  /** độ dài media (giây) */
  duration: number;
  created_at: string;
}

/** Phiên phân tích (đầu vào media) */
export interface Analysis {
  id: string;
  file_name: string;
  file_type: string; // ví dụ "video/mp4", "audio/wav"
  file_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}

/** Màu sắc cho từng cảm xúc (dùng cho Recharts / Legend) */
export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: "#22c55e",     // green
  sad: "#3b82f6",       // blue
  angry: "#ef4444",     // red
  surprised: "#f59e0b", // amber
  neutral: "#6b7280",   // gray
  fearful: "#8b5cf6",   // violet
  disgusted: "#84cc16", // lime
};

/** Nhãn hiển thị cho UI */
export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  neutral: "Neutral",
  fearful: "Fearful",
  disgusted: "Disgusted",
};

/** (Tuỳ chọn) Kiểu data cho Timeline (gộp theo từng giây) */
export interface EmotionTimelinePoint {
  /** mốc thời gian (giây, đã làm tròn/gộp) */
  time: number;
  /** score cho từng emotion tại mốc này */
  values: Partial<Record<EmotionType, number>>;
}

/** Helper: kiểm tra string có phải EmotionType hợp lệ không */
export function isEmotionType(x: string): x is EmotionType {
  return (EMOTIONS as readonly string[]).includes(x);
}
