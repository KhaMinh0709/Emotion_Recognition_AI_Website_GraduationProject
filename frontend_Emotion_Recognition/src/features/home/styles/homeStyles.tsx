// src/features/home/styles/homeStyles.tsx
export function HomeStyles() {
  return (
    <style>{`
      html:focus-within { scroll-behavior: smooth; }

      @keyframes softFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
      .animate-soft-float { animation: softFloat 6s ease-in-out infinite; }

      @keyframes gradientX { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
      .animate-gradient-x { background-size: 200% 200%; animation: gradientX 8s ease infinite; }

      @keyframes ribbon { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }
      .animate-ribbon { animation: ribbon 7s linear infinite; }

      @keyframes scrollX { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      .animate-scroll-x { animation: scrollX 25s linear infinite; }
      .mask-fade {
        -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
                mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
      }

      [data-reveal] { opacity: 0; transform: translateY(10px); }
      .reveal-in { opacity: 1; transform: none; transition: all .6s cubic-bezier(.2,.75,.25,1); }

      .figure-zoom { transform: translateZ(0); transition: transform .5s ease, box-shadow .5s ease; }
      .figure-zoom:hover { transform: scale(1.01); box-shadow: 0 10px 40px rgba(68,105,255,.08); }
    `}</style>
  );
}
