// src/features/max-fusion/components/PipelineSteps.tsx
import React from "react";
import { tokens } from "@/features/max-fusion-video/utils/uiTokens";
import Step from "./Step";

type PipelineStepsProps = {
  stage: number; // -1 idle, 0..4 running
};

const LABELS = [
  "Extract frames (fps=5) & face-crop",
  "Extract audio & preprocess",
  "ASR → transcript",
  "Inference: vision / audio / text",
  "Fusion → overall",
];

export default function PipelineSteps({ stage }: PipelineStepsProps) {
  return (
    <div className={tokens.card}>
      <h2 className="text-lg font-semibold text-sky-100 mb-4">Pipeline</h2>
      <div className="grid gap-3">
        {LABELS.map((t, i) => (
          <Step key={i} idx={i + 1} text={t} active={stage === i} done={stage > i} />
        ))}
      </div>
    </div>
  );
}
