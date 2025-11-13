// vision-sentiment/hooks/useRealtimeLoop.ts
import { useEffect, useRef } from "react";

/**
 * Chạy callback lặp lại khi isRunning = true.
 * Có interval ms để không spam.
 */
export const useRealtimeLoop = (
  isRunning: boolean,
  callback: () => void,
  interval = 200
) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      // chạy ngay lần đầu
      callback();
      timerRef.current = window.setInterval(() => {
        callback();
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, callback, interval]);
};
