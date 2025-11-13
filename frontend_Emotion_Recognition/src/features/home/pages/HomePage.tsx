// src/features/home/pages/HomePage.tsx
import React from "react";
import {
  GraduationCap,
  Sparkles,
  Workflow,
  ListChecks,
  Gauge,
  HeartPulse,
  Target,
  Layers,
  Radar,
  Users,
  Shield,
  Megaphone,
  Globe2,
  LineChart,
  Briefcase,
  BookOpen,
  ChevronRight,
  Zap,
} from "lucide-react";

import { HOME_POSTS } from "@/features/home/data/posts";
import { useScrollSpy } from "@/features/home/hooks/useScrollSpy";
import { useReveal } from "@/features/home/hooks/useReveal";
import { Section } from "@/features/home/components/Section";
import { Card } from "@/features/home/components/Card";
import { SubCard } from "@/features/home/components/SubCard";
import { AppItem } from "@/features/home/components/AppItem";
import { Figure } from "@/features/home/components/Figure";
import { HomeStyles } from "@/features/home/styles/homeStyles";

export default function HomePage(): React.ReactElement {
  // lấy list id từ posts
  const sectionIds = HOME_POSTS.map((p) => (p.href || "").replace("#", "")).filter(Boolean);
  const activeId = useScrollSpy(sectionIds, -120);
  useReveal();

  const handleTocClick = (e: React.MouseEvent, href?: string) => {
    if (!href) return;
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">
      <HomeStyles />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-4" data-reveal>
          <GraduationCap className="w-10 h-10 text-blue-400 animate-soft-float" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent animate-gradient-x">
              Emotion AI Analyzer – Trang Giới Thiệu
            </span>
          </h1>
        </div>

        {/* dải chip */}
        <div className="relative overflow-hidden mb-4 mask-fade">
          <div className="flex gap-3 animate-scroll-x will-change-transform">
            {[...HOME_POSTS, ...HOME_POSTS].map((p, i) => (
              <a
                key={`${p.title}-${i}`}
                href={p.href}
                onClick={(ev) => handleTocClick(ev, p.href)}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap hover:-translate-y-0.5"
              >
                {p.title}
              </a>
            ))}
          </div>
        </div>

        <div className="h-1 w-full bg-white/10 overflow-hidden mb-6">
          <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 animate-ribbon" />
        </div>
      </div>

      {/* main grid */}
      <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4">
        {/* left */}
        <div className="lg:col-span-8 space-y-8">
          <Section title="" reveal>
            <p className="text-lg text-gray-300">
              <b>Sentiment Analysis</b> là nền tảng để mở rộng sang <i>Text</i>, <i>Audio</i>,
              <i> Vision</i> – hướng tới nhận diện cảm xúc đa phương thức.
            </p>
            <br />
            <Figure src="/assets/trang-dau.png" caption="Sentiment Analysis" />
          </Section>

          <Section
            id="sentiment-analysis"
            title="Sentiment Analysis là gì?"
            icon={<Zap className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <p>
              <b>Phân tích cảm xúc (Sentiment Analysis)</b> là quá trình tự động xác định thái độ – tích
              cực, tiêu cực hay trung tính – trong văn bản.
            </p>
            <br />
            <Figure src="/assets/hero-sentiment.png" caption="Sentiment Analysis là gì?" />
          </Section>

          <Section
            id="ly-do"
            title="Lý do nên sử dụng Sentiment Analysis?"
            icon={<Sparkles className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Hiểu khách hàng sâu hơn từ hàng nghìn đánh giá/bình luận.</li>
              <li>Theo dõi danh tiếng thương hiệu thời gian thực.</li>
              <li>Cải thiện sản phẩm/dịch vụ dựa trên phản hồi thực.</li>
              <li>Quyết định dựa trên dữ liệu.</li>
              <li>Phát hiện sớm khủng hoảng.</li>
            </ul>
            <br />
            <Figure
              src="/assets/sentiment-analysis-1.jpg"
              caption="Phân loại ý kiến người dùng theo nhóm cảm xúc"
            />
          </Section>

          <Section
            id="cach-hoat-dong"
            title="Cách hoạt động (tóm tắt quy trình)"
            icon={<Workflow className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Thu thập dữ liệu văn bản.</li>
              <li>Tiền xử lý (tokenize, stopword, normalize…).</li>
            </ol>
            <br />
            <Figure
              src="/assets/Cach-hoat-dong-cua-cong-cu-Sentiment-Analysis.jpg"
              caption="Quy trình tổng quát"
            />
            <br />
            <ol start={3} className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Trích xuất đặc trưng.</li>
              <li>Nhận diện cảm xúc.</li>
              <li>Phân tích ý định.</li>
            </ol>
          </Section>

          <Section
            id="cac-loai-hinh-pt-cam-xuc"
            title="Các loại hình phân tích cảm xúc"
            icon={<Layers className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Card title="Đa mức độ (Fine-grained)" icon={<Gauge className="w-5 h-5" />}>
                Thang “Rất tiêu cực → Rất tích cực”.
              </Card>
              <Card title="Theo khía cạnh (Aspect-based)" icon={<ListChecks className="w-5 h-5" />}>
                Gắn cảm xúc với thuộc tính cụ thể.
              </Card>
              <Card title="Nhận diện cảm xúc" icon={<HeartPulse className="w-5 h-5" />}>
                Happy, Sad, Angry, Surprise, Neutral, Fearful, Disgusted…
              </Card>
              <Card title="Phân tích ý định (Intent)" icon={<Radar className="w-5 h-5" />}>
                Xác định mục đích dựa trên ngữ cảnh.
              </Card>
            </div>
            <br />
            <Figure src="/assets/sentiment-analysis-2.jpg" caption="4 dạng Sentiment Analysis chính" />
          </Section>

          <Section
            id="uu-diem-va-thach-thuc"
            title="Ưu điểm và thách thức"
            icon={<Shield className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <div className="grid md:grid-cols-2 gap-6">
              <SubCard title="Ưu điểm" icon={<Shield className="w-5 h-5 text-blue-400" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Tự động, realtime, mở rộng lớn.</li>
                  <li>Giảm thiên lệch chủ quan.</li>
                  <li>Ra quyết định nhanh.</li>
                </ul>
              </SubCard>
              <SubCard title="Thách thức" icon={<BookOpen className="w-5 h-5 text-blue-400" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Mỉa mai/ngữ cảnh.</li>
                  <li>Thiên lệch dữ liệu.</li>
                  <li>Cần giám sát dài hạn.</li>
                </ul>
              </SubCard>
            </div>
            <br />
            <Figure
              src="/assets/Uu-nhuoc-diem-cua-Sentiment-Analysis.png"
              caption="Ưu – nhược điểm"
            />
          </Section>

          <Section
            id="ung-dung-thuc-te"
            title="Ứng dụng thực tế"
            icon={<Briefcase className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AppItem icon={<Users className="w-4 h-4" />} text="Phân tích VoC, CSAT, NPS." />
              <AppItem icon={<Megaphone className="w-4 h-4" />} text="Đo phản hồi truyền thông." />
              <AppItem icon={<Globe2 className="w-4 h-4" />} text="Social listening & danh tiếng." />
              <AppItem icon={<Target className="w-4 h-4" />} text="Ưu tiên tính năng." />
              <AppItem icon={<LineChart className="w-4 h-4" />} text="Market / finance sentiment." />
              <AppItem icon={<Shield className="w-4 h-4" />} text="Phát hiện khủng hoảng." />
            </div>
            <br />
            <Figure
              src="/assets/Ung-dung-cong-nghe-Sentiment-Analysis-trong-thuc-te.jpg"
              caption="Ứng dụng thực tế"
            />
          </Section>

          <Section
            id="khoa-luan"
            title="Về khóa luận của nhóm"
            icon={<Sparkles className="w-5 h-5 text-blue-400" />}
            reveal
          >
            <p className="text-gray-300">
              <b>Emotion AI Analyzer</b> mở rộng từ văn bản sang đa phương thức: Text, Audio, Vision.
              Gồm các mô-đun: Text Sentiment, Audio Sentiment, Vision Sentiment, Fused Model, Max Fusion…
            </p>
          </Section>
        </div>

        {/* right */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6 max-h-[calc(100vh-1.5rem)] overflow-auto space-y-6">
            <div className="bg-gray-800/60 rounded-2xl border border-gray-700" data-reveal>
              <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Nội dung bài viết này</h3>
              </div>
              <ul className="divide-y divide-gray-700">
                {HOME_POSTS.map((p, i) => {
                  const id = (p.href || "").replace("#", "");
                  const active = id && id === activeId;
                  return (
                    <li key={i}>
                      <a
                        href={p.href}
                        onClick={(ev) => handleTocClick(ev, p.href)}
                        className={[
                          "flex items-start gap-3 px-5 py-3 group",
                          active ? "bg-white/5" : "hover:bg-white/5",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "w-10 h-10 rounded flex items-center justify-center shrink-0 border",
                            active
                              ? "bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 border-white/20"
                              : "bg-gray-700/60 border-transparent",
                          ].join(" ")}
                        >
                          <BookOpen
                            className={active ? "w-4 h-4 text-blue-300" : "w-4 h-4 text-gray-300"}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={[
                              "text-sm leading-snug",
                              active
                                ? "text-blue-300"
                                : "text-gray-200 group-hover:text-blue-300",
                            ].join(" ")}
                          >
                            {p.title}
                          </p>
                        </div>
                        <ChevronRight
                          className={
                            active
                              ? "w-4 h-4 text-blue-300 mt-1"
                              : "w-4 h-4 text-gray-500 group-hover:text-blue-300 mt-1"
                          }
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700" data-reveal>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Tuyên bố
              </h4>
              <p className="text-sm text-gray-400">
                Trang Home tổng hợp kiến thức về Sentiment Analysis để giới thiệu khóa luận.
                Bố cục tham khảo từ các blog công nghệ; nội dung được biên soạn phù hợp với đề tài nhóm.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
