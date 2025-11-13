// src/components/dashboard/TimelineCard.tsx
import { EmotionTimeline } from "@/components/EmotionTimeline";
import { EmotionResult } from "@/types/emotions";

export function TimelineCard({ results }: { results: EmotionResult[] }) {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <h3 className="text-xl font-bold mb-4">Emotion Timeline</h3>
      <EmotionTimeline emotionResults={results} />
    </div>
  );
}
