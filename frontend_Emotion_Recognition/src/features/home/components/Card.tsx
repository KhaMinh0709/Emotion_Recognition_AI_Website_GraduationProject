// src/features/home/components/Card.tsx
import React from "react";

export const Card: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="rounded-xl p-4 bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:-translate-y-0.5">
    <div className="flex items-center gap-2 font-medium mb-2 text-white">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-gray-300 text-sm">{children}</p>
  </div>
);
