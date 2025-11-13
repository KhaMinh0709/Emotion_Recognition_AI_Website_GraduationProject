import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionResult, EMOTION_COLORS, EMOTION_LABELS, EmotionType } from '../types/emotions';

interface EmotionTimelineProps {
  emotionResults: EmotionResult[];
}

export function EmotionTimeline({ emotionResults }: EmotionTimelineProps) {
  if (emotionResults.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No timeline data available
      </div>
    );
  }

  const sortedResults = [...emotionResults].sort((a, b) => a.timestamp - b.timestamp);

  const timelineData = sortedResults.reduce((acc, result) => {
    const time = Math.floor(result.timestamp * 10) / 10;
    const existing = acc.find(item => item.time === time);

    if (existing) {
      existing[result.emotion_type] = result.confidence * 100;
    } else {
      acc.push({
        time,
        [result.emotion_type]: result.confidence * 100,
      });
    }

    return acc;
  }, [] as any[]);

  const emotions = Array.from(new Set(emotionResults.map(r => r.emotion_type))) as EmotionType[];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          stroke="#9ca3af"
          label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
        />
        <YAxis
          stroke="#9ca3af"
          label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
          labelStyle={{ color: '#f3f4f6' }}
          formatter={(value: number) => `${value.toFixed(1)}%`}
        />
        <Legend />
        {emotions.map(emotion => (
          <Line
            key={emotion}
            type="monotone"
            dataKey={emotion}
            stroke={EMOTION_COLORS[emotion]}
            name={EMOTION_LABELS[emotion]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
