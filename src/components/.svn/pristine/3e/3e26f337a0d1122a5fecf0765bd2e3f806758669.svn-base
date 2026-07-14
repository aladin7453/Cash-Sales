import React from "react";

// Way to use
//<LoadingUIV2 />
//<LoadingUIV2 size={80} />
//<LoadingUIV2 color="#10b981" ballColor="#34d399" />

export default function LoadingUIV2({
  size = 60,
  color = "#3b82f6",
  ballColor = "#60a5fa",
}) {
  return (
    <>
      <div
        className="loading-v2"
        style={{ width: size, height: size * 1.33 }}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`loading-v2__bar bar-${i + 1}`} />
        ))}
        <div className="loading-v2__ball" />
      </div>

      <span className="text-md mt-1">Loading</span>

      <style jsx>{`
        .loading-v2 {
          position: relative;
        }

        .loading-v2__bar {
          position: absolute;
          bottom: 0;
          width: ${size * 0.13}px;
          height: 50%;
          background: ${color};
          transform-origin: center bottom;
          border-radius: 3px;
        }

        .bar-1 { left: 0; transform: scale(1, 0.2); animation: barUp1 4s infinite; }
        .bar-2 { left: ${size * 0.2}px; transform: scale(1, 0.4); animation: barUp2 4s infinite; }
        .bar-3 { left: ${size * 0.4}px; transform: scale(1, 0.6); animation: barUp3 4s infinite; }
        .bar-4 { left: ${size * 0.6}px; transform: scale(1, 0.8); animation: barUp4 4s infinite; }
        .bar-5 { left: ${size * 0.8}px; transform: scale(1, 1); animation: barUp5 4s infinite; }

        .loading-v2__ball {
          position: absolute;
          bottom: ${size * 0.13}px;
          left: 0;
          width: ${size * 0.13}px;
          height: ${size * 0.13}px;
          background: ${ballColor};
          border-radius: 50%;
          animation: ballMove 4s infinite;
        }

        @keyframes ballMove {
          0% { transform: translate(0, 0); }
          5% { transform: translate(8px, -12px); }
          10% { transform: translate(12px, -8px); }
          17% { transform: translate(20px, -20px); }
          20% { transform: translate(24px, -16px); }
          27% { transform: translate(32px, -28px); }
          30% { transform: translate(36px, -24px); }
          37% { transform: translate(44px, -36px); }
          40% { transform: translate(48px, -32px); }
          50% { transform: translate(48px, 0); }
          57% { transform: translate(44px, -12px); }
          60% { transform: translate(36px, -8px); }
          67% { transform: translate(28px, -20px); }
          70% { transform: translate(24px, -16px); }
          77% { transform: translate(16px, -28px); }
          80% { transform: translate(12px, -24px); }
          87% { transform: translate(6px, -36px); }
          90% { transform: translate(0, -32px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes barUp1 {
          0%,40% { transform: scale(1,0.2); }
          50%,90% { transform: scale(1,1); }
          100% { transform: scale(1,0.2); }
        }

        @keyframes barUp2 {
          0%,40% { transform: scale(1,0.4); }
          50%,90% { transform: scale(1,0.8); }
          100% { transform: scale(1,0.4); }
        }

        @keyframes barUp3 {
          0%,100% { transform: scale(1,0.6); }
        }

        @keyframes barUp4 {
          0%,40% { transform: scale(1,0.8); }
          50%,90% { transform: scale(1,0.4); }
          100% { transform: scale(1,0.8); }
        }

        @keyframes barUp5 {
          0%,40% { transform: scale(1,1); }
          50%,90% { transform: scale(1,0.2); }
          100% { transform: scale(1,1); }
        }
      `}</style>
    </>
  );
}