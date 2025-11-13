// audio-sentiment/components/PreprocessList.tsx
import React from "react";

const PreprocessList: React.FC<{ warnings: string[] }> = ({ warnings }) => (
  <div className="mt-6">
    <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
    <ul className="text-sm text-slate-400 grid gap-1">
      <li>✓ Resample 16kHz mono (client/server will resample if needed)</li>
      <li>✓ VAD (trim silence)</li>
      <li>✓ Normalize gain (informative)</li>
    </ul>
    {warnings.length > 0 && (
      <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
        {warnings.map((q) => (
          <div key={q}>• {q}</div>
        ))}
      </div>
    )}
  </div>
);

export default PreprocessList;
