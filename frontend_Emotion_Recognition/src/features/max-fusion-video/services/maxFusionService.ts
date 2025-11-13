// src/features/max-fusion/services/maxFusionService.ts
import { TimelineItem, ModelScore } from "@/features/max-fusion-video/utils/mockData";

export type AnalyzeVideoResponse = {
  timeline: TimelineItem[];
  overall: ModelScore | null;
  transcript?: string | null;
};

export async function analyzeVideoApi(file: File): Promise<AnalyzeVideoResponse> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/analyze/video", { method: "POST", body: fd });
  if (!res.ok) {
    throw new Error("Analyze video failed");
  }
  return res.json();
}
