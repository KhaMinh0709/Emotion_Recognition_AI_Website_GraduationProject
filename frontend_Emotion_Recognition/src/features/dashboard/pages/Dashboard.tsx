import { useEffect, useMemo, useState } from "react";
import { generateMockData } from "../services/mockAnalysis";
import { EmotionSummaryCard } from "../../../components/EmotionSummaryCard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DistributionCard } from "../components/dashboard/DistributionCard";
import { TimelineCard } from "../components/dashboard/TimelineCard";
import { DetectionTable } from "../components/dashboard/DetectionTable";
import { DetectionDetailModal } from "../components/dashboard/DetectionDetailModal";
import { DashboardSkeleton } from "../components/dashboard/Skeletons";
import { Analysis, AnalysisSummary, EmotionResult } from "../../../types/emotions";
import { DashboardStyles } from "../styles/DashboardStyles";

export default function Dashboard() {
  const [mockData, setMockData] = useState<{
    analysis: Analysis;
    summary: AnalysisSummary;
    results: EmotionResult[];
  } | null>(null);

  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [selected, setSelected] = useState<EmotionResult | null>(null);

  // load data giả
  useEffect(() => {
    const t = setTimeout(() => setMockData(generateMockData()), 300);
    return () => clearTimeout(t);
  }, []);

  // ESC đóng modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ⚠️ luôn tạo biến từ mockData trước
  const summary = mockData?.summary ?? null;
  const results = mockData?.results ?? [];

  // ⚠️ luôn gọi useMemo trước khi return
  const windowResults = useMemo(() => {
    if (!selected || results.length === 0) return [];
    const start = selected.timestamp - 1.5;
    const end = selected.timestamp + 1.5;
    return results.filter((r) => r.timestamp >= start && r.timestamp <= end);
  }, [selected, results]);

  // ⬇️ bây giờ mới return sớm
  if (!mockData || !summary) {
    return <DashboardSkeleton />;
  }

  // hàm xóa 1 dòng
  function handleDeleteDetection(id: string) {
    setMockData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        results: prev.results.filter((r) => r.id !== id),
      };
    });
    if (selected?.id === id) {
      setSelected(null);
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        summary={{
          dominant_emotion: summary.dominant_emotion,
          average_confidence: summary.average_confidence,
          total_frames_analyzed: summary.total_frames_analyzed,
          duration: summary.duration,
        }}
        onNewAnalysis={() => setMockData(generateMockData())}
      />

      <EmotionSummaryCard summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionCard
          distribution={summary.emotion_distribution}
          chartType={chartType}
          onChangeType={setChartType}
        />
        <TimelineCard results={results} />
      </div>

      <DetectionTable
        results={results}
        onSelect={setSelected}
        onDeleteOne={handleDeleteDetection}
      />

      {selected && (
        <DetectionDetailModal
          selected={selected}
          windowResults={windowResults}
          onClose={() => setSelected(null)}
        />
      )}

      <DashboardStyles />
    </div>
  );
}
