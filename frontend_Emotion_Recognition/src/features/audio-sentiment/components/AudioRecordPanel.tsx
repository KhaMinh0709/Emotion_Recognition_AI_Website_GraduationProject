// audio-sentiment/components/AudioRecordPanel.tsx
import React from "react";
import { uiTokens } from "../utils/uiTokens";
import VUMeter from "./VUMeter";

type Props = {
  isRecording: boolean;
  level: number;
  onStart: () => void;
  onStop: () => void;
};

const AudioRecordPanel: React.FC<Props> = ({
  isRecording,
  level,
  onStart,
  onStop,
}) => (
  <div className="space-y-4">
    <div className="text-sm text-slate-400 mb-2">
      Record tối đa 60 giây. Nhấn Stop hoặc sẽ tự dừng sau 60s.
    </div>
    <div className="flex items-center gap-4">
      <button
        className={uiTokens.btn.primary}
        onClick={onStart}
        disabled={isRecording}
      >
        {isRecording ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Recording…
          </>
        ) : (
          "Start Recording (60s)"
        )}
      </button>
      {isRecording && (
        <button className={uiTokens.btn.ghost} onClick={onStop}>
          Stop
        </button>
      )}
    </div>
    <VUMeter level={level} />
    <div className={uiTokens.subtle}>Live mic level</div>
  </div>
);

export default AudioRecordPanel;
