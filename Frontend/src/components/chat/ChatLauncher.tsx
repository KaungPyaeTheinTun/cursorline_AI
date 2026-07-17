import { useState, useEffect } from "react";

interface ChatLauncherProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
}

export default function ChatLauncher({ isOpen, onClick }: ChatLauncherProps) {
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    setSpin(true);
    const t = setTimeout(() => setSpin(false), 200);
    return () => clearTimeout(t);
  }, [isOpen]);

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-blue shadow-lg shadow-blue/25 text-bg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-bg"
    >
      <span className={spin ? "animate-icon-spin" : ""}>
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
