// vision-sentiment/hooks/useVideoFrameLoop.ts
import { useEffect, useRef, RefObject } from "react";

// Type definition for VideoFrameCallbackMetadata (if not available)
interface VideoFrameCallbackMetadata {
  presentationTime: number;
  expectedDisplayTime: number;
  width: number;
  height: number;
  mediaTime: number;
  presentedFrames: number;
  processingDuration?: number;
}

/**
 * Hook để chạy callback chỉ khi video có frame mới.
 * Sử dụng requestVideoFrameCallback nếu browser support,
 * fallback về so sánh currentTime nếu không.
 */
export const useVideoFrameLoop = (
  videoRef: RefObject<HTMLVideoElement | null>,
  isRunning: boolean,
  callback: () => void,
  minInterval: number = 200 // Minimum interval in ms (fallback mode)
) => {
  const frameCallbackRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(0);
  const fallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!isRunning || !video) {
      // Cleanup
      if (frameCallbackRef.current !== null) {
        if ('cancelVideoFrameCallback' in HTMLVideoElement.prototype) {
          (video as any).cancelVideoFrameCallback(frameCallbackRef.current);
        }
        frameCallbackRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      return;
    }

    // Check if browser supports requestVideoFrameCallback
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      // Modern approach: requestVideoFrameCallback - chỉ gọi khi có frame mới
      const onVideoFrame = (now: number, metadata: VideoFrameCallbackMetadata) => {
        // Chỉ xử lý nếu đã qua minInterval
        const elapsed = now - lastTimeRef.current;
        if (elapsed >= minInterval) {
          lastTimeRef.current = now;
          callback();
        }
        
        // Schedule next frame
        frameCallbackRef.current = (video as any).requestVideoFrameCallback(onVideoFrame);
      };

      // Start the loop
      frameCallbackRef.current = (video as any).requestVideoFrameCallback(onVideoFrame);

      return () => {
        if (frameCallbackRef.current !== null) {
          (video as any).cancelVideoFrameCallback(frameCallbackRef.current);
          frameCallbackRef.current = null;
        }
      };
    } else {
      // Fallback: So sánh currentTime để detect frame mới
      const checkFrame = () => {
        const currentVideoTime = video.currentTime;
        const now = performance.now();
        
        // Nếu currentTime thay đổi và đã qua minInterval -> có frame mới
        if (
          currentVideoTime !== lastVideoTimeRef.current &&
          now - lastTimeRef.current >= minInterval
        ) {
          lastVideoTimeRef.current = currentVideoTime;
          lastTimeRef.current = now;
          callback();
        }
      };

      // Check mỗi 50ms (nhanh hơn để catch frame mới)
      fallbackTimerRef.current = window.setInterval(checkFrame, 50);

      return () => {
        if (fallbackTimerRef.current) {
          clearInterval(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
      };
    }
  }, [isRunning, videoRef, callback, minInterval]);
};

