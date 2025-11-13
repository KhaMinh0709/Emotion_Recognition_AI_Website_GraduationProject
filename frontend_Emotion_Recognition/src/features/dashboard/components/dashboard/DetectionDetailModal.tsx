import { EmotionTimeline } from "@/components/EmotionTimeline";
import { EmotionResult } from "@/types/emotions";

type DetectionDetailModalProps = {
  selected: EmotionResult;
  windowResults: EmotionResult[];
  onClose: () => void;
};

export function DetectionDetailModal({
  selected,
  windowResults,
  onClose,
}: DetectionDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h4 className="text-lg font-semibold">
            Chi tiết phát hiện @ {selected.timestamp.toFixed(1)}s
          </h4>
          <button
            className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-5">
          <div className="space-y-2 text-sm">
            <Row label="Emotion" value={selected.emotion_type} />
            <Row label="Confidence" value={`${(selected.confidence * 100).toFixed(2)}%`} />
            <Row label="Type" value={selected.detection_type} />
            <Row label="Faces" value={String(selected.face_count ?? 1)} />
            <Row label="Created at" value={new Date(selected.created_at).toLocaleString()} />
          </div>
          <div className="rounded-xl p-3 border border-white/10 bg-white/5">
            <p className="text-xs text-gray-400 px-1 mb-1">Timeline quanh thời điểm này (±1.5s)</p>
            <EmotionTimeline
              emotionResults={windowResults.length ? windowResults : [selected]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center rounded-lg bg-white/5 border border-white/10 px-3 py-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium capitalize">{value}</span>
    </div>
  );
}
