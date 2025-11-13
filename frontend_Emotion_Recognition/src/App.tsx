
// import { useState, useEffect } from 'react';
// import { Brain, Upload as UploadIcon, Video, Mic, BarChart3, Loader2 } from 'lucide-react';
// import { FileUploader } from './components/FileUploader';
// import { MediaCapture } from './components/MediaRecorder';
// import { EmotionChart } from './components/EmotionChart';
// import { EmotionTimeline } from './components/EmotionTimeline';
// import { EmotionSummaryCard } from './components/EmotionSummaryCard';
// import { Analysis, AnalysisSummary, EmotionResult, EmotionType, EmotionDistribution } from './types/emotions';
// import DriveLeftSidebar from "./components/DriveLeftSidebar";
// import Dashboard from "./pages/Dashboard";
// import NewAnalysis from "./pages/NewAnalysis";
// import TextSentiment from "./pages/TextSentiment";
// import AudioSentiment from "./pages/AudioSentiment";
// import VisionSentiment from "./pages/VisionSentiment";
// import FusedModel from "./pages/FusedModel";
// import MaxFusion from "./pages/MaxFusion";
// import TrashManager from "./pages/TrashManager";
// import HomePage from './pages/HomePage';
// import ChatWidget from './components/ChatWidget';
// import FooterPape from './components/FooterPape';
// import ReviewQueue from './pages/ReviewQueue';
// import StoragePage from './pages/StoragePage';
// import StorageUpgrade from './pages/StorageUpgrade';


// type TabType = 'upload' | 'video' | 'audio';

// function App() {
//   const [activeTab, setActiveTab] = useState<TabType>('upload');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysis, setAnalysis] = useState<Analysis | null>(null);
//   const [emotionResults, setEmotionResults] = useState<EmotionResult[]>([]);
//   const [summary, setSummary] = useState<AnalysisSummary | null>(null);
//   const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
//   const [activeMenu, setActiveMenu] = useState<"home" | "dashboard" | "new-analysis" | "text-sentiment" | "audio-sentiment" | "vision-sentiment" | "fused-model" | "max-fusion" | "review-queue" | "trash" | "storage" | "storage-upgrade">("home");


//   // Thu hồi URL khi unmount/reset
//   useEffect(() => {
//     return () => {
//       if (analysis?.file_url) URL.revokeObjectURL(analysis.file_url);
//     };
//   }, [analysis?.file_url]);

//   const handleFileSelect = (file: File) => {
//     setSelectedFile(file);
//   };

//   const handleRecordingComplete = (blob: Blob, filename: string) => {
//     const file = new File([blob], filename, { type: blob.type });
//     setSelectedFile(file);
//     setActiveTab('upload');
//   };

//   const simulateAnalysis = async (file: File) => {
//     setIsAnalyzing(true);

//     // giả lập trễ gọi backend
//     await new Promise(resolve => setTimeout(resolve, 1200));

//     const fileUrl = URL.createObjectURL(file);

//     const mockAnalysis: Analysis = {
//       id: crypto.randomUUID(),
//       file_name: file.name,
//       file_type: file.type,
//       file_url: fileUrl,
//       status: 'completed',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };

//     const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'];
//     const mockResults: EmotionResult[] = [];
//     const emotionCounts: Partial<Record<EmotionType, number>> = {};

//     for (let i = 0; i < 20; i++) {
//       const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
//       emotionCounts[randomEmotion] = (emotionCounts[randomEmotion] ?? 0) + 1;

//       mockResults.push({
//         id: crypto.randomUUID(),
//         analysis_id: mockAnalysis.id,
//         timestamp: i * 0.5,
//         emotion_type: randomEmotion,
//         confidence: 0.6 + Math.random() * 0.35,
//         detection_type: file.type.startsWith('video/') ? 'facial' : 'vocal',
//         face_count: file.type.startsWith('video/') ? Math.floor(Math.random() * 3) + 1 : 0,
//         created_at: new Date().toISOString(),
//       });
//     }

