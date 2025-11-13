// src/features/max-fusion-video/utils/mockData.ts

// 1 hàng điểm do model trả về
export type ModelScore = {
  label: string;
  score: number; // 0..1
  // 👇 thêm đúng kiểu object để chỗ khác đọc được
  by_modality?: {
    text?: number;
    audio?: number;
    vision?: number;
  };
};

export type TimelineItem = {
  t: number;
  text?: ModelScore;
  audio?: ModelScore;
  vision?: ModelScore;
  fused?: ModelScore;
};

// mock 15 điểm như bạn đang dùng
export function makeDemoTimeline(): TimelineItem[] {
  return Array.from({ length: 15 }, (_, i) => ({
    t: i,
    text: {
      label: i % 3 === 0 ? "Positive" : "Neutral",
      score: 0.4 + 0.6 * Math.abs(Math.sin(i / 3)),
    },
    audio: {
      label: "Neutral",
      score: 0.3 + 0.5 * Math.abs(Math.cos(i / 4)),
    },
    vision: {
      label: i % 2 === 0 ? "Happy" : "Neutral",
      score: 0.45 + 0.45 * Math.abs(Math.sin(i / 2)),
    },
    fused: {
      label: i % 2 === 0 ? "Happy" : "Neutral",
      score: 0.5 + 0.35 * Math.abs(Math.sin(i / 2)),
    },
  }));
}

// mock tổng thể
export function makeDemoOverall(): ModelScore {
  return {
    label: "Happy (Overall)",
    score: 0.78,
    by_modality: {
      text: 0.81,
      audio: 0.77,
      vision: 0.75,
    },
  };
}
