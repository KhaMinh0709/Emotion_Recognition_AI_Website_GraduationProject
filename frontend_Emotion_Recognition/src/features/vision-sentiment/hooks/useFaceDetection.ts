// vision-sentiment/hooks/useFaceDetection.ts
import { useState } from "react";
import type { Box } from "../types";

export const useFaceDetection = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const clearDetection = () => {
    setBoxes([]);
    setActiveId(null);
  };

  // allow external code to set boxes (e.g. from backend face_location)
  const setBoxesExternal = (b: Box[]) => {
    setBoxes(b);
    const newActiveId = b[0]?.id ?? null;
    setActiveId(newActiveId);
  };

  return {
    boxes,
    activeId,
    setActiveId,
    clearDetection,
    setBoxes: setBoxesExternal,
  };
};
