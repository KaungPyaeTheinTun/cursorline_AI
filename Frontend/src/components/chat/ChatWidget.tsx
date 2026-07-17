import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "./useChat";
import ChatMessage from "./ChatMessage";
import ChatLauncher from "./ChatLauncher";
import { useNavigate } from "react-router-dom";

const GREETING = {
  role: "assistant" as const,
  content:
    "Hi! I'm Cursorline's AI assistant. Ask me anything about technology, programming, or software development — I'm here to help.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [animState, setAnimState] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useChat(token);
  const [input, setInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback(() => {
    if (isOpen) {
      setAnimState("closing");
      setTimeout(() => {
        setIsOpen(false);
        setAnimState("closed");
      }, 200);
    } else {
      setIsOpen(true);
      setAnimState("opening");
      requestAnimationFrame(() => {
        setAnimState("open");
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (animState === "open") {
      inputRef.current?.focus();
    }
  }, [animState]);

  const displayMessages = hasGreeted ? [GREETING, ...messages] : messages;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleSignIn = () => {
    navigate("/login");
    setIsOpen(false);
    setAnimState("closed");
  };

  const panelClass =
    animState === "opening" || animState === "open"
      ? "animate-chat-in opacity-100 pointer-events-auto"
      : animState === "closing"
        ? "animate-chat-out opacity-0 pointer-events-none"
        : "opacity-0 pointer-events-none scale-95 translate-y-4";

  return (
    <>
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-line bg-bg shadow-2xl sm:right-6 ${panelClass}`}
        >
          <div className="border-b border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green" />
              <span className="font-mono text-sm font-semibold text-ink">
                Cursorline Assistant
              </span>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ maxHeight: "400px" }}
          >
            {displayMessages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {!user && hasGreeted && (
              <div className="rounded-xl border border-line bg-surface p-4 text-center">
                <p className="mb-3 text-sm text-muted">
                  Sign in to start chatting about technology and programming.
                </p>
                <button
                  onClick={handleSignIn}
                  className="rounded-lg bg-blue px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
                >
                  Sign In
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-surface2 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {user ? (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-line bg-surface p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about anything..."
                className="flex-1 rounded-lg border border-line bg-surface2 px-3 py-2 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          ) : (
            <div className="border-t border-line bg-surface p-3 text-center">
              <button
                onClick={handleSignIn}
                className="text-sm font-semibold text-blue hover:underline"
              >
                Sign in to chat
              </button>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 sm:right-6">
        <ChatLauncher isOpen={isOpen} onClick={toggle} />
      </div>
    </>
  );
}
