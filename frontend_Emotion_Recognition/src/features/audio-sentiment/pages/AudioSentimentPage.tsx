import React, { useState, useEffect } from "react";
import AnimatedHeader from "../components/AnimatedHeader";
import { uiTokens, cx } from "../utils/uiTokens";
import AudioUploadArea from "../components/AudioUploadArea";
import AudioRecordPanel from "../components/AudioRecordPanel";
import WaveformCanvas from "../components/WaveformCanvas";
import PreprocessList from "../components/PreprocessList";
import ErrorAlert from "../components/ErrorAlert";
import AudioResultsTable from "../components/AudioResultsTable";
import AudioSummaryCard from "../components/AudioSummaryCard";
import { useAudioPreview } from "../hooks/useAudioPreview";
import { useRecorder } from "../hooks/useRecorder";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";
import { fetchDemoSample } from "../services/audioService";
import { AudioHistoryRow, AudioSentimentResult } from "../types";
import { formatBytes } from "../utils/formatBytes";

export default function AudioSentimentPage(): React.ReactElement {
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<AudioHistoryRow[]>([]);
  const [displayResult, setDisplayResult] = useState<AudioSentimentResult | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);

  // recorder
  const {
    isRecording,
    level,
    error: recordError,
    recordedBlob,
    startRecording,
    stopRecording,
    setError: setRecordError,
    setRecordedBlob,
  } = useRecorder();

  // preview
  const { audioUrl, audioBuffer, qualityWarnings } = useAudioPreview(
    recordedBlob || file
  );

  // analysis (Analyze thật)
  const {
    loading,
    error: analysisError,
    result,
    analyzeFromFile,
    analyzeFromBlob,
    setError: setAnalysisError,
  } = useAudioAnalysis();

  // khi result từ hook thay đổi (analyze thật) thì hiển thị và thêm vào bảng
  useEffect(() => {
    if (result && currentSource) {
      setDisplayResult(result);
      // thêm vào bảng
      setRows((prev) => [
        {
          id: String(Date.now()) + Math.random().toString(16).slice(2),
          source: currentSource,
          label: result.label,
          confidence: result.confidence,
          latency: result.latency,
          ts: Date.now(),
        },
        ...prev,
      ]);
      setCurrentSource(null);
    }
  }, [result, currentSource]);

  const clearAll = () => {
    setFile(null);
    setRecordedBlob(null);
    setRecordError(null);
    setAnalysisError(null);
    setDisplayResult(null);
    setCurrentSource(null);
  };

  const handleAnalyze = async () => {
    // xác định source để lát nữa thêm vào bảng
    if (recordedBlob) {
      setCurrentSource("Recorded audio");
      await analyzeFromBlob(recordedBlob);
    } else if (file) {
      setCurrentSource(`${file.name} • ${formatBytes(file.size)}`);
      await analyzeFromFile(file);
    } else {
      setAnalysisError("Chưa có audio để phân tích.");
    }
  };

  // DEMO: không gọi backend, chỉ tạo kết quả giả + thêm vào bảng
  const runDemo = async () => {
    const demoFile = await fetchDemoSample();
    setTab("upload");
    setRecordedBlob(null);
    setFile(demoFile);
    setAnalysisError(null);

    const demoResult: AudioSentimentResult = {
      label: "Happy",
      confidence: 0.87,
      topK: [
        { label: "Happy", score: 0.62 },
        { label: "Neutral", score: 0.21 },
        { label: "Surprised", score: 0.11 },
      ],
      latency: 42,
    };

    setDisplayResult(demoResult);

    setRows((prev) => [
      {
        id: String(Date.now()) + Math.random().toString(16).slice(2),
        source: "Demo sample (sine 440Hz)",
        label: demoResult.label,
        confidence: demoResult.confidence,
        latency: demoResult.latency,
        ts: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <AnimatedHeader />

      {/* input card */}
      <div className={cx(uiTokens.card, "p-5 md:p-6")}>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            className={uiTokens.btn.tab}
            data-active={tab === "upload"}
            onClick={() => setTab("upload")}
          >
            Upload
          </button>
          <button
            className={uiTokens.btn.tab}
            data-active={tab === "record"}
            onClick={() => setTab("record")}
          >
            Record
          </button>
          <div className="ml-auto">
            <button className={uiTokens.btn.icon} onClick={clearAll}>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  d="M3 6h18M8 6v12m8-12v12M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Upload */}
        {tab === "upload" && (
          <AudioUploadArea
            file={file}
            blob={recordedBlob}
            onFileSelected={(f) => {
              setFile(f);
              setRecordedBlob(null);
            }}
            onError={setAnalysisError}
          />
        )}

        {/* Record */}
        {tab === "record" && (
          <AudioRecordPanel
            isRecording={isRecording}
            level={level}
            onStart={startRecording}
            onStop={stopRecording}
          />
        )}

        {/* Preview */}
        <div className="mt-6 space-y-3">
          <div className="text-sm text-slate-400">Preview</div>
          <WaveformCanvas audioBuffer={audioBuffer} />
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full mt-2" />
          )}
        </div>

        {/* Preprocess */}
        <PreprocessList warnings={qualityWarnings} />

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={uiTokens.btn.primary}
              onClick={handleAnalyze}
              disabled={loading || (!file && !recordedBlob)}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-0.5 mr-1 h-4 w-4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Analyzing…
                </>
              ) : (
                "Analyze"
              )}
            </button>

            <button className={uiTokens.btn.ghost} onClick={clearAll}>
              Clear
            </button>

            <button
                className={uiTokens.btn.subtle}
                onClick={runDemo}
                disabled={loading}
            >
              Demo (auto sample)
            </button>
          </div>
        </div>

        {/* Errors */}
        {analysisError && (
          <ErrorAlert message={analysisError} onRetry={handleAnalyze} />
        )}
        {recordError && (
          <ErrorAlert message={recordError} onRetry={startRecording} />
        )}
      </div>

      {/* KHUNG MỚI: summary ngang giống vision */}
      <AudioSummaryCard result={displayResult} />

      {/* Bảng lịch sử */}
      <AudioResultsTable
        rows={rows}
        onClear={() => setRows([])}
        onDeleteRow={handleDeleteRow}
      />

      <div className="mt-6 text-sm text-slate-400">
        Tips: Ghi trong phòng yên tĩnh · Tránh echo mạnh · Giữ micro cách miệng
        10–15cm.
      </div>
    </div>
  );
}
