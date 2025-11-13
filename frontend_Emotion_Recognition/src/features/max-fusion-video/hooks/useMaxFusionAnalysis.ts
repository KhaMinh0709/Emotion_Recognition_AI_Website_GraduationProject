// src/features/max-fusion-video/hooks/useMaxFusionAnalysis.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  makeDemoOverall,
  makeDemoTimeline,
  ModelScore,
  TimelineItem,
} from "../utils/mockData";

// 1 dòng trong bảng "Analysis Results"
export type AnalysisRow = {
  id: string;
  source: string;
  label: string;
  confidence: number; // 0..100
  latency: number; // ms
  time: string;
  raw: {
    overall: ModelScore | null;
    timeline: TimelineItem[];
    byMod?: {
      text?: ModelScore;
      audio?: ModelScore;
      vision?: ModelScore;
    };
  };
};

const nowStr = () =>
  new Date().toLocaleTimeString("vi-VN") +
  " " +
  new Date().toLocaleDateString("vi-VN");

const MAX_REC_SEC = 60;

export function useMaxFusionAnalysis() {
  /* ===== media / upload ===== */
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* ===== record ===== */
  const [isRecording, setIsRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recTimerRef = useRef<number | null>(null);

  /* ===== analysis state ===== */
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [overall, setOverall] = useState<ModelScore | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // progress bars (0..1)
  const [textProg, setTextProg] = useState(0);
  const [audioProg, setAudioProg] = useState(0);
  const [visionProg, setVisionProg] = useState(0);
  const [overallProg, setOverallProg] = useState(0);
  const fakeProgressRef = useRef<number | null>(null);

  // bảng
  const [rows, setRows] = useState<AnalysisRow[]>([]);

  /* ===== cleanup video url ===== */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (fakeProgressRef.current) window.clearInterval(fakeProgressRef.current);
      if (recTimerRef.current) window.clearInterval(recTimerRef.current);
      // stop stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [videoUrl]);

  /* ===== upload handler ===== */
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      if (f.size > 50 * 1024 * 1024) {
        setError("File quá lớn (tối đa 50MB).");
        return;
      }
      setFile(f);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(URL.createObjectURL(f));
      setError(null);
    },
    [videoUrl]
  );

  /* ===== record ===== */
  const startRecording = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ camera/micro.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      recordedChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };
      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const newFile = new File([blob], "recording.webm", { type: blob.type });
        setFile(newFile);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setRecSec(0);
        // tắt stream xem trước
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      mr.start();
      setIsRecording(true);
      setRecSec(0);

      // đếm tới 60s thì dừng
      const timer = window.setInterval(() => {
        setRecSec((s) => {
          const n = s + 1;
          if (n >= MAX_REC_SEC) {
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current.stop();
            }
            window.clearInterval(timer);
          }
          return n;
        });
      }, 1000);
      recTimerRef.current = timer;
    } catch (err) {
      setError("Không truy cập được camera/micro.");
    }
  }, [videoUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (recTimerRef.current) {
      window.clearInterval(recTimerRef.current);
    }
  }, []);

  /* ===== clear ===== */
  const clearAll = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setFile(null);
    setTimeline([]);
    setOverall(null);
    setTranscript(null);
    setError(null);
    setStage(-1);
    setTextProg(0);
    setAudioProg(0);
    setVisionProg(0);
    setOverallProg(0);
    setIsRecording(false);
    setRecSec(0);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [videoUrl]);

  /* ===== analyze thật (gọi backend) ===== */
  const analyze = useCallback(async () => {
    if (!file) {
      setError("Chưa có video để phân tích.");
      return;
    }
    setIsRunning(true);
    setError(null);
    setTimeline([]);
    setOverall(null);
    setStage(0);
    setTextProg(0);
    setAudioProg(0);
    setVisionProg(0);
    setOverallProg(0);

    // fake progress chạy song song
    fakeProgressRef.current = window.setInterval(() => {
      setTextProg((p) => Math.min(0.95, p + Math.random() * 0.06));
      setAudioProg((p) => Math.min(0.95, p + Math.random() * 0.05));
      setVisionProg((p) => Math.min(0.95, p + Math.random() * 0.04));
      setOverallProg((p) => Math.min(0.95, p + Math.random() * 0.03));
    }, 300);

    // show pipeline từng bước
    for (let s = 0; s < 5; s++) {
      setStage(s);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/analyze/video", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        throw new Error("backend trả lỗi");
      }
      const json = await res.json();

      setTimeline(json.timeline ?? []);
      setOverall(json.overall ?? null);
      setTranscript(json.transcript ?? null);

      // lấy điểm cuối
      const last: TimelineItem | undefined = json.timeline?.at(-1);
      const finalText =
        json.overall?.by_modality?.text ?? last?.text?.score ?? 0;
      const finalAudio =
        json.overall?.by_modality?.audio ?? last?.audio?.score ?? 0;
      const finalVision =
        json.overall?.by_modality?.vision ?? last?.vision?.score ?? 0;
      const finalOverall = json.overall?.score ?? 0;

      // animate lên điểm thật
      let tick = 0;
      const anim = window.setInterval(() => {
        tick += 1;
        setTextProg((p) => Math.min(1, p + (finalText - p) * 0.25));
        setAudioProg((p) => Math.min(1, p + (finalAudio - p) * 0.25));
        setVisionProg((p) => Math.min(1, p + (finalVision - p) * 0.25));
        setOverallProg((p) => Math.min(1, p + (finalOverall - p) * 0.25));
        if (tick > 28) window.clearInterval(anim);
      }, 120);

      // đẩy vào bảng
      const row: AnalysisRow = {
        id: crypto.randomUUID(),
        source: "Upload",
        label: json.overall?.label ?? "—",
        confidence: Math.round((json.overall?.score ?? 0) * 100),
        latency: 650 + Math.round(Math.random() * 80),
        time: nowStr(),
        raw: {
          overall: json.overall ?? null,
          timeline: json.timeline ?? [],
          byMod: {
            text: last?.text,
            audio: last?.audio,
            vision: last?.vision,
          },
        },
      };
      setRows((old) => [row, ...old]);
    } catch (err) {
      setError("Lỗi khi phân tích video.");
    } finally {
      if (fakeProgressRef.current) {
        window.clearInterval(fakeProgressRef.current);
      }
      setIsRunning(false);
      setStage(5);
    }
  }, [file]);

  /* ===== DEMO (không gọi backend) ===== */
  const runDemo = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setTimeline([]);
    setOverall(null);
    setStage(0);
    setTextProg(0);
    setAudioProg(0);
    setVisionProg(0);
    setOverallProg(0);

    for (let s = 0; s < 5; s++) {
      setStage(s);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 350));
    }

    const tl = makeDemoTimeline();
    const ov = makeDemoOverall();
    const last = tl[tl.length - 1];

    setTimeline(tl);
    setOverall(ov);
    setTranscript("Demo transcript: hello from mock.");

    // animate %
    let step = 0;
    const anim = window.setInterval(() => {
      step += 1;
      setTextProg((p) => Math.min(1, p + (((last.text?.score ?? 0) - p) * 0.25)));
      setAudioProg((p) => Math.min(1, p + (((last.audio?.score ?? 0) - p) * 0.25)));
      setVisionProg((p) => Math.min(1, p + (((last.vision?.score ?? 0) - p) * 0.25)));
      setOverallProg((p) => Math.min(1, p + (((ov.score ?? 0) - p) * 0.25)));
      if (step > 30) window.clearInterval(anim);
    }, 120);

    // đẩy vào bảng — cái này trước bạn bị thiếu
    setRows((old) => [
      {
        id: crypto.randomUUID(),
        source: "Demo",
        label: ov.label,
        confidence: Math.round(ov.score * 100),
        latency: 600 + Math.round(Math.random() * 120),
        time: nowStr(),
        raw: {
          overall: ov,
          timeline: tl,
          byMod: {
            text: last.text,
            audio: last.audio,
            vision: last.vision,
          },
        },
      },
      ...old,
    ]);

    setIsRunning(false);
    setStage(5);
  }, []);

  /* ===== export bảng ===== */
  const exportRowsJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "max-fusion-results.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  const exportRowsCSV = useCallback(() => {
    const header = "id,source,label,confidence,latency,time\n";
    const body = rows
      .map(
        (r) =>
          `${r.id},${r.source},${r.label},${r.confidence},${r.latency},${r.time}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "max-fusion-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  // nếu bạn cần filter ở component thì return rows thôi
  return {
    // media
    tab,
    setTab,
    file,
    videoUrl,
    videoRef,
    isRecording,
    recSec,
    startRecording,
    stopRecording,

    // analysis
    isRunning,
    stage,
    timeline,
    overall,
    transcript,
    error,

    // progress 0..1
    textProg,
    audioProg,
    visionProg,
    overallProg,

    // bảng
    rows,
    setRows,

    // actions
    onFileChange,
    analyze,
    runDemo,
    clearAll,
    exportRowsJSON,
    exportRowsCSV,

    MAX_REC_SEC,
  };
}
