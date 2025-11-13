// src/features/home/components/Section.tsx
import React from "react";

type SectionProps = {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  reveal?: boolean;
};

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  reveal,
}) => {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-gray-800/60 rounded-2xl p-6 border border-gray-700"
      {...(reveal ? { "data-reveal": true } : {})}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-gray-300">{children}</div>
      </div>
    </section>
  );
};
