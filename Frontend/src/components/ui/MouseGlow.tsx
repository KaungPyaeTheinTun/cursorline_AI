import { useRef, useCallback } from 'react';

interface MouseGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
}

export default function MouseGlow({
  children,
  className = '',
  glowColor = 'rgba(95, 168, 255, 0.07)',
  glowSize = 400,
}: MouseGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      const glow = glowRef.current;
      if (!el || !glow) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.opacity = '1';
      glow.style.transform = `translate(${x - glowSize / 2}px, ${y - glowSize / 2}px)`;
    },
    [glowSize],
  );

  const handleMouseLeave = useCallback(() => {
    const glow = glowRef.current;
    if (glow) glow.style.opacity = '0';
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-0 left-0 z-0 opacity-0 transition-opacity duration-500"
        style={{
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          willChange: 'transform',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
