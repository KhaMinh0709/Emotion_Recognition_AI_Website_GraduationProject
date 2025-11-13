import { lazy } from 'react';

// Giữ nguyên đường dẫn tới các page hiện có trong src/pages/
// Đổi tên theo đúng file của bạn (nếu khác).
export const routes = [
  { path: '/',                      element: lazy(() => import('../features/home/pages/HomePage')) },
  { path: 'home',                   element: lazy(() => import('../features/home/pages/HomePage')) },
  { path: 'dashboard',              element: lazy(() => import('../features/dashboard/pages/Dashboard')) },
  { path: '/audio-sentiment',       element: lazy(() => import('../features/audio-sentiment/pages/AudioSentimentPage')) },
  { path: '/vision-sentiment',      element: lazy(() => import('../features/vision-sentiment/pages/VisionSentimentPage')) },
  { path: '/max-fusion',            element: lazy(() => import('../features/max-fusion-video/pages/MaxFusionPage')) },
  { path: '/log',                   element: lazy(() => import('../features/log/pages/LogPage')) },



  { path: 'text-sentiment',         element: lazy(() => import('../pages/Dashboard')) },
  { path: '/audio',                 element: lazy(() => import('../features/audio-sentiment/pages/AudioSentimentPage')) },
  { path: '/review-queue',          element: lazy(() => import('../pages/ReviewQueue')) },
  { path: '/trash',                 element: lazy(() => import('../pages/TrashManager')) },
  { path: '/max-fusion',             element: lazy(() => import('../features/max-fusion-video/pages/MaxFusionPage')) },
  { path: '/vision-sentiment',      element: lazy(() => import('../features/vision-sentiment/pages/VisionSentimentPage')) },
  { path: '/fused-model',           element: lazy(() => import('../pages/FusedModel')) },
  { path: '/storage',               element: lazy(() => import('../pages/StoragePage')) },
];
