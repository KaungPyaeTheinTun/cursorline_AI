import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [ratio, setRatio] = useState(45);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setRatio(45 / (width / height));
  }, []);

  useEffect(() => {
    document.title = "404 — Cursorline";
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14] overflow-hidden select-none">

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center h-14 px-6">
        <button
          onClick={() => navigate("/")}
          className="font-mono text-lg font-bold tracking-tight text-white/80 hover:text-white transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
        >
          cursor<span className="text-[#5FA8FF]">line</span>
        </button>
      </nav>

      {/* Massive rotated 404 */}
      <div className="absolute inset-0 animate-fadeSlideUp">
        <h1
          className="absolute top-1/2 left-1/2 font-[Eczar] font-extrabold leading-none tracking-[0.025em] m-0 text-[#1a1f2e]"
          style={{
            fontSize: "60vmax",
            transform: `translate(-50%, -50%) rotate(-${ratio}deg)`,
          }}
        >
          404
        </h1>
      </div>

      {/* Message — bottom right */}
      <p className="fixed bottom-4 right-6 z-10 m-0 text-right text-base sm:text-lg text-white/50 font-[Poppins] animate-fadeSlideUp"
        style={{
          width: "min(70%, 400px)",
          textShadow: "-1px -1px 0 #0B0E14, 1px 1px 0 #0B0E14, -1px 1px 0 #0B0E14, 1px -1px 0 #0B0E14",
        }}
      >
        The page you&apos;re looking for does not exist.
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@800&family=Poppins:wght@600&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
