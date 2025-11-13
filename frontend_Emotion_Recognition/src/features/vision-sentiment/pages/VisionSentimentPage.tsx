// vision-sentiment/pages/VisionSentimentPage.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import { AnimatedHeader } from "../components/AnimatedHeader";
import { ImagePreview } from "../components/ImagePreview";
import { DetailModal } from "../components/DetailModal";
import { Donut } from "../components/Donut";
import { ResultsTable } from "../components/ResultsTable";
import { useCamera } from "../hooks/useCamera";
import { useFaceDetection } from "../hooks/useFaceDetection";
import { 
  detectFacesFromBlob,
  detectFacesFromDataUrl,
  predictEmotionFromCroppedFace,
  predictEmotionBatch
} from "../services/visionApi";
import { useVideoFrameLoop } from "../hooks/useVideoFrameLoop";
import { tokens } from "../utils/tokens";
import { cx } from "../utils/cx";
import { formatBytes } from "../utils/formatBytes";
import type { ResultRow, Box } from "../types";
import { RealtimePreview } from "../components/RealtimePreview";

type Tab = "upload" | "camera" | "realtime";

const REALTIME_INTERVAL = 200; // ms - Fast response for real-time emotion changes
const MAX_FACES_TO_ANALYZE = 5; // Tăng số faces phân tích để hỗ trợ nhiều người
const FACE_MOVEMENT_THRESHOLD = 0.05; // 5% - Giảm threshold để phân tích lại thường xuyên hơn
const EMOTION_UPDATE_INTERVAL = 300; // ms - Phân tích emotion mỗi 300ms để catch thay đổi nhanh

