// src/features/max-fusion/components/ModalWrap.tsx
import React from "react";
import { tokens } from "@/features/max-fusion-video/utils/uiTokens";

type ModalWrapProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function ModalWrap({
  open,
  onClose,
  title,
  children,
}: ModalWrapProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={`${tokens.card} w-full max-w-3xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sky-100 text-lg font-semibold">
              {title ?? "Details"}
            </div>
            <button
              className="px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
