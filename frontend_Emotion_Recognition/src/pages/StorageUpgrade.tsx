import React, { useMemo, useState } from "react";
import { HardDrive, Check, Crown, Sparkles } from "lucide-react";

/** tokens + helpers (đồng phong cách với các page mới) */
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");
const card = "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl";
const btn = {
  primary:
    "px-4 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
  subtle:
    "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
};

const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes sweepX{0%{left:-35%}100%{left:100%}}
`;

/** ====== dữ liệu gói (demo) ====== */
type Billing = "monthly" | "yearly";
type Plan = {
  id: string;
  name: string; // 30GB / 100GB...
  storageGB: number;
  monthly: number; // VND
  yearly: number;  // VND
  perks?: string[];
  featured?: boolean;
};
const PLANS: Plan[] = [
  {
    id: "p30",
    name: "30 GB",
    storageGB: 30,
    monthly: 19000,
    yearly: 190000, // “tiết kiệm 16%”
    perks: ["Áp dụng cho Photos, Drive, Gmail"],
    featured: true,
  },
  {
    id: "p100",
    name: "100 GB",
    storageGB: 100,
    monthly: 45000,
    yearly: 450000,
    perks: ["Chia sẻ cho tối đa 5 người", "Hỗ trợ ưu tiên"],
  },
  {
    id: "p200",
    name: "200 GB",
    storageGB: 200,
    monthly: 69000,
    yearly: 690000,
    perks: ["Chia sẻ gia đình", "Bổ sung khu vực khôi phục 30 ngày"],
  },
];

/** format VND ngắn gọn */
const vnd = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + " ₫";

function PlanCard({
  plan,
  billing,
  onSelect,
}: {
  plan: Plan;
  billing: Billing;
  onSelect: (p: Plan, b: Billing) => void;
}) {
  const price = billing === "monthly" ? vnd(plan.monthly) + "/tháng" : vnd(plan.yearly) + "/năm";
  const save =
    billing === "yearly" && plan.yearly < plan.monthly * 12
      ? `Tiết kiệm ${vnd(plan.monthly * 12 - plan.yearly)}`
      : "";

  return (
    <div
      className={cx(
        card,
        "p-5 relative overflow-hidden group",
        plan.featured && "ring-1 ring-sky-500/30"
      )}
    >
      {/* góc glow nhẹ */}
      <div
        className="pointer-events-none absolute -inset-px opacity-30"
        style={{
          background:
            "radial-gradient(600px 80px at 30% 0%, rgba(56,189,248,.25), transparent 60%)",
        }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {plan.featured ? (
            <Crown className="w-5 h-5 text-amber-300" />
          ) : (
            <HardDrive className="w-5 h-5 text-sky-300" />
          )}
          <div className="text-slate-100 font-semibold text-lg">{plan.name}</div>
        </div>
        {plan.featured && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-sky-500/15 text-sky-200 border border-sky-500/30 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Nổi bật
          </span>
        )}
      </div>

      <div className="mt-2 text-slate-300">
        Tổng bộ nhớ áp dụng cho Photos, Drive và Gmail.
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-sky-100">{price}</div>
          {save && <div className="text-slate-400 text-sm line-through opacity-80">{/* gợi ý tiết kiệm hiển thị ở hàng dưới */}</div>}
          {save && <div className="text-emerald-300/90 text-sm">{save}</div>}
        </div>
        <button className={btn.primary} onClick={() => onSelect(plan, billing)}>
          Đăng ký
        </button>
      </div>

      {!!plan.perks?.length && (
        <ul className="mt-4 space-y-1.5">
          {plan.perks.map((p) => (
            <li key={p} className="text-sm text-slate-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StorageUpgrade(): React.ReactElement {
  const [billing, setBilling] = useState<Billing>("monthly");

  const handleSelect = (plan: Plan, bill: Billing) => {
    // TODO: mở checkout thực – hiện để demo
    alert(`Mua gói ${plan.name} – thanh toán ${bill === "monthly" ? "hàng tháng" : "hàng năm"}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <style>{KEYFRAMES}</style>

      {/* Header glow + thanh chạy */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-6">
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background:
              "linear-gradient(90deg,#06b6d4,#4f46e5,#a855f7,#4f46e5,#06b6d4)",
            backgroundSize: "300% 100%",
            animation: "moveX 16s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        <div className="relative px-6 py-7 md:px-10 md:py-9">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
                Mua thêm bộ nhớ
              </h1>
              <p className="text-slate-200/85">
                Bạn có thể hủy bất cứ lúc nào. Phù hợp với giao diện Emotion AI Analyzer.
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
          <div
            className="absolute top-0 left-[-35%] h-[3px] w-[35%] rounded-full"
            style={{
              background: "linear-gradient(90deg,#22d3ee,#a855f7,#22d3ee)",
              animation: "sweepX 2.8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Bộ lọc thanh toán */}
      <div className={cx(card, "p-3 md:p-4 mb-5 flex items-center justify-between")}>
        <div className="text-slate-300">
          Chọn chu kỳ thanh toán:{" "}
          <span className="text-slate-100 font-medium">
            {billing === "monthly" ? "Hàng tháng" : "Hàng năm"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className={cx(
              "px-3 h-10 rounded-xl border transition",
              billing === "monthly"
                ? "bg-sky-500/15 text-sky-200 border-sky-500/30"
                : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
            )}
            onClick={() => setBilling("monthly")}
          >
            Hàng tháng
          </button>
          <button
            className={cx(
              "px-3 h-10 rounded-xl border transition",
              billing === "yearly"
                ? "bg-sky-500/15 text-sky-200 border-sky-500/30"
                : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
            )}
            onClick={() => setBilling("yearly")}
          >
            Hàng năm
          </button>
        </div>
      </div>

      {/* Lưới gói */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} billing={billing} onSelect={handleSelect} />
        ))}
      </div>

      {/* Ghi chú cuối trang */}
      <div className="mt-6 text-sm text-slate-400">
        Tất cả tài khoản đều có 15&nbsp;GB miễn phí. Bộ nhớ mua thêm được tính
        chung cho Drive • Photos • Email. Giá chỉ mang tính minh họa.
      </div>
    </div>
  );
}
