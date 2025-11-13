// src/styles/dashboardStyles.tsx

export function DashboardStyles() {
  return (
    <style>{`
      @keyframes iRotate { from { transform: rotate(0) } to { transform: rotate(360deg) } }
      .i-rotate { animation: iRotate 1.4s linear infinite; }

      @keyframes aurora { 
        0%,100% { transform: translateY(0) scale(1); } 
        50% { transform: translateY(-12px) scale(1.02); } 
      }
      .animate-aurora { animation: aurora 10s ease-in-out infinite; }

      @keyframes float { 
        0%,100% { transform: translateY(0); } 
        50% { transform: translateY(-6px); } 
      }
      .animate-float { animation: float 6.5s ease-in-out infinite; }

      @keyframes ribbon { 
        0% { transform: translateX(-100%); } 
        100% { transform: translateX(400%); } 
      }
      .animate-ribbon { animation: ribbon 7s linear infinite; }
    `}</style>
  );
}
