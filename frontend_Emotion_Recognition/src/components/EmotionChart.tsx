import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// import { EmotionDistribution, EMOTION_COLORS, EMOTION_LABELS, EmotionType } from '../types/emotions';
import {
  EmotionDistribution,
  EMOTION_COLORS,
  EMOTION_LABELS,
  EmotionType,
} from '../types/emotions';


interface EmotionChartProps {
  emotionDistribution: EmotionDistribution;
  chartType?: 'pie' | 'bar';
}

export function EmotionChart({ emotionDistribution, chartType = 'pie' }: EmotionChartProps) {
  const data = Object.entries(emotionDistribution).map(([emotion, value]) => ({
    name: EMOTION_LABELS[emotion as EmotionType] || emotion,
    value: Math.round(value * 100) / 100,
    color: EMOTION_COLORS[emotion as EmotionType] || '#94a3b8',
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No emotion data available
      </div>
    );
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
          labelStyle={{ color: '#f3f4f6' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
