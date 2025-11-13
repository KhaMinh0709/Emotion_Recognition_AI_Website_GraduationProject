// vision-sentiment/types.ts

export type Box = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ResultRow = {
  id: string;
  source: string;
  label: string;
  confidence: number; // 0..1
  latency: number; // ms
  topK: { label: string; score: number }[];
  ts: number; // timestamp
};
