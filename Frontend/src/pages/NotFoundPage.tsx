import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 — Cursorline";
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0E14] text-white font-sans overflow-hidden">

      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5FA8FF]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-slideUp">
        {/* Large 404 */}
        <h1 className="glitch-404 relative text-[10rem] sm:text-[14rem] md:text-[18rem] font-bold leading-none tracking-tighter select-none">
          404
        </h1>

        {/* Message */}
        <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-white/40 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Divider */}
        <div className="mt-8 sm:mt-10 h-px w-16 bg-white/20" />

        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 sm:mt-8 group relative inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-[#5FA8FF]/40 hover:bg-[#5FA8FF]/10 hover:text-white cursor-pointer"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s ease-out 0.1s both; }

        .glitch-404 {
          color: #e2e8f0;
          text-shadow:
            0.02em 0 0 #ff00c1,
            -0.02em 0 0 #00fff9;
          animation: glitch-404 4s infinite;
        }
        @keyframes glitch-404 {
          0%, 80%, 100% {
            text-shadow:
              0.02em 0 0 #ff00c1,
              -0.02em 0 0 #00fff9;
          }
          82% {
            text-shadow:
              0.05em 0.02em 0 #ff00c1,
              -0.05em -0.02em 0 #00fff9;
          }
          84% {
            text-shadow:
              -0.03em -0.01em 0 #ff00c1,
              0.03em 0.01em 0 #00fff9;
          }
          86% {
            text-shadow:
              0.02em 0 0 #ff00c1,
              -0.02em 0 0 #00fff9;
          }
          88% {
            text-shadow:
              -0.04em 0.03em 0 #ff00c1,
              0.04em -0.03em 0 #00fff9;
          }
          90% {
            text-shadow:
              0.02em 0 0 #ff00c1,
              -0.02em 0 0 #00fff9;
          }
        }
      `}</style>
    </div>
  );
}
