// src/features/home/hooks/useScrollSpy.ts
import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offsetTop = 0) {
  const [activeId, setActiveId] = useState<string>(ids[0] || "");

  useEffect(() => {
    if (!ids.length) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      {
        root: null,
        rootMargin: `${offsetTop}px 0px -55% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids, offsetTop]);

  return activeId;
}