//     const total = mockResults.length;
//     const emotionDistribution: EmotionDistribution = {};
//     Object.entries(emotionCounts).forEach(([emo, count]) => {
//       emotionDistribution[emo as EmotionType] = ((count ?? 0) / total) * 100;
//     });

//     const dominantEmotion = (Object.entries(emotionCounts).reduce((a, b) =>
//       (a[1] ?? 0) > (b[1] ?? 0) ? a : b
//     )[0] || 'neutral') as EmotionType;

//     const avgConfidence =
//       mockResults.reduce((sum, r) => sum + r.confidence, 0) / mockResults.length;

//     const mockSummary: AnalysisSummary = {
//       id: crypto.randomUUID(),
//       analysis_id: mockAnalysis.id,
//       dominant_emotion: dominantEmotion,
//       emotion_distribution: emotionDistribution,
//       average_confidence: avgConfidence,
//       total_frames_analyzed: mockResults.length,
//       duration: mockResults[mockResults.length - 1]?.timestamp ?? 0,
//       created_at: new Date().toISOString(),
//     };

//     setAnalysis(mockAnalysis);
//     setEmotionResults(mockResults);
//     setSummary(mockSummary);
//     setIsAnalyzing(false);
//   };

//   const handleAnalyze = () => {
//     if (selectedFile) {
//       simulateAnalysis(selectedFile);
//     }
//   };

//   const handleReset = () => {
//     if (analysis?.file_url) URL.revokeObjectURL(analysis.file_url);
//     setSelectedFile(null);
//     setAnalysis(null);
//     setEmotionResults([]);
//     setSummary(null);
//     setIsAnalyzing(false);
//     setActiveTab('upload');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
//       <DriveLeftSidebar
//         active={activeMenu}
//         onChange={setActiveMenu}
//         onUploadClick={() => setActiveTab('upload')}
//         onRecord={(mode) => setActiveTab(mode === 'video' ? 'video' : 'audio')}
//         usedStorageGB={13.39}
//         totalStorageGB={2048}
//         className="sticky top-0 h-screen hidden md:block"
//         onBuyStorage={() => setActiveMenu("storage-upgrade")}
//       />

//       <div className="flex-1 overflow-y-auto">
//         <div className="container mx-auto px-4 py-8 max-w-7xl">
//           {activeMenu === "home" ? (
//             <HomePage />
//           ) : activeMenu === "dashboard" ? (
//             <Dashboard />
//           ) : activeMenu === "new-analysis" ? (
//             <NewAnalysis />
//           ) : activeMenu === "text-sentiment" ? (
//             <TextSentiment />
//           ) : activeMenu === "audio-sentiment" ? (
//             <AudioSentiment />
//           ) : activeMenu === "vision-sentiment" ? (
//             <VisionSentiment />
//           ) : activeMenu === "fused-model" ? (
//             <FusedModel />
//           ) : activeMenu === "max-fusion" ? (
//             <MaxFusion />
//           ) : activeMenu === "review-queue" ? (
//             <ReviewQueue />
//           ) : activeMenu === "trash" ? (
//             <TrashManager />
//           ) : activeMenu === "storage" ? (
//             <StoragePage />
//           ) : activeMenu === "storage-upgrade" ? (
//             <StorageUpgrade />
//           // ) : (
//           //   <>
//           //     <header className="mb-12 text-center">
//           //       <div className="flex items-center justify-center gap-3 mb-4">
//           //         <Brain className="w-12 h-12 text-blue-400" />
//           //         <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//           //           Emotion AI Analyzer
//           //         </h1>
//           //       </div>
//           //       <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//           //         Upload or record video/audio to analyze facial and vocal emotions in real-time using advanced AI models
//           //       </p>
//           //     </header>

