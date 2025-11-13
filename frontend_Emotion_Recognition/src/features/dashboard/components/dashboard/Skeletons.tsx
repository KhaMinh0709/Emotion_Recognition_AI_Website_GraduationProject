// src/components/dashboard/Skeletons.tsx
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="h-8 w-64 bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-5 w-80 bg-white/10 rounded mb-2 animate-pulse" />
      <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
      <div className="h-5 w-40 bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-56 bg-white/10 rounded animate-pulse" />
    </div>
  );
}
