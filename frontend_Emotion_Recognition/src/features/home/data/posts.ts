// src/features/home/data/posts.ts

export type HomePost = { title: string; href?: string; thumb?: string };

export const HOME_POSTS: HomePost[] = [
  { title: "Sentiment Analysis là gì?", href: "#sentiment-analysis" },
  { title: "Lý do nên sử dụng Sentiment Analysis?", href: "#ly-do" },
  { title: "Cách hoạt động (tóm tắt quy trình)", href: "#cach-hoat-dong" },
  { title: "Các loại hình phân tích cảm xúc", href: "#cac-loai-hinh-pt-cam-xuc" },
  { title: "Ưu điểm và thách thức", href: "#uu-diem-va-thach-thuc" },
  { title: "Ứng dụng thực tế", href: "#ung-dung-thuc-te" },
  { title: "Về khóa luận của nhóm", href: "#khoa-luan" },
];
