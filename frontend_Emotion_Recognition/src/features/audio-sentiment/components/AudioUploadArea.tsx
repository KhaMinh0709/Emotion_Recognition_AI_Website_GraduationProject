// audio-sentiment/components/AudioUploadArea.tsx
import React, { useState } from "react";
import { uiTokens, cx } from "../utils/uiTokens";
import { formatBytes } from "../utils/formatBytes";

type Props = {
  file: File | null;
  blob: Blob | null;
  onFileSelected: (file: File) => void;
  onError: (msg: string | null) => void;
};

const MAX_SIZE = 50 * 1024 * 1024;

const AudioUploadArea: React.FC<Props> = ({
  file,
  blob,
  onFileSelected,
  onError,
}) => {
  const [isDropping, setIsDropping] = useState(false);

  const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropping(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      if (f.size > MAX_SIZE) {
        onError("File quá lớn (max 50MB).");
        return;
      }
      onFileSelected(f);
      onError(null);
    }
  };

  return (
    <div className="space-y-4">
      <label
        className={cx(
          "block transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer border-2 border-dashed",
          isDropping
            ? "border-sky-300/70 bg-slate-900/60"
            : "border-sky-500/40 hover:border-sky-400/70"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDropping(true);
        }}
        onDragLeave={() => setIsDropping(false)}
        onDrop={onDrop}
      >
        <div className="text-sky-200 font-medium">
          Drop audio here or click to browse
        </div>
        <div className="mt-1 text-sm text-slate-400">
          WAV, MP3, M4A, FLAC • up to 50MB
        </div>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (f.size > MAX_SIZE) {
              onError("File quá lớn (max 50MB).");
              return;
            }
            onFileSelected(f);
            onError(null);
          }}
        />
      </label>

      {(file || blob) && (
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
            {file ? file.name : "recorded_audio.webm"}
          </span>
          <span className="text-slate-400">
            • {formatBytes((file || blob)?.size || 0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default AudioUploadArea;
