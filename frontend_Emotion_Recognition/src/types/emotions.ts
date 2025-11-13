export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'neutral'
  | 'fearful'
  | 'disgusted';

export type EmotionLabel =
  | "happy"
  | "sad"
  | "angry"
  | "surprised"
  | "neutral"
  | "fearful"
  | "disgusted";

export type DetectionType = 'facial' | 'vocal';

export interface EmotionResult {
  id: string;
  analysis_id: string;
  timestamp: number;
  emotion_type: EmotionType;
  confidence: number;
  detection_type: DetectionType;
  face_count: number;
  created_at: string;
}

export interface EmotionDistribution {
  [key: string]: number;
}

export interface AnalysisSummary {
  id: string;
  analysis_id: string;
  dominant_emotion: EmotionType | null;
  emotion_distribution: EmotionDistribution;
  average_confidence: number;
  total_frames_analyzed: number;
  duration: number;
  created_at: string;
}

export interface Analysis {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#22c55e',
  sad: '#3b82f6',
  angry: '#ef4444',
  surprised: '#f59e0b',
  neutral: '#6b7280',
  fearful: '#8b5cf6',
  disgusted: '#84cc16',
};

export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  surprised: 'Surprised',
  neutral: 'Neutral',
  fearful: 'Fearful',
  disgusted: 'Disgusted',
};
