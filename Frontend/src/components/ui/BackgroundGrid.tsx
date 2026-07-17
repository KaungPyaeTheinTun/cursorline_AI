import { useEffect, useRef } from "react";

export default function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let animId = 0;
    let w = 0;
    let h = 0;
    const GRID = 48;
    const CURSOR_SPEED = 0.0003;
    const POINT_RADIUS = 320;

    let cursorX = 0;
    let cursorY = 0;
    let angle = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = canvas!.parentElement?.clientWidth ?? 0;
      h = canvas!.parentElement?.clientHeight ?? 0;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      angle += CURSOR_SPEED;
      cursorX = w * 0.5 + Math.sin(angle * 1.3) * w * 0.32;
      cursorY = h * 0.45 + Math.cos(angle) * h * 0.28;

      ctx!.strokeStyle = "rgba(35, 42, 56, 0.45)";
      ctx!.lineWidth = 1;

      for (let x = 0; x <= w; x += GRID) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y <= h; y += GRID) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }

      for (let x = 0; x <= w; x += GRID) {
        for (let y = 0; y <= h; y += GRID) {
          const dx = x - cursorX;
          const dy = y - cursorY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < POINT_RADIUS) {
            const intensity = 1 - dist / POINT_RADIUS;
            const alpha = intensity * 0.6;

            ctx!.beginPath();
            ctx!.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(95, 168, 255, ${alpha * 0.4})`;
            ctx!.fill();

            ctx!.beginPath();
            ctx!.arc(x, y, 1.2 + intensity * 1.5, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(95, 168, 255, ${alpha})`;
            ctx!.fill();
          }
        }
      }

      const crossSize = 14;
      ctx!.strokeStyle = "rgba(95, 168, 255, 0.7)";
      ctx!.lineWidth = 1.5;

      ctx!.beginPath();
      ctx!.moveTo(cursorX - crossSize, cursorY);
      ctx!.lineTo(cursorX + crossSize, cursorY);
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.moveTo(cursorX, cursorY - crossSize);
      ctx!.lineTo(cursorX, cursorY + crossSize);
      ctx!.stroke();

      const glow = ctx!.createRadialGradient(
        cursorX, cursorY, 0,
        cursorX, cursorY, 80,
      );
      glow.addColorStop(0, "rgba(95, 168, 255, 0.08)");
      glow.addColorStop(1, "rgba(95, 168, 255, 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(cursorX - 80, cursorY - 80, 160, 160);

      ctx!.beginPath();
      ctx!.arc(cursorX, cursorY, 2, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(95, 168, 255, 0.9)";
      ctx!.fill();

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
