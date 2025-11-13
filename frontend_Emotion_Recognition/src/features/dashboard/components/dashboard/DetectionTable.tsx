import { useMemo, useState } from "react";
import { EmotionResult } from "@/types/emotions";

type Props = {
  results: EmotionResult[];
  onSelect: (r: EmotionResult) => void;
  onDeleteOne?: (id: string) => void;
};

const EMOTION_LABELS: Record<string, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  neutral: "Neutral",
  fearful: "Fearful",
  disgusted: "Disgusted",
};

export function DetectionTable({ results, onSelect, onDeleteOne }: Props) {
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState<"all" | string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "facial" | "vocal">("all");

  const emotionOptions = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => set.add(r.emotion_type));
    return Array.from(set);
  }, [results]);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchSearch =
        !search ||
        r.emotion_type.toLowerCase().includes(search.toLowerCase()) ||
        r.detection_type.toLowerCase().includes(search.toLowerCase()) ||
        r.timestamp.toFixed(1).includes(search);

      const matchEmotion = emotionFilter === "all" ? true : r.emotion_type === emotionFilter;
      const matchType = typeFilter === "all" ? true : r.detection_type === typeFilter;

      return matchSearch && matchEmotion && matchType;
    });
  }, [results, search, emotionFilter, typeFilter]);

  function handleReset() {
    setSearch("");
    setEmotionFilter("all");
    setTypeFilter("all");
  }

  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
      {/* header + toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Detection Details</h3>
          <p className="text-xs text-gray-400">
            {filtered.length}/{results.length} records
          </p>
        </div>

        {/* thanh công cụ */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {/* search: dài hơn */}
          <div className="relative grow md:grow-0 md:w-72 lg:w-80">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search time, emotion, type..."
              className="w-full pl-3 pr-3 py-1.5 rounded-lg bg-slate-950/40 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          {/* select emotion: rộng hơn */}
          <select
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
            className="min-w-32 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-white/10 text-sm"
          >
            <option value="all">All emotions</option>
            {emotionOptions.map((emo) => (
              <option key={emo} value={emo}>
                {EMOTION_LABELS[emo] ?? emo}
              </option>
            ))}
          </select>

          {/* select type: rộng hơn */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="min-w-28 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-white/10 text-sm capitalize"
          >
            <option value="all">All types</option>
            <option value="facial">Facial</option>
            <option value="vocal">Vocal</option>
          </select>

          <button
            onClick={handleReset}
            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-white/10">
            <tr>
              <th className="text-left py-3 px-4 w-20">Time</th>
              <th className="text-left py-3 px-4">Emotion</th>
              <th className="text-left py-3 px-4 w-32">Confidence</th>
              <th className="text-left py-3 px-4 w-24">Type</th>
              <th className="text-right py-3 px-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-3 px-4 cursor-pointer" onClick={() => onSelect(r)}>
                  {r.timestamp.toFixed(1)}s
                </td>
                <td className="py-3 px-4 capitalize cursor-pointer" onClick={() => onSelect(r)}>
                  {r.emotion_type}
                </td>
                <td className="py-3 px-4 cursor-pointer" onClick={() => onSelect(r)}>
                  {(r.confidence * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 capitalize cursor-pointer" onClick={() => onSelect(r)}>
                  {r.detection_type}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-sm text-red-300 hover:text-red-200"
                    onClick={() => onDeleteOne?.(r.id)}
                    title="Delete this record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400 text-sm">
                  Không có bản ghi phù hợp bộ lọc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
