import { Smile, TrendingUp, Clock, Activity } from 'lucide-react';
import { AnalysisSummary, EMOTION_LABELS, EmotionType, EMOTION_COLORS } from '../types/emotions';

interface EmotionSummaryCardProps {
  summary: AnalysisSummary;
}

export function EmotionSummaryCard({ summary }: EmotionSummaryCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dominantEmotionLabel = summary.dominant_emotion
    ? EMOTION_LABELS[summary.dominant_emotion as EmotionType]
    : 'N/A';

  const dominantEmotionColor = summary.dominant_emotion
    ? EMOTION_COLORS[summary.dominant_emotion as EmotionType]
    : '#6b7280';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gray-700">
            <Smile className="w-5 h-5" style={{ color: dominantEmotionColor }} />
          </div>
          <span className="text-gray-400 text-sm">Dominant Emotion</span>
        </div>
        <p className="text-2xl font-bold text-white">{dominantEmotionLabel}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gray-700">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-gray-400 text-sm">Avg Confidence</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {(summary.average_confidence * 100).toFixed(1)}%
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gray-700">
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-gray-400 text-sm">Frames Analyzed</span>
        </div>
        <p className="text-2xl font-bold text-white">{summary.total_frames_analyzed}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gray-700">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <span className="text-gray-400 text-sm">Duration</span>
        </div>
        <p className="text-2xl font-bold text-white">{formatDuration(summary.duration)}</p>
      </div>
    </div>
  );
}