// Hàm crop ảnh từ sourceUrl theo box coordinates
const cropFaceFromImage = (
  imageUrl: string,
  box: { x: number; y: number; w: number; h: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = box.w;
        canvas.height = box.h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        // Crop ảnh theo box coordinates
        ctx.drawImage(
          img,
          box.x,
          box.y,
          box.w,
          box.h,
          0,
          0,
          box.w,
          box.h
        );
        // Convert canvas thành data URL
        const croppedUrl = canvas.toDataURL("image/jpeg", 0.9);
        resolve(croppedUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
};

export const VisionSentimentPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("upload");
  const isCameraMode = tab === "camera" || tab === "realtime";

  // camera
  const {
    videoRef,
    camReady,
    stream,
    startCamera,
    stopCamera,
    takeSnapshot,
  } = useCamera(isCameraMode);

  // face detection
  const {
    boxes,
    activeId,
    setActiveId,
    clearDetection,
    setBoxes,
  } = useFaceDetection();

  // file / snapshot
  const [file, setFile] = useState<File | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const sourceUrl = snapshotUrl || (file ? URL.createObjectURL(file) : null);

  // cropped face images
  const [croppedFaceUrls, setCroppedFaceUrls] = useState<Record<number, string>>({});

  // emotion results for each face (face_id -> { emotion, confidence, topK })
  const [faceEmotions, setFaceEmotions] = useState<Record<number, { 
    emotion: string; 
    confidence: number;
    topK: { label: string; score: number }[];
  }>>({});

  // current result
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<ResultRow | null>(null);

  // results table
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [q, setQ] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ResultRow | null>(null);

  // realtime state
  const [isRealtimeRunning, setIsRealtimeRunning] = useState(false);
  const processingRef = useRef(false); // để không chồng xử lý
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousBoxesRef = useRef<Box[]>([]); // Lưu boxes của frame trước để so sánh
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null); // Reuse canvas
  const lastCroppedUpdateRef = useRef<number>(0); // Debounce cropped face URLs update
  const lastEmotionAnalysisRef = useRef<number>(0); // Track last emotion analysis time
  const lastEmotionsRef = useRef<Record<number, string>>({}); // Track last emotions to detect changes

  // filtered rows
  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(s) ||
        r.label.toLowerCase().includes(s) ||
        String(Math.round(r.confidence * 100)).includes(s)
    );
  }, [q, rows]);

  // khi chọn file - tự động detect faces
  const onFilePicked = async (f: File) => {
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(null);
    setFile(f);
    // Clear boxes và cropped faces khi upload ảnh mới
    clearDetection();
    setCroppedFaceUrls({});
    setFaceEmotions({});
    setCurrent(null);
    
    // Tự động detect faces khi upload ảnh
    try {
      setLoading(true);
      const detectResult = await detectFacesFromBlob(f, false);
      
      if (detectResult.faces.length > 0) {
        // Map detected faces to boxes
        const bxs = detectResult.faces.map((face) => ({
          id: face.face_id,
          x: face.location.left,
          y: face.location.top,
          w: face.location.right - face.location.left,
          h: face.location.bottom - face.location.top,
        }));
        
        setBoxes(bxs);
        setActiveId(bxs[0]?.id ?? null);
        
        // Crop faces từ ảnh gốc để hiển thị
        const fileUrl = URL.createObjectURL(f);
        const cropPromises = bxs.map(async (box) => {
          try {
            const croppedUrl = await cropFaceFromImage(fileUrl, box);
            return { id: box.id, url: croppedUrl };
          } catch (err) {
            console.error(`Failed to crop face ${box.id}:`, err);
            return null;
          }
        });
        
        const croppedResults = await Promise.all(cropPromises);
        const croppedMap: Record<number, string> = {};
        croppedResults.forEach((result) => {
          if (result) {
            croppedMap[result.id] = result.url;
          }
        });
        setCroppedFaceUrls(croppedMap);
      } else {
        // Không có face nào được detect
        clearDetection();
      }
    } catch (err) {
      console.error("Face detection failed:", err);
      clearDetection();
    } finally {
      setLoading(false);
    }
  };

  // chụp từ camera (tab camera) - tự động detect faces
  const handleSnapshot = async () => {
    const url = takeSnapshot();
    if (!url) return;
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(url);
    setFile(null);
    // Clear boxes và cropped faces khi chụp ảnh mới
    clearDetection();
    setCroppedFaceUrls({});
    setFaceEmotions({});
    setCurrent(null);
    
    // Tự động detect faces khi chụp ảnh
    try {
      setLoading(true);
      const detectResult = await detectFacesFromDataUrl(url, false);
      
      if (detectResult.faces.length > 0) {
        // Map detected faces to boxes
        const bxs = detectResult.faces.map((face) => ({
          id: face.face_id,
          x: face.location.left,
          y: face.location.top,
          w: face.location.right - face.location.left,
          h: face.location.bottom - face.location.top,
        }));
        
          setBoxes(bxs);
        setActiveId(bxs[0]?.id ?? null);
          
        // Crop faces từ ảnh gốc để hiển thị
            const cropPromises = bxs.map(async (box) => {
              try {
            const croppedUrl = await cropFaceFromImage(url, box);
                return { id: box.id, url: croppedUrl };
              } catch (err) {
                console.error(`Failed to crop face ${box.id}:`, err);
                return null;
              }
            });
            
            const croppedResults = await Promise.all(cropPromises);
            const croppedMap: Record<number, string> = {};
            croppedResults.forEach((result) => {
              if (result) {
                croppedMap[result.id] = result.url;
              }
            });
            setCroppedFaceUrls(croppedMap);
        } else {
        // Không có face nào được detect
          clearDetection();
      }
    } catch (err) {
      console.error("Face detection failed:", err);
      clearDetection();
    } finally {
      setLoading(false);
    }
  };

  // analyze từ nút Analyze - phân tích tất cả các faces đã detect
  const analyze = async () => {
    if (!sourceUrl) {
      console.warn("No image available for analysis");
      return;
    }
    
    // Nếu không có face nào được detect, không thể phân tích
    if (boxes.length === 0) {
      console.warn("No faces detected. Please upload an image with faces.");
      return;
    }
    
    setLoading(true);
    try {
      const start = performance.now();
      
      // Crop tất cả các faces từ ảnh gốc
      const cropPromises = boxes.map(async (box) => {
        try {
          const croppedFaceUrl = await cropFaceFromImage(sourceUrl, box);
          const response = await fetch(croppedFaceUrl);
          const croppedFaceBlob = await response.blob();
          return { faceId: box.id, blob: croppedFaceBlob };
        } catch (err) {
          console.error(`Failed to crop face ${box.id}:`, err);
          return null;
        }
      });
      
      const croppedFaces = await Promise.all(cropPromises);
      const validFaces = croppedFaces.filter((f): f is { faceId: number; blob: Blob } => f !== null);
      
      if (validFaces.length === 0) {
        console.warn("No valid faces to analyze");
        return;
      }
      
      // Gọi API batch để phân tích tất cả các faces
      const faceBlobs = validFaces.map((f) => f.blob);
      const batchResp = await predictEmotionBatch(faceBlobs);
      const latency = Math.round(performance.now() - start);
      
      // Cập nhật kết quả cho tất cả các faces
      const newFaceEmotions: Record<number, { 
        emotion: string; 
        confidence: number;
        topK: { label: string; score: number }[];
      }> = {};
      
      // Tạo rows cho mỗi face đã phân tích
      const newRows: ResultRow[] = [];
      
      batchResp.results.forEach((resp, index) => {
        const faceId = validFaces[index].faceId;
        const box = boxes.find((b) => b.id === faceId);
        
        // Build topK from all_emotions
        const topKResult = resp.all_emotions
          ? Object.entries(resp.all_emotions)
              .map(([label, score]) => ({ label, score }))
              .sort((a, b) => b.score - a.score)
          : [{ label: resp.emotion, score: resp.confidence }];
        
        // Lưu emotion và topK cho face
        newFaceEmotions[faceId] = {
          emotion: resp.emotion,
          confidence: resp.confidence,
          topK: topKResult,
        };
        
        // Tạo row cho face này
        const label =
          tab === "camera"
            ? `Camera snapshot - Face ${faceId}`
            : file
              ? `${file.name} - Face ${faceId} • ${formatBytes(file.size)}`
              : `Image - Face ${faceId}`;
        
        const row: ResultRow = {
          id: `${Date.now()}-${faceId}`,
          source: label,
          label: (resp.emotion ?? "") || (topKResult[0]?.label ?? "Unknown"),
          confidence: resp.confidence ?? 0,
          latency,
          topK: topKResult,
          ts: Date.now(),
        };
        
        newRows.push(row);
      });
      
      // Cập nhật state
      setFaceEmotions((prev) => ({ ...prev, ...newFaceEmotions }));
      
      // Set current result là face đầu tiên (hoặc face đang active)
      const faceIdToShow = activeId || boxes[0]?.id;
      const resultToShow = newFaceEmotions[faceIdToShow];
      if (resultToShow) {
        const currentRow = newRows.find((r) => r.source.includes(`Face ${faceIdToShow}`));
        if (currentRow) {
          setCurrent(currentRow);
        }
      } else if (newRows.length > 0) {
        setCurrent(newRows[0]);
      }
      
      // Thêm tất cả rows vào bảng kết quả
      setRows((p) => [...newRows, ...p]);
      
      // Đảm bảo activeId được set nếu chưa có
      if (!activeId && boxes.length > 0) {
        setActiveId(boxes[0].id);
      }
    } catch (err) {
      console.error("Analyze failed", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllInputs = () => {
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(null);
    setFile(null);
    // Revoke cropped face URLs
    Object.values(croppedFaceUrls).forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setCroppedFaceUrls({});
    setFaceEmotions({});
    clearDetection();
    setCurrent(null);
  };

  // export JSON/CSV
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ results: rows }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vision_sentiment_results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = ["index", "source", "label", "confidence", "latency", "time"];
    const body = rows.map((r, i) => [
      String(i + 1),
      r.source.replace(/"/g, '""'),
      r.label,
      String(Math.round(r.confidence * 100) + "%"),
      String(r.latency),
      new Date(r.ts).toLocaleString(),
    ]);
    const csv =
      [header, ...body]
        .map((line) => line.map((c) => `"${c}"`).join(","))
        .join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vision_sentiment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Hàm tính khoảng cách giữa 2 boxes (để xác định face có di chuyển không)
  const calculateBoxDistance = (box1: Box, box2: Box): number => {
    const center1 = { x: box1.x + box1.w / 2, y: box1.y + box1.h / 2 };
    const center2 = { x: box2.x + box2.w / 2, y: box2.y + box2.h / 2 };
    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    const avgSize = (box1.w + box1.h + box2.w + box2.h) / 4;
    return Math.sqrt(dx * dx + dy * dy) / avgSize; // Normalized distance
  };

  // Hàm tìm box tương ứng trong frame trước
  const findMatchingBox = (currentBox: Box, previousBoxes: Box[]): Box | null => {
    for (const prevBox of previousBoxes) {
      if (prevBox.id === currentBox.id) {
        const distance = calculateBoxDistance(currentBox, prevBox);
        if (distance < FACE_MOVEMENT_THRESHOLD) {
          return prevBox;
        }
      }
    }
    return null;
  };

  // ====== REALTIME LOOP (OPTIMIZED) ======
  const realtimeTick = useCallback(async () => {
    if (!isRealtimeRunning) return;
    if (!videoRef.current) return;
    if (processingRef.current) return; // đang xử lý thì bỏ

    const video = videoRef.current;

    // Cancel request cũ nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Tạo / lấy canvas ẩn
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    const canvas = offscreenCanvasRef.current;

    // OPTIMIZATION: Resize xuống 480x360 để giảm dung lượng hơn nữa
    const targetWidth = 480;
    const targetHeight = 360;
    const aspectRatio = video.videoWidth / video.videoHeight;

    let resizeWidth = targetWidth;
    let resizeHeight = targetHeight;

    if (aspectRatio > targetWidth / targetHeight) {
      resizeHeight = Math.round(targetWidth / aspectRatio);
    } else {
      resizeWidth = Math.round(targetHeight * aspectRatio);
    }

    canvas.width = resizeWidth;
    canvas.height = resizeHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Vẽ video với kích thước đã resize
    ctx.drawImage(video, 0, 0, resizeWidth, resizeHeight);

    processingRef.current = true;

    try {
      const start = performance.now();

      // Convert to blob với quality thấp hơn để tăng tốc
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/jpeg", 0.6); // Giảm quality xuống 0.6
      });

      // Bước 1: Detect faces trước
      const detectResult = await detectFacesFromBlob(blob, false);
      
      if (detectResult.faces.length === 0) {
        // Không có face, clear boxes và emotions
        setBoxes([]);
        setFaceEmotions({});
        previousBoxesRef.current = [];
        processingRef.current = false;
        return;
      }

      // Bước 2: Map detected faces to boxes (theo kích thước video thực tế)
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const scaleX = videoWidth / resizeWidth;
      const scaleY = videoHeight / resizeHeight;

      const bxs = detectResult.faces.map((face) => ({
        id: face.face_id,
        x: face.location.left * scaleX,
        y: face.location.top * scaleY,
        w: (face.location.right - face.location.left) * scaleX,
        h: (face.location.bottom - face.location.top) * scaleY,
      }));

      // Sắp xếp faces theo kích thước (ưu tiên faces lớn hơn)
      const sortedBoxes = [...bxs].sort((a, b) => (b.w * b.h) - (a.w * a.h));
      const boxesToAnalyze = sortedBoxes.slice(0, MAX_FACES_TO_ANALYZE);

      // Xác định faces nào cần phân tích lại
      const currentTime = Date.now();
      const timeSinceLastAnalysis = currentTime - lastEmotionAnalysisRef.current;
      const shouldAnalyzeAll = timeSinceLastAnalysis >= EMOTION_UPDATE_INTERVAL;
      
      const facesToAnalyze: Box[] = [];
      const facesToKeep: number[] = [];

      if (shouldAnalyzeAll) {
        // Phân tích tất cả faces định kỳ để catch thay đổi emotion
        facesToAnalyze.push(...boxesToAnalyze);
        lastEmotionAnalysisRef.current = currentTime;
      } else {
        // Giữa các lần phân tích định kỳ, chỉ phân tích faces mới hoặc di chuyển nhiều
        boxesToAnalyze.forEach((box) => {
          const matchingBox = findMatchingBox(box, previousBoxesRef.current);
          if (!matchingBox) {
            // Face mới - cần phân tích ngay
            facesToAnalyze.push(box);
          } else {
            // Face đã có - chỉ giữ kết quả cũ nếu chưa đến lúc phân tích định kỳ
            facesToKeep.push(box.id);
          }
        });
      }

      // Cập nhật boxes (tất cả faces, không chỉ faces phân tích)
      setBoxes(bxs);
      if (bxs.length > 0 && !activeId) {
        setActiveId(bxs[0].id);
      }

      // Tạo cropped face URLs (giảm debounce để update nhanh hơn)
      if (currentTime - lastCroppedUpdateRef.current > 500) {
        lastCroppedUpdateRef.current = currentTime;
        
        // Reuse full canvas
        if (!fullCanvasRef.current) {
          fullCanvasRef.current = document.createElement("canvas");
        }
        const fullCanvas = fullCanvasRef.current;
        fullCanvas.width = videoWidth;
        fullCanvas.height = videoHeight;
        const fullCtx = fullCanvas.getContext("2d");
        if (fullCtx) {
          fullCtx.drawImage(video, 0, 0, videoWidth, videoHeight);

          const croppedPromises = bxs.map(async (box) => {
            try {
              const faceCanvas = document.createElement("canvas");
              faceCanvas.width = box.w;
              faceCanvas.height = box.h;
              const faceCtx = faceCanvas.getContext("2d");
              if (!faceCtx) return null;
              faceCtx.drawImage(
                fullCanvas,
                box.x, box.y, box.w, box.h,
                0, 0, box.w, box.h
              );
              const croppedUrl = faceCanvas.toDataURL("image/jpeg", 0.8);
              return { id: box.id, url: croppedUrl };
            } catch (err) {
              return null;
            }
          });

          const croppedResults = await Promise.all(croppedPromises);
          const croppedMap: Record<number, string> = {};
          croppedResults.forEach((result) => {
            if (result) {
              croppedMap[result.id] = result.url;
            }
          });
          setCroppedFaceUrls(croppedMap);
        }
      }

      // Bước 3: Phân tích emotion cho faces cần thiết
      if (facesToAnalyze.length === 0) {
        // Không có face nào cần phân tích lại - giữ nguyên kết quả
        previousBoxesRef.current = bxs;
        processingRef.current = false;
        return;
      }

      // Reuse full canvas cho phân tích
      if (!fullCanvasRef.current) {
        fullCanvasRef.current = document.createElement("canvas");
      }
      const fullCanvas = fullCanvasRef.current;
      fullCanvas.width = videoWidth;
      fullCanvas.height = videoHeight;
      const fullCtx = fullCanvas.getContext("2d");
      if (!fullCtx) {
        processingRef.current = false;
        return;
      }
      fullCtx.drawImage(video, 0, 0, videoWidth, videoHeight);

      // Crop tất cả faces cần phân tích thành blobs
      const faceBlobs: { faceId: number; blob: Blob }[] = [];
      for (const box of facesToAnalyze) {
        try {
          if (abortController.signal.aborted) break;

          const faceCanvas = document.createElement("canvas");
          faceCanvas.width = box.w;
          faceCanvas.height = box.h;
          const faceCtx = faceCanvas.getContext("2d");
          if (!faceCtx) continue;

          // Crop face từ full canvas
          faceCtx.drawImage(
            fullCanvas,
            box.x, box.y, box.w, box.h,
            0, 0, box.w, box.h
          );

          // Convert to blob
          const croppedBlob = await new Promise<Blob | null>((resolve) => {
            faceCanvas.toBlob((b) => resolve(b || null), "image/jpeg", 0.75);
          });

          if (croppedBlob && !abortController.signal.aborted) {
            faceBlobs.push({ faceId: box.id, blob: croppedBlob });
          }
        } catch (err) {
          console.error(`Failed to crop face ${box.id}:`, err);
        }
      }

      if (faceBlobs.length === 0 || abortController.signal.aborted) {
        previousBoxesRef.current = bxs;
        processingRef.current = false;
        return;
      }

      // Sử dụng batch prediction để phân tích tất cả faces cùng lúc (nhanh hơn)
      let analyzeResults: Array<{ faceId: number; emotion: string; confidence: number; allEmotions: Record<string, number> } | null> = [];
      
      try {
        const blobs = faceBlobs.map((fb) => fb.blob);
        const batchResp = await predictEmotionBatch(blobs);
        
        if (!abortController.signal.aborted) {
          analyzeResults = batchResp.results.map((resp, index) => {
            if (index < faceBlobs.length) {
              return {
                faceId: faceBlobs[index].faceId,
                emotion: resp.emotion,
                confidence: resp.confidence,
                allEmotions: resp.all_emotions || {},
              };
            }
            return null;
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          processingRef.current = false;
          return;
        }
        console.error("Batch prediction failed, falling back to individual:", err);
        
        // Fallback: phân tích từng face nếu batch fails
        analyzeResults = await Promise.all(
          faceBlobs.map(async ({ faceId, blob }) => {
            try {
              if (abortController.signal.aborted) return null;
              const resp = await predictEmotionFromCroppedFace(blob, { skipSave: true });
              if (abortController.signal.aborted) return null;
              return {
                faceId,
                emotion: resp.emotion,
                confidence: resp.confidence,
                allEmotions: resp.all_emotions || {},
              };
            } catch (err) {
              if (err instanceof Error && err.name === 'AbortError') return null;
              console.error(`Failed to analyze face ${faceId}:`, err);
              return null;
            }
          })
        );
      }
      
      // Check if aborted
      if (abortController.signal.aborted) {
        processingRef.current = false;
        return;
      }

      const latency = Math.round(performance.now() - start);

      // Cập nhật faceEmotions và current result ngay lập tức
      setFaceEmotions((prev) => {
        const newFaceEmotions: Record<number, { 
          emotion: string; 
          confidence: number;
          topK: { label: string; score: number }[];
        }> = { ...prev };

        // Giữ kết quả cũ cho faces không phân tích lại
        facesToKeep.forEach((faceId) => {
          if (prev[faceId]) {
            newFaceEmotions[faceId] = prev[faceId];
          }
        });

        // Cập nhật kết quả mới cho faces vừa phân tích
        analyzeResults.forEach((result) => {
          if (result) {
            const topK = result.allEmotions
              ? Object.entries(result.allEmotions)
            .map(([label, score]) => ({ label, score }))
            .sort((a, b) => b.score - a.score)
              : [{ label: result.emotion, score: result.confidence }];
            
            newFaceEmotions[result.faceId] = {
              emotion: result.emotion,
              confidence: result.confidence,
              topK,
            };
          }
        });

        // Cập nhật current result với face active ngay lập tức
        const faceIdToShow = activeId || bxs[0]?.id;
        if (faceIdToShow && newFaceEmotions[faceIdToShow]) {
          const emotionData = newFaceEmotions[faceIdToShow];
          const row: ResultRow = {
            id: `realtime-${faceIdToShow}-${Date.now()}`,
            source: `Realtime camera - Face ${faceIdToShow} (${bxs.length} total)`,
            label: emotionData.emotion,
            confidence: emotionData.confidence,
            latency,
            topK: emotionData.topK,
            ts: Date.now(),
          };

          // Update current result ngay lập tức
          setCurrent(row);
          
          // Chỉ thêm vào rows mỗi 1s hoặc khi emotion thay đổi để tránh spam
          setRows((p) => {
            const lastRow = p[0];
            const shouldAddRow = !lastRow 
              || Date.now() - lastRow.ts > 1000 
              || lastRow.label !== emotionData.emotion
              || (lastRow.source.includes(`Face ${faceIdToShow}`) && lastRow.confidence !== emotionData.confidence);
            
            if (shouldAddRow) {
              return [row, ...p];
            }
            return p;
          });
        }

        return newFaceEmotions;
      });

      // Lưu boxes hiện tại để so sánh frame sau
      previousBoxesRef.current = bxs;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request bị cancel - không cần log
        return;
      }
      console.error("Realtime analyze error:", err);
    } finally {
      processingRef.current = false;
    }
  }, [isRealtimeRunning, videoRef, activeId, setActiveId]);

  // chạy loop chỉ khi có frame mới và isRealtimeRunning = true
  useVideoFrameLoop(videoRef, isRealtimeRunning, realtimeTick, REALTIME_INTERVAL);

  // khi đổi tab khỏi realtime thì dừng và clear
  const changeTab = (t: Tab) => {
    setTab(t);
    if (t !== "realtime") {
      setIsRealtimeRunning(false);
      processingRef.current = false;
      // Clear boxes và emotions khi rời khỏi realtime
      setBoxes([]);
      setFaceEmotions({});
      setActiveId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <AnimatedHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: các mode */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="flex gap-2 mb-4">
            <button
              className={tokens.btn.tab}
              data-active={tab === "upload"}
              onClick={() => changeTab("upload")}
            >
              Upload Image
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "camera"}
              onClick={() => changeTab("camera")}
            >
              Camera Capture
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "realtime"}
              onClick={() => changeTab("realtime")}
            >
              Realtime
            </button>
            <div className="ml-auto">
              <button className={tokens.btn.icon} onClick={clearAllInputs}>
                Clear
              </button>
            </div>
          </div>

          {/* UPLOAD */}
          {tab === "upload" ? (
            <label className="block">
              <div className="w-full border-2 border-dashed border-sky-500/40 hover:border-sky-400/70 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                <div className="text-sky-200 font-medium">
                  Drop image here or click to browse
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  PNG, JPG, JPEG, BMP, TIFF • up to 25MB
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFilePicked(f);
                  }}
                />
              </div>
              {file && (
                <div className="mt-3 text-sm text-slate-300">
                  Selected: {file.name} • {formatBytes(file.size)}
                </div>
              )}
            </label>
          ) : null}

          {/* CAMERA CAPTURE */}
          {tab === "camera" ? (
            <>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-[260px] object-contain bg-slate-900"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  className={tokens.btn.primary}
                  disabled={!camReady}
                  onClick={handleSnapshot}
                >
                  Snapshot
                </button>
                {stream ? (
                  <button className={tokens.btn.ghost} onClick={stopCamera}>
                    Turn Off Camera
                  </button>
                ) : (
                  <button className={tokens.btn.ghost} onClick={startCamera}>
                    Turn On Camera
                  </button>
                )}
                <div className="text-sm text-slate-400">
                  Căn mặt ở trung tâm khung hình, ánh sáng đều.
                </div>
              </div>
            </>
          ) : null}

          {/* REALTIME */}
          {tab === "realtime" ? (
            <>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-[260px] object-contain bg-slate-900"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                {!isRealtimeRunning ? (
                  <button
                    className={tokens.btn.primary}
                    disabled={!camReady}
                    onClick={() => setIsRealtimeRunning(true)}
                  >
                    Analyze (Start)
                  </button>
                ) : (
                  <button
                    className={tokens.btn.ghost}
                    onClick={() => {
                      setIsRealtimeRunning(false);
                      processingRef.current = false;
                    }}
                  >
                    Stop
                  </button>
                )}

                {stream ? (
                  <button className={tokens.btn.ghost} onClick={stopCamera}>
                    Turn Off Camera
                  </button>
                ) : (
                  <button className={tokens.btn.ghost} onClick={startCamera}>
                    Turn On Camera
                  </button>
                )}

                <div className="text-sm text-slate-400">
                  Bấm Analyze để bắt đầu phân tích liên tục.
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Panel 2: Preview */}
        <div className={cx(tokens.card, "p-4 min-h-[300px]")}>
        <div className="text-sm text-slate-400 mb-2">Preview</div>

        {tab === "realtime" ? (
            // realtime: show video with boxes and emotions
            <RealtimePreview 
              stream={stream} 
              boxes={boxes}
              activeId={activeId}
              faceEmotions={faceEmotions}
            />
        ) : sourceUrl ? (
            // upload / camera: show image preview như cũ
            <ImagePreview
            sourceUrl={sourceUrl}
            boxes={boxes}
            activeId={activeId}
            faceEmotions={faceEmotions}
            />
        ) : (
            <div className="rounded-xl border border-white/10 bg-slate-900/40 min-h-[280px] grid place-items-center text-slate-400">
            Preview will appear here after you upload or take a snapshot.
            </div>
        )}
        </div>

        {/* Panel 3: Faces + actions */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="text-slate-200 font-semibold mb-2">
            Detected faces
          </div>
          {boxes.length ? (
            <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto py-2">
              {boxes.map((b) => {
                const croppedUrl = croppedFaceUrls[b.id];
                  const emotionData = faceEmotions[b.id];
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveId(b.id);
                      // Cập nhật current result khi click vào face
                      if (emotionData) {
                        const label =
                          tab === "camera"
                            ? `Camera snapshot - Face ${b.id}`
                            : file
                              ? `${file.name} - Face ${b.id} • ${formatBytes(file.size)}`
                              : `Image - Face ${b.id}`;
                        
                        const row: ResultRow = {
                          id: `${Date.now()}-${b.id}`,
                          source: label,
                          label: emotionData.emotion,
                          confidence: emotionData.confidence,
                          latency: 0, // Latency từ batch request
                          topK: emotionData.topK,
                          ts: Date.now(),
                        };
                        setCurrent(row);
                      }
                    }}
                    className={cx(
                        "min-w-[88px] h-[88px] rounded-xl border transition-colors overflow-hidden relative",
                      activeId === b.id
                        ? "border-sky-400 ring-2 ring-sky-500/40"
                        : "border-white/10"
                    )}
                      title={`Face #${b.id}${emotionData ? ` - ${emotionData.emotion}` : ""}`}
                  >
                    {croppedUrl ? (
                        <>
                      <img
                        src={croppedUrl}
                        alt={`Face ${b.id}`}
                        className="w-full h-full object-cover"
                      />
                          {emotionData && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 text-center truncate">
                              {emotionData.emotion}
                            </div>
                          )}
                        </>
                    ) : (
                      <div className="w-full h-full bg-slate-700/40 flex items-center justify-center text-slate-300 text-sm">
                        #{b.id}
                      </div>
                    )}
                  </button>
                );
              })}
              </div>
              {boxes.length > 1 && (
                <div className="text-xs text-slate-400">
                  💡 Click vào face để xem chi tiết emotion và topK
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400">
              {tab === "realtime" 
                ? "Waiting for face detection..." 
                : "No faces yet — upload or take a snapshot."}
            </div>
          )}

          <div className="mt-6">
            <div className="text-sm text-slate-300 font-medium mb-2">
              Preprocess
            </div>
            <ul className="text-sm text-slate-400 grid gap-1">
              <li>✓ Face detection → draw bounding boxes</li>
              <li>✓ Grayscale + resize 224×224 preview</li>
            </ul>
          </div>

          {tab !== "realtime" ? (
            <div className="mt-6 flex gap-3">
              <button
                className={tokens.btn.primary}
                onClick={analyze}
                disabled={loading || !sourceUrl}
              >
                {loading ? "Analyzing…" : "Analyze"}
              </button>
              <button className={tokens.btn.ghost} onClick={clearAllInputs}>
                Clear
              </button>
            </div>
          ) : (
            <div className="mt-6 text-xs text-slate-500">
              Realtime đang dùng nút Analyze/Stop bên panel trái.
            </div>
          )}
        </div>

        {/* Panel 4: Current Result */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm uppercase tracking-widest text-slate-400">
                VISION SENTIMENT
              </div>
              <div
                className={cx(
                  "mt-1 text-3xl font-extrabold",
                  (() => {
                    // Ưu tiên hiển thị từ faceEmotions nếu có activeId
                    const emotionLabel = (activeId && faceEmotions[activeId])
                      ? faceEmotions[activeId].emotion
                      : (current?.label ?? "");
                    if (emotionLabel === "Happy") return "text-emerald-300";
                    if (emotionLabel === "Angry") return "text-rose-300";
                    return "text-slate-200";
                  })()
                )}
              >
                {(() => {
                  // Ưu tiên hiển thị từ faceEmotions nếu có activeId
                  if (activeId && faceEmotions[activeId]) {
                    return faceEmotions[activeId].emotion;
                  }
                  return current?.label ?? "—";
                })()}
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">
              {current?.latency ?? 0} ms
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Donut pct={Math.round(
              (() => {
                // Ưu tiên hiển thị từ faceEmotions nếu có activeId
                if (activeId && faceEmotions[activeId]) {
                  return faceEmotions[activeId].confidence * 100;
                }
                return (current?.confidence ?? 0) * 100;
              })()
            )} />
            <div>
              <div className="text-xs text-slate-400 mb-2">
                Top-K Emotions
                {activeId && (
                  <span className="ml-2 text-slate-500">(Face {activeId})</span>
                )}
              </div>
              <div className="grid gap-2">
                {(() => {
                  // Ưu tiên hiển thị từ faceEmotions nếu có activeId
                  const topKToShow = (activeId && faceEmotions[activeId])
                    ? faceEmotions[activeId].topK
                    : (current?.topK ?? []);
                  
                  return topKToShow.length > 0 ? (
                    topKToShow.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-200">{t.label}</span>
                      <span className="text-slate-400 text-sm">
                        {Math.round(t.score * 100)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                        style={{
                          width: `${Math.round(t.score * 100)}%`,
                          transition: "width .6s cubic-bezier(.2,.9,.2,1)",
                        }}
                      />
                    </div>
                  </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm">
                      {tab === "realtime" 
                        ? "Waiting for face detection..." 
                        : "No analysis yet"}
              </div>
                  );
                })()}
              </div>
              {!current && tab !== "realtime" && (
                <div className="text-slate-400 text-sm mt-4">
                  Fair-Use: facial expression only — no sensitive attribute inference.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <ResultsTable
        rows={rows}
        filtered={filtered}
        query={q}
        onQueryChange={setQ}
        onClearAll={() => setRows([])}
        onExportJSON={exportJSON}
        onExportCSV={exportCSV}
        onRowClick={(row) => {
          setSelectedRow(row);
          setOpen(true);
        }}
      />

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        row={selectedRow}
      />
    </div>
  );
};

export default VisionSentimentPage;
