// src/features/home/components/AppItem.tsx
import React from "react";

export const AppItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition">
    {icon}
    <span className="text-sm text-gray-300">{text}</span>
  </div>
);