//           //     {!analysis ? (
//           //       <div className="max-w-4xl mx-auto space-y-8">
//           //         <div className="bg-gray-800 card-pad border border-gray-700 shadow-xl round-xl">
//           //           <div className="flex gap-2 mb-6 border-b border-gray-700">
//           //             <button
//           //               onClick={() => setActiveTab('upload')}
//           //               className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'upload'
//           //                 ? 'text-blue-400 border-b-2 border-blue-400'
//           //                 : 'text-gray-400 hover:text-gray-300'
//           //                 }`}
//           //             >
//           //               <UploadIcon className="w-4 h-4" />
//           //               Upload File
//           //             </button>
//           //             <button
//           //               onClick={() => setActiveTab('video')}
//           //               className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'video'
//           //                 ? 'text-blue-400 border-b-2 border-blue-400'
//           //                 : 'text-gray-400 hover:text-gray-300'
//           //                 }`}
//           //             >
//           //               <Video className="w-4 h-4" />
//           //               Record Video
//           //             </button>
//           //             <button
//           //               onClick={() => setActiveTab('audio')}
//           //               className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === 'audio'
//           //                 ? 'text-blue-400 border-b-2 border-blue-400'
//           //                 : 'text-gray-400 hover:text-gray-300'
//           //                 }`}
//           //             >
//           //               <Mic className="w-4 h-4" />
//           //               Record Audio
//           //             </button>
//           //           </div>

//           //           <div className="mt-6">
//           //             {activeTab === 'upload' && (
//           //               <FileUploader onFileSelect={handleFileSelect} />
//           //             )}
//           //             {activeTab === 'video' && (
//           //               <MediaCapture mode="video" onRecordingComplete={handleRecordingComplete} />
//           //             )}
//           //             {activeTab === 'audio' && (
//           //               <MediaCapture mode="audio" onRecordingComplete={handleRecordingComplete} />
//           //             )}
//           //           </div>

//           //           {selectedFile && activeTab === 'upload' && (
//           //             <div className="mt-6 flex gap-3">
//           //               <button
//           //                 onClick={handleAnalyze}
//           //                 className="flex-1 flex items-center justify-center gap-3 btn-pad bg-blue-600 hover:bg-blue-700 round-xl ..."
//           //               >
//           //                 {isAnalyzing ? (
//           //                   <>
//           //                     <Loader2 className="w-5 h-5 animate-spin" />
//           //                     Analyzing...
//           //                   </>
//           //                 ) : (
//           //                   <>
//           //                     <Brain className="w-5 h-5" />
//           //                     Analyze Emotions
//           //                   </>
//           //                 )}
//           //               </button>
//           //             </div>
//           //           )}
//           //         </div>

//           //         <div className="bg-gray-800/50 card-pad-lg border border-gray-700 round-xl">
//           //           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//           //             <BarChart3 className="w-5 h-5 text-blue-400" />
//           //             Supported Emotions
//           //           </h2>
//           //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           //             {['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Fearful', 'Disgusted'].map((emotion) => (
//           //               <div key={emotion} className="bg-gray-700/50 rounded-lg p-3 text-center">
//           //                 <span className="text-gray-200">{emotion}</span>
//           //               </div>
//           //             ))}
//           //           </div>
//           //         </div>
//           //       </div>
//           //     ) : (
//           //       <div className="space-y-8">
//           //         <div className="flex items-center justify-between">
//           //           <h2 className="text-2xl font-bold">Analysis Results</h2>
//           //           <button
//           //             onClick={handleReset}
//           //             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
//           //           >
//           //             New Analysis
//           //           </button>
//           //         </div>

//           //         {summary && <EmotionSummaryCard summary={summary} />}

//           //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           //           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
//           //             <div className="flex items-center justify-between mb-4">
//           //               <h3 className="text-xl font-bold">Emotion Distribution</h3>
//           //               <div className="flex gap-2">
//           //                 <button
//           //                   onClick={() => setChartType('pie')}
//           //                   className={`px-3 py-1 rounded text-sm ${chartType === 'pie' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
//           //                 >
//           //                   Pie
//           //                 </button>
//           //                 <button
//           //                   onClick={() => setChartType('bar')}
//           //                   className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
//           //                 >
//           //                   Bar
//           //                 </button>
//           //               </div>
//           //             </div>
//           //             {summary && (
//           //               <EmotionChart
//           //                 emotionDistribution={summary.emotion_distribution}
//           //                 chartType={chartType}
//           //               />
//           //             )}
//           //           </div>

