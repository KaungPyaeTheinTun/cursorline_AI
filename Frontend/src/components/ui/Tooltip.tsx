import { useState, useRef, useCallback, type ReactNode } from "react";

interface TooltipProps {
  readonly children: ReactNode;
  readonly content: ReactNode;
  readonly side?: "right" | "left" | "top" | "bottom";
  readonly delayDuration?: number;
}

export default function Tooltip({ children, content, side = "right", delayDuration = 200 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeoutId = useRef(0);

  const handleEnter = useCallback(() => {
    timeoutId.current = window.setTimeout(() => setOpen(true), delayDuration);
  }, [delayDuration]);

  const handleLeave = useCallback(() => {
    window.clearTimeout(timeoutId.current);
    setOpen(false);
  }, []);

  const position =
    side === "right"
      ? "left-full ml-2 top-1/2 -translate-y-1/2"
      : side === "left"
        ? "right-full mr-2 top-1/2 -translate-y-1/2"
        : side === "top"
          ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
          : "top-full mt-2 left-1/2 -translate-x-1/2";

  const origin =
    side === "right"
      ? "origin-left"
      : side === "left"
        ? "origin-right"
        : side === "top"
          ? "origin-bottom"
          : "origin-top";

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      {open && (
        <div
          className={`absolute z-50 whitespace-nowrap rounded-md border border-line/60 bg-surface px-3 py-1.5 text-xs text-ink shadow-xl shadow-black/40 ${position} ${origin} animate-tooltip-in`}
          style={{ pointerEvents: "none" }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
