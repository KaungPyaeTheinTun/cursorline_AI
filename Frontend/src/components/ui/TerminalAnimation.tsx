import { useState, useEffect, useCallback, useRef } from "react";

interface Message {
  readonly role: "user" | "assistant";
  readonly text: string;
}

const CONVERSATIONS: Message[][] = [
  [
    { role: "user", text: "Why does getUser() return null?" },
    { role: "assistant", text: "getUser() returns null when the Redis session expires. The session TTL is 24h but the cookie persists longer." },
    { role: "user", text: "How do I fix the TypeError?" },
    { role: "assistant", text: "Add a null-guard before destructuring:\n\nif (!user) return null;\nreturn { uid: user.id };" },
  ],
  [
    { role: "user", text: "Review this endpoint for security issues" },
    { role: "assistant", text: "Found 2 issues:\n1. No rate limiting on auth endpoint\n2. Token not validated before DB lookup" },
    { role: "user", text: "Fix the token validation" },
    { role: "assistant", text: "Validate token format before lookup:\n\nif (!token || token.length < 32)\n  return res(400, 'Invalid token');" },
  ],
  [
    { role: "user", text: "This query is slow on large tables" },
    { role: "assistant", text: "The query scans 50k+ rows without an index. Add a composite index on (user_id, created_at)." },
    { role: "user", text: "Show me the migration" },
    { role: "assistant", text: "CREATE INDEX idx_posts_user_created\nON posts (user_id, created_at DESC);\n\nThis covers the WHERE + ORDER BY in your query." },
  ],
  [
    { role: "user", text: "Refactor this callback to async/await" },
    { role: "assistant", text: "Replace the .then() chain:\n\nconst user = await getUser(id);\nconst posts = await getPosts(user.id);\nreturn { user, posts };" },
    { role: "user", text: "What about error handling?" },
    { role: "assistant", text: "Wrap in try/catch:\n\ntry {\n  const user = await getUser(id);\n  return user;\n} catch (e) {\n  logger.error(e);\n  return null;\n}" },
  ],
];

const CHAR_DELAY = 20;
const LINE_DELAY = 500;
const CONVERSATION_PAUSE = 3500;

export default function TerminalAnimation() {
  const [activeConvo, setActiveConvo] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = CONVERSATIONS[activeConvo]!;
  const currentMessage = messages[visibleMessages];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisibleMessages(messages.length);
      setVisibleChars(0);
      return;
    }

    if (!currentMessage) {
      timerRef.current = setTimeout(() => {
        const next = (activeConvo + 1) % CONVERSATIONS.length;
        setActiveConvo(next);
        setVisibleMessages(0);
        setVisibleChars(0);
      }, CONVERSATION_PAUSE);
      return () => clearTimer();
    }

    const textLen = currentMessage.text.length;

    if (visibleChars < textLen) {
      timerRef.current = setTimeout(() => {
        setVisibleChars((c) => c + 1);
      }, CHAR_DELAY);
      return () => clearTimer();
    }

    timerRef.current = setTimeout(() => {
      setVisibleMessages((v) => v + 1);
      setVisibleChars(0);
    }, LINE_DELAY);
    return () => clearTimer();
  }, [visibleChars, visibleMessages, activeConvo, messages, currentMessage, clearTimer]);

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-2xl shadow-blue/5">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue/20">
          <svg className="h-3.5 w-3.5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span className="font-mono text-sm font-semibold text-ink">Cursorline</span>
        <span className="ml-auto text-xs text-muted">AI Assistant</span>
      </div>

      {/* Messages */}
      <div className="min-h-[340px] max-h-[340px] overflow-y-auto px-5 py-4 space-y-3">
        {messages.slice(0, visibleMessages).map((msg, i) => (
          <Bubble key={`${activeConvo}-${i}`} msg={msg} />
        ))}

        {currentMessage && (
          <TypingBubble
            key={`typing-${activeConvo}-${visibleMessages}`}
            msg={currentMessage}
            chars={visibleChars}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-line px-4 py-2.5">
        <div className="flex items-center gap-3 rounded-lg bg-bg px-3 py-2 text-sm text-muted">
          <svg className="h-4 w-4 shrink-0 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Ask anything about your code...</span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { readonly msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/20 mt-0.5">
            <svg className="h-3 w-3 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-blue/15 text-ink rounded-br-md"
              : "bg-surface2 text-muted border border-line rounded-bl-md"
          }`}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function TypingBubble({
  msg,
  chars,
}: {
  readonly msg: Message;
  readonly chars: number;
}) {
  const isUser = msg.role === "user";
  const displayed = msg.text.slice(0, chars);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/20 mt-0.5">
            <svg className="h-3 w-3 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-blue/15 text-ink rounded-br-md"
              : "bg-surface2 text-muted border border-line rounded-bl-md"
          }`}
        >
          {displayed}
          <span className="animate-pulse text-blue">▌</span>
        </div>
      </div>
    </div>
  );
}
