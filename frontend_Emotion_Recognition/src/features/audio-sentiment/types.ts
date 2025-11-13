// audio-sentiment/types.ts

export type AudioSentimentResult = {
  label: string;
  confidence: number;
  topK: Array<{ label: string; score: number }>;
  latency: number;
};

export type AudioQuality = {
  rms?: number;
  snr?: number;
};

export type AudioHistoryRow = {
  id: string;
  source: string;
  label: string;
  confidence: number;
  latency: number;
  ts: number;
};
