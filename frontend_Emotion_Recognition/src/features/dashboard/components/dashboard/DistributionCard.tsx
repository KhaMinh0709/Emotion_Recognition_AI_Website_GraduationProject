// src/components/dashboard/DistributionCard.tsx
import { EmotionChart } from "@/components/EmotionChart";

type DistributionCardProps = {
  distribution: Record<string, number>;
  chartType: "pie" | "bar";
  onChangeType: (t: "pie" | "bar") => void;
};

export function DistributionCard({ distribution, chartType, onChangeType }: DistributionCardProps) {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Emotion Distribution</h3>
        <div className="rounded-xl bg-white/5 overflow-hidden ring-1 ring-inset ring-white/10">
          <button
            onClick={() => onChangeType("pie")}
            className={
              "px-3 py-1.5 text-sm transition " +
              (chartType === "pie"
                ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                : "hover:bg-white/10 text-gray-200")
            }
          >
            Pie
          </button>
          <button
            onClick={() => onChangeType("bar")}
            className={
              "px-3 py-1.5 text-sm transition " +
              (chartType === "bar"
                ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                : "hover:bg-white/10 text-gray-200")
            }
          >
            Bar
          </button>
        </div>
      </div>
      <EmotionChart emotionDistribution={distribution} chartType={chartType} />
    </div>
  );
}
