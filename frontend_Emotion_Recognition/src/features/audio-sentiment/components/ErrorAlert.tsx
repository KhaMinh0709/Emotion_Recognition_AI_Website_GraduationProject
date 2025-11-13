// audio-sentiment/components/ErrorAlert.tsx
import React from "react";
import { uiTokens } from "../utils/uiTokens";

const ErrorAlert: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-sm flex items-center justify-between">
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          d="M12 9v4m0 4h.01M12 2l10 18H2L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <span>{message}</span>
    </div>
    {onRetry ? (
      <button className={uiTokens.btn.subtle} onClick={onRetry}>
        Thử lại
      </button>
    ) : null}
  </div>
);

export default ErrorAlert;
