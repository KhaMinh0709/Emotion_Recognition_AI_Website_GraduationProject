import { useState, useEffect } from 'react';
import { Brain, Upload as UploadIcon, Video, Mic, BarChart3, Loader2 } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { MediaCapture } from '../components/MediaRecorder';
import { EmotionChart } from '../components/EmotionChart';
import { EmotionTimeline } from '../components/EmotionTimeline';
import { EmotionSummaryCard } from '../components/EmotionSummaryCard';
import { Analysis, AnalysisSummary, EmotionResult, EmotionType, EmotionDistribution } from '../types/emotions';

type TabType = 'upload' | 'video' | 'audio';

/* =============== keyframes (từ trang Text) =============== */
const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes floatDot{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes runLine{0%{left:-35%}100%{left:100%}}
`;

type AnimatedHeaderProps = {
  title?: string;
  subtitle?: string;
  badges?: string[];
  bgColors?: [string, string, string, string];
  lineColors?: [string, string, string];
};

/* Animated Header Component */
const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title = "Audio Sentiment",
  subtitle = "Nền tảng phân tích cảm xúc cho Audio (mở rộng Text, Vision).",
  badges = ["Glow UI", "Realtime-ready"],
  bgColors = ["#06b6d4", "#4f46e5", "#a855f7", "#4f46e5"],
  lineColors = ["#22d3ee", "#a855f7", "#22d3ee"],
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
    <style>{KEYFRAMES}</style>
    <div
      className="absolute inset-0 opacity-75"
      style={{
        background: `linear-gradient(90deg,${bgColors[0]},${bgColors[1]},${bgColors[2]},${bgColors[3]},${bgColors[0]})`,
        backgroundSize: "300% 100%",
        animation: "moveX 2.8s linear infinite",
      }}
    />
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${(i * 57) % 100}%`,
            top: `${(i * 37) % 100}%`,
            opacity: 0.35,
            animation: `floatDot ${6 + (i % 5)}s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
    
    <div className="relative px-6 py-7 md:px-10 md:py-9">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
          <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
            <path d="M9 18V6l8-3v18l-8-3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">{title}</h1>
          <p className="text-slate-200/85">{subtitle}</p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2">
          {badges.map((b) => (
            <span key={b} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-100">{b}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
      <div
        className="absolute top-0 h-[3px] w-[35%] rounded-full"
        style={{
          background: `linear-gradient(90deg,${lineColors[0]},${lineColors[1]},${lineColors[2]})`,
          animation: "runLine 8s linear infinite",
        }}
      />
    </div>
  </div>
);

export default function NewAnalysis() {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [emotionResults, setEmotionResults] = useState<EmotionResult[]>([]);
    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    // Thu hồi URL khi unmount/reset
    useEffect(() => {
        return () => {
            if (analysis?.file_url) URL.revokeObjectURL(analysis.file_url);
        };
    }, [analysis?.file_url]);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleRecordingComplete = (blob: Blob, filename: string) => {
        const file = new File([blob], filename, { type: blob.type });
        setSelectedFile(file);
        setActiveTab('upload');
    };

    const simulateAnalysis = async (file: File) => {
        setIsAnalyzing(true);

        // giả lập trễ gọi backend
        await new Promise(resolve => setTimeout(resolve, 1200));

        const fileUrl = URL.createObjectURL(file);

        const mockAnalysis: Analysis = {
            id: crypto.randomUUID(),
            file_name: file.name,
            file_type: file.type,
            file_url: fileUrl,
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'];
        const mockResults: EmotionResult[] = [];
        const emotionCounts: Partial<Record<EmotionType, number>> = {};

        for (let i = 0; i < 20; i++) {
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
            emotionCounts[randomEmotion] = (emotionCounts[randomEmotion] ?? 0) + 1;

            mockResults.push({
                id: crypto.randomUUID(),
                analysis_id: mockAnalysis.id,
                timestamp: i * 0.5,
                emotion_type: randomEmotion,
                confidence: 0.6 + Math.random() * 0.35,
                detection_type: file.type.startsWith('video/') ? 'facial' : 'vocal',
                face_count: file.type.startsWith('video/') ? Math.floor(Math.random() * 3) + 1 : 0,
                created_at: new Date().toISOString(),
            });
        }

        const total = mockResults.length;
        const emotionDistribution: EmotionDistribution = {};
        Object.entries(emotionCounts).forEach(([emo, count]) => {
            emotionDistribution[emo as EmotionType] = ((count ?? 0) / total) * 100;
        });

        const dominantEmotion = (Object.entries(emotionCounts).reduce((a, b) =>
            (a[1] ?? 0) > (b[1] ?? 0) ? a : b
        )[0] || 'neutral') as EmotionType;

        const avgConfidence =
            mockResults.reduce((sum, r) => sum + r.confidence, 0) / mockResults.length;

        const mockSummary: AnalysisSummary = {
            id: crypto.randomUUID(),
            analysis_id: mockAnalysis.id,
            dominant_emotion: dominantEmotion,
            emotion_distribution: emotionDistribution,
            average_confidence: avgConfidence,
            total_frames_analyzed: mockResults.length,
            duration: mockResults[mockResults.length - 1]?.timestamp ?? 0,
            created_at: new Date().toISOString(),
        };

        setAnalysis(mockAnalysis);
        setEmotionResults(mockResults);
        setSummary(mockSummary);
        setIsAnalyzing(false);
    };

    const handleAnalyze = () => {
        if (selectedFile) {
            simulateAnalysis(selectedFile);
        }
    };

    const handleReset = () => {
        if (analysis?.file_url) URL.revokeObjectURL(analysis.file_url);
        setSelectedFile(null);
        setAnalysis(null);
        setEmotionResults([]);
        setSummary(null);
        setIsAnalyzing(false);
        setActiveTab('upload');
    };

    return (
        <>
            <AnimatedHeader 
                title = "New Emotion Analysis"
                subtitle = "Upload or record video/audio to analyze emotions in real-time."
                badges = {["Glow UI", "Realtime-ready"]}
                bgColors = {["#06b6d4", "#4f46e5", "#a855f7", "#4f46e5"]}
                lineColors = {["#22d3ee", "#a855f7", "#22d3ee"]}
            />

            <header className="mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Brain className="w-12 h-12 text-blue-400" />
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Emotion AI Analyzer
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Upload or record video/audio to analyze facial and vocal emotions in real-time using advanced AI models
                </p>
            </header>

            {!analysis ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-gray-800 card-pad border border-gray-700 shadow-xl round-xl">
                        <div className="flex gap-2 mb-6 border-b border-gray-700">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'upload'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <UploadIcon className="w-4 h-4" />
                                Upload File
                            </button>
                            <button
                                onClick={() => setActiveTab('video')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'video'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <Video className="w-4 h-4" />
                                Record Video
                            </button>
                            <button
                                onClick={() => setActiveTab('audio')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'audio'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <Mic className="w-4 h-4" />
                                Record Audio
                            </button>
                        </div>

                        <div className="mt-6">
                            {activeTab === 'upload' && (
                                <FileUploader onFileSelect={handleFileSelect} />
                            )}
                            {activeTab === 'video' && (
                                <MediaCapture mode="video" onRecordingComplete={handleRecordingComplete} />
                            )}
                            {activeTab === 'audio' && (
                                <MediaCapture mode="audio" onRecordingComplete={handleRecordingComplete} />
                            )}
                        </div>

                        {selectedFile && activeTab === 'upload' && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handleAnalyze}
                                    className="flex-1 flex items-center justify-center gap-3 btn-pad bg-blue-600 hover:bg-blue-700 round-xl"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="w-5 h-5" />
                                            Analyze Emotions
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-800/50 card-pad-lg border border-gray-700 round-xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            Supported Emotions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Fearful', 'Disgusted'].map((emotion) => (
                                <div key={emotion} className="bg-gray-700/50 rounded-lg p-3 text-center">
                                    <span className="text-gray-200">{emotion}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Analysis Results</h2>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            New Analysis
                        </button>
                    </div>

                    {summary && <EmotionSummaryCard summary={summary} />}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Emotion Distribution</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setChartType('pie')}
                                        className={`px-3 py-1 rounded text-sm ${chartType === 'pie' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                    >
                                        Pie
                                    </button>
                                    <button
                                        onClick={() => setChartType('bar')}
                                        className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                    >
                                        Bar
                                    </button>
                                </div>
                            </div>
                            {summary && (
                                <EmotionChart
                                    emotionDistribution={summary.emotion_distribution}
                                    chartType={chartType}
                                />
                            )}
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                            <h3 className="text-xl font-bold mb-4">Emotion Timeline</h3>
                            <EmotionTimeline emotionResults={emotionResults} />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Detection Details</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4">Time</th>
                                        <th className="text-left py-3 px-4">Emotion</th>
                                        <th className="text-left py-3 px-4">Confidence</th>
                                        <th className="text-left py-3 px-4">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emotionResults.slice(0, 10).map((result) => (
                                        <tr key={result.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                            <td className="py-3 px-4">{result.timestamp.toFixed(1)}s</td>
                                            <td className="py-3 px-4 capitalize">{result.emotion_type}</td>
                                            <td className="py-3 px-4">{(result.confidence * 100).toFixed(1)}%</td>
                                            <td className="py-3 px-4 capitalize">{result.detection_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}