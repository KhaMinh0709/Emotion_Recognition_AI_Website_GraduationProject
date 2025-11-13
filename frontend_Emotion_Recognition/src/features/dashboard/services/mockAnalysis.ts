// src/services/mockAnalysis.ts
import { Analysis, AnalysisSummary, EmotionResult } from "@/types/emotions";

export function generateMockData(): {
  analysis: Analysis;
  summary: AnalysisSummary;
  results: EmotionResult[];
} {
  const emotions = ["happy", "sad", "angry", "surprised", "neutral", "fearful", "disgusted"];
  const id = crypto.randomUUID();
  const now = new Date();

  const results: EmotionResult[] = [];
  const emotionCounts: Record<string, number> = {};

  for (let i = 0; i < 20; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

    results.push({
      id: crypto.randomUUID(),
      analysis_id: id,
      timestamp: i * 0.5,
      emotion_type: emotion as any,
      confidence: 0.6 + Math.random() * 0.35,
      detection_type: Math.random() > 0.5 ? "facial" : "vocal",
      face_count: Math.floor(Math.random() * 3) + 1,
      created_at: now.toISOString(),
    });
  }

  const total = results.length;
  const distribution: Record<string, number> = {};
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    distribution[emotion] = (count / total) * 100;
  });

  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as any;
  const avgConfidence = results.reduce((s, r) => s + r.confidence, 0) / results.length;

  const analysis: Analysis = {
    id,
    file_name: "mock_analysis.mp4",
    file_type: "video/mp4",
    file_url: "",
    status: "completed",
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const summary: AnalysisSummary = {
    id: crypto.randomUUID(),
    analysis_id: id,
    dominant_emotion: dominantEmotion,
    emotion_distribution: distribution,
    average_confidence: avgConfidence,
    total_frames_analyzed: results.length,
    duration: results[results.length - 1]?.timestamp || 0,
    created_at: now.toISOString(),
  };

  return { analysis, summary, results };
}
