// src/features/home/components/SubCard.tsx
import React from "react";

export const SubCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="rounded-xl p-4 bg-white/5 border border-white/10">
    <div className="flex items-center gap-2 font-medium mb-2 text-white">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-gray-300 text-sm">{children}</div>
  </div>
);