//           //           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
//           //             <h3 className="text-xl font-bold mb-4">Emotion Timeline</h3>
//           //             <EmotionTimeline emotionResults={emotionResults} />
//           //           </div>
//           //         </div>

//           //         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
//           //           <h3 className="text-xl font-bold mb-4">Detection Details</h3>
//           //           <div className="overflow-x-auto">
//           //             <table className="w-full text-sm">
//           //               <thead>
//           //                 <tr className="border-b border-gray-700">
//           //                   <th className="text-left py-3 px-4">Time</th>
//           //                   <th className="text-left py-3 px-4">Emotion</th>
//           //                   <th className="text-left py-3 px-4">Confidence</th>
//           //                   <th className="text-left py-3 px-4">Type</th>
//           //                 </tr>
//           //               </thead>
//           //               <tbody>
//           //                 {emotionResults.slice(0, 10).map((result) => (
//           //                   <tr key={result.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
//           //                     <td className="py-3 px-4">{result.timestamp.toFixed(1)}s</td>
//           //                     <td className="py-3 px-4 capitalize">{result.emotion_type}</td>
//           //                     <td className="py-3 px-4">{(result.confidence * 100).toFixed(1)}%</td>
//           //                     <td className="py-3 px-4 capitalize">{result.detection_type}</td>
//           //                   </tr>
//           //                 ))}
//           //               </tbody>
//           //             </table>
//           //           </div>
//           //         </div>
//           //       </div>
//           //     )}
//           //   </>
//           ):  null}
//         </div>
//         <FooterPape />
//       </div>
//       <ChatWidget />
//     </div>
//   );
// }

// export default App;





// -----------------------------------------------------------------------------------------------------------














import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { routes } from "./app/routes";
import DriveLeftSidebar from "./components/DriveLeftSidebar";
import ChatWidget from "./components/ChatWidget";
import FooterPape from "./components/FooterPape";

// xác định mục nào đang active để sidebar tô
function useActiveSidebarKey() {
  const { pathname } = useLocation();
  switch (pathname) {
    case "/":
      return "home";
    case "/dashboard":
      return "dashboard";
    case "/new-analysis":
      return "new-analysis";
    case "/audio-sentiment":
      return "audio-sentiment";
    case "/vision-sentiment":
      return "vision-sentiment";    
    case "/max-fusion":
      return "max-fusion";    
    case "/review-queue":
      return "review-queue";
    case "/log":
      return "log";
    case "/trash":
      return "trash";  
    default:
      return "home";
  }
}

function Layout() {
  const navigate = useNavigate();
  const activeKey = useActiveSidebarKey();

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* sidebar đứng im */}
      <DriveLeftSidebar
        active={activeKey}
        className="h-screen sticky top-0"
        onChange={(key) => {
          switch (key) {
            case "home":
              navigate("/");
              break;
            case "dashboard":
              navigate("/dashboard");
              break;
            case "new-analysis":
              navigate("/new-analysis");
              break;    
            case "audio-sentiment":
              navigate("/audio-sentiment");
              break;
            case "vision-sentiment":
              navigate("/vision-sentiment");
              break;
            case "max-fusion":
              navigate("/max-fusion");
              break;
            case "review-queue":
              navigate("/review-queue");
              break;
            case "log":
              navigate("/log");
              break;
            case "trash":
              navigate("/trash");
              break;
            
            default:
              console.log("Chưa gán route:", key);
          }
        }}
      />

      {/* cột phải */}
      <div className="flex-1 h-screen overflow-hidden">
        {/* đây là vùng cuộn duy nhất */}
        <div className="h-full overflow-y-auto">
          {/* để đảm bảo footer luôn nằm sau nội dung */}
          <div className="min-h-full flex flex-col">
            {/* nội dung trang */}
            <main className="px-6 py-6">
              <Suspense fallback={<div>Đang tải...</div>}>
                <Routes>
                  {routes.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
                  ))}
                </Routes>
              </Suspense>
            </main>

            {/* footer cuộn cùng, không bị che nữa */}
            <FooterPape />
          </div>
        </div>
      </div>

      {/* widget nổi */}
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

