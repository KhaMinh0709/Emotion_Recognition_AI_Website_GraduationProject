import { useState, useRef, useEffect } from 'react';
import { Video, Mic, Square, Play, Download } from 'lucide-react';

interface MediaCaptureProps {
  mode: 'video' | 'audio';
  onRecordingComplete: (blob: Blob, filename: string) => void;
}

export function MediaCapture({ mode, onRecordingComplete }: MediaCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // 🧹 Dọn tài nguyên khi unmount
  useEffect(() => {
    return () => {
      stopTracks();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const stopTracks = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  // 🎬 Chọn định dạng ghi phù hợp trình duyệt
  const pickMimeType = (): string | undefined => {
    const preferred =
      mode === 'video' ? 'video/webm;codecs=vp9,opus' : 'audio/webm;codecs=opus';
    const fallbackVp8 = 'video/webm;codecs=vp8,opus';
    const fallbackAudio = 'audio/webm';

    const isSupported = (mt: string) =>
      (window as any).MediaRecorder?.isTypeSupported?.(mt) === true;

    if (isSupported(preferred)) return preferred;
    if (mode === 'video' && isSupported(fallbackVp8)) return fallbackVp8;
    if (mode === 'audio' && isSupported(fallbackAudio)) return fallbackAudio;
    return undefined;
  };

  // ▶️ Bắt đầu ghi
  const startRecording = async () => {
    try {
      setError('');
      setRecordedBlob(null);
      setRecordingTime(0);

      const constraints: MediaStreamConstraints =
        mode === 'video' ? { video: true, audio: true } : { audio: true };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current && mode === 'video') {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => void 0);
      }

      const mimeType = pickMimeType();
      const options: MediaRecorderOptions | undefined = mimeType
        ? { mimeType }
        : undefined;

      const RecorderCtor = (window as any).MediaRecorder as typeof window.MediaRecorder;
      if (!RecorderCtor) throw new Error('MediaRecorder API not supported.');

      const recorder = new RecorderCtor(mediaStream, options);
      chunksRef.current = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mode === 'video' ? 'video/webm' : 'audio/webm',
        });
        setRecordedBlob(blob);
        stopTracks();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((s) => s + 1);
      }, 1000);
    } catch (err) {
      let msg = 'Unknown error';
      if (err instanceof DOMException) msg = err.message;
      else if (err instanceof Error) msg = err.message;

      if ((err as any)?.name === 'NotAllowedError') {
        msg += ' — Hãy kiểm tra quyền truy cập camera/microphone của trình duyệt.';
      }

      setError(`Error accessing ${mode}: ${msg}`);
      stopTracks();
    }
  };

  // ⏹ Dừng ghi
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 💾 Gửi dữ liệu ra ngoài
  const handleUseRecording = () => {
    if (recordedBlob) {
      const ext = 'webm';
      const filename = `recorded-${mode}-${Date.now()}.${ext}`;
      onRecordingComplete(recordedBlob, filename);
    }
  };

  // 📥 Tải về file đã ghi
  const downloadRecording = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.${mode === 'video' ? 'webm' : 'webm'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🕓 Định dạng thời gian
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 🎨 Giao diện
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {mode === 'video' && (
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>
      )}

      {mode === 'audio' && isRecording && (
        <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4">
          <Mic className="w-16 h-16 text-red-500 animate-pulse" />
          <div className="text-center">
            <p className="text-white font-medium text-lg">
              {formatTime(recordingTime)}
            </p>
            <p className="text-gray-400 text-sm">Recording audio...</p>
          </div>
        </div>
      )}

      {recordedBlob && !isRecording && (
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center gap-4">
          <div className="text-green-400">
            {mode === 'video' ? (
              <Video className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </div>
          <p className="text-white">
            Recording completed ({formatTime(recordingTime)})
          </p>
          <div className="flex gap-3">
            <button
              onClick={downloadRecording}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleUseRecording}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Use for Analysis
            </button>
          </div>
        </div>
      )}

      {!recordedBlob && !isRecording && (
        <button
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          {mode === 'video' ? <Video className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          Start {mode === 'video' ? 'Video' : 'Audio'} Recording
        </button>
      )}

      {isRecording && (
        <button
          onClick={stopRecording}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
        >
          <Square className="w-5 h-5 fill-current" />
          Stop Recording
        </button>
      )}
    </div>
  );
}

export default MediaCapture;

