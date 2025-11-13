// src/features/home/components/Figure.tsx
import React from "react";

export const Figure: React.FC<{ src: string; caption: string }> = ({
  src,
  caption,
}) => (
  <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800 figure-zoom">
    <img src={src} alt={caption} className="w-full h-auto object-cover" />
    <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
      {caption}
    </figcaption>
  </figure>
);
