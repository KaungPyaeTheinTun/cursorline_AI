import { useState, useCallback, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../hooks/useAuth";
import { useConversations, type Message } from "../hooks/useConversations";
import ChatSidebar from "../components/chat/ChatSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const remarkPlugins = [remarkGfm];

const markdownComponents = {
  code({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    const isInline = !className && !codeString.includes("\n");

    if (isInline) {
      return (
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-blue" {...props}>
          {children}
        </code>
      );
    }

    return <CodeBlock language={match?.[1]}>{codeString}</CodeBlock>;
  },
  h1({ children }: { children?: React.ReactNode }) {
    return <h1 className="mb-3 mt-6 font-mono text-xl font-bold first:mt-0">{children}</h1>;
  },
  h2({ children }: { children?: React.ReactNode }) {
    return <h2 className="mb-2 mt-5 font-mono text-lg font-bold first:mt-0">{children}</h2>;
  },
  h3({ children }: { children?: React.ReactNode }) {
    return <h3 className="mb-2 mt-4 font-mono text-base font-bold first:mt-0">{children}</h3>;
  },
  p({ children }: { children?: React.ReactNode }) {
    return <p className="mb-3 leading-relaxed last:mb-0">{children}</p>;
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>;
  },
  ol({ children }: { children?: React.ReactNode }) {
    return <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>;
  },
  li({ children }: { children?: React.ReactNode }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong className="font-semibold text-ink">{children}</strong>;
  },
  a({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue underline decoration-blue/30 transition-colors hover:decoration-blue">
        {children}
      </a>
    );
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    return (
      <blockquote className="my-3 border-l-4 border-blue pl-4 text-muted">
        {children}
      </blockquote>
    );
  },
  table({ children }: { children?: React.ReactNode }) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }: { children?: React.ReactNode }) {
    return <thead className="border-b border-line">{children}</thead>;
  },
  th({ children }: { children?: React.ReactNode }) {
    return <th className="px-3 py-2 text-left font-semibold">{children}</th>;
  },
  td({ children }: { children?: React.ReactNode }) {
    return <td className="border-b border-line px-3 py-2">{children}</td>;
  },
  hr() {
    return <hr className="my-4 border-line" />;
  },
};

const CopyIcon = memo(function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
  );
});

const CheckIcon = memo(function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
});

const CodeBlock = memo(function CodeBlock({ language, children }: { readonly language?: string; readonly children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between bg-surface px-4 py-2">
        <span className="font-mono text-xs text-muted">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-bg px-4 py-3">
        <code className="font-mono text-sm leading-relaxed text-ink">{children}</code>
      </pre>
    </div>
  );
});

const MarkdownContent = memo(function MarkdownContent({ content }: { readonly content: string }) {
  return (
    <Markdown remarkPlugins={remarkPlugins} components={markdownComponents}>
      {content}
    </Markdown>
  );
});

function MessageSkeleton() {
  return (
    <div className="mx-auto mb-6 max-w-3xl space-y-5 animate-shimmer">
      <div className="flex justify-end">
        <div className="h-10 w-64 rounded-2xl rounded-br-md bg-surface2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-surface2" />
        <div className="h-4 w-[85%] rounded bg-surface2" />
        <div className="h-4 w-[70%] rounded bg-surface2" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-48 rounded-2xl rounded-br-md bg-surface2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-[90%] rounded bg-surface2" />
        <div className="h-4 w-[60%] rounded bg-surface2" />
      </div>
    </div>
  );
}

function InputSkeleton() {
  return (
    <div className="border-t border-line bg-surface px-4 py-3 md:px-6 md:py-4 pb-20 md:pb-4 animate-shimmer">
      <div className="mx-auto flex max-w-3xl gap-2 md:gap-3">
        <div className="flex-1 h-12 rounded-xl bg-surface2" />
        <div className="h-12 w-20 rounded-xl bg-surface2" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex h-full flex-col bg-surface animate-shimmer">
      <div className="border-b border-line px-3 py-3">
        <div className="h-8 w-full rounded-lg bg-surface2" />
      </div>
      <div className="flex-1 space-y-1 p-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-surface2" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-[70%] rounded bg-surface2" />
              <div className="h-2.5 w-[45%] rounded bg-surface2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingSkeleton() {
  return (
    <div className="mx-auto mb-6 max-w-3xl animate-shimmer">
      <div className="space-y-2">
        <div className="h-4 w-[75%] rounded bg-surface2" />
        <div className="h-4 w-[50%] rounded bg-surface2" />
      </div>
    </div>
  );
}

const UserMessage = memo(function UserMessage({ content }: { readonly content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-blue/20 px-5 py-3 text-sm leading-relaxed text-ink">
        {content}
      </div>
    </div>
  );
});

const AssistantMessage = memo(function AssistantMessage({ content }: { readonly content: string }) {
  return (
    <div className="text-sm leading-relaxed text-ink">
      <MarkdownContent content={content} />
    </div>
  );
});

function MessageItem({ msg }: { readonly msg: Message }) {
  return (
    <div className={`mx-auto mb-6 max-w-3xl ${msg.role === "user" ? "flex justify-end" : ""}`}>
      {msg.role === "user" ? (
        <UserMessage content={msg.content} />
      ) : (
        <AssistantMessage content={msg.content} />
      )}
    </div>
  );
}

const StreamingMessage = memo(function StreamingMessage({ content }: { readonly content: string }) {
  return (
    <div className="mx-auto mb-6 max-w-3xl">
      <div className="text-sm leading-relaxed text-ink">
        <MarkdownContent content={content} />
        <span className="inline-block h-4 w-0.5 animate-pulse bg-blue align-middle" />
      </div>
    </div>
  );
});

export default function BuildPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    activeId,
    activeMessages,
    createConversation,
    appendMessage,
    deleteConversation,
    selectConversation,
    newChat,
    isLoadingConversations,
    isLoadingMessages,
    } = useConversations();

  const [messages, setMessages] = useState<readonly Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [accessExpired, setAccessExpired] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const currentConvoIdRef = useRef<number | null>(null);
  const messagesRef = useRef<readonly Message[]>([]);
  const isStreamingRef = useRef(false);
  const scrollTimeoutRef = useRef(0);

  messagesRef.current = messages;
  isStreamingRef.current = isStreaming;

  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) return;
    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollTimeoutRef.current = 0;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreamingRef.current) return;
      isStreamingRef.current = true;

      setAccessExpired(null);

      const userMessage: Message = { role: "user", content };

      try {
        let convoId = currentConvoIdRef.current;

        if (!convoId) {
          convoId = await createConversation(content);
          currentConvoIdRef.current = convoId;
        }

        const updatedMessages = [...messagesRef.current, userMessage];
        setMessages(updatedMessages);

        appendMessage(convoId, userMessage).catch(() => {});

        setStreamingContent("");
        setIsStreaming(true);
        setInput("");

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const abortController = new AbortController();
        abortRef.current = abortController;

        const response = await fetch(`${API_URL}/chat/stream`, {
          method: "POST",
          headers,
          body: JSON.stringify({ messages: updatedMessages }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          let msg = "Failed to get response.";
          try {
            const data = await response.json();
            msg = data?.message || data?.error || msg;
            if (response.status === 403) {
              setAccessExpired(msg);
              setIsStreaming(false);
              isStreamingRef.current = false;
              return;
            }
          } catch {
            msg = `Server error (${response.status}).`;
          }
          throw new Error(msg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No stream reader.");

        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);

            if (data === "[DONE]") {
              const assistantMessage: Message = { role: "assistant", content: fullContent };
              setMessages((prev) => [...prev, assistantMessage]);
              if (currentConvoIdRef.current) {
                appendMessage(currentConvoIdRef.current, assistantMessage).catch(() => {});
              }
              setStreamingContent("");
              setIsStreaming(false);
              isStreamingRef.current = false;
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch {
              // skip malformed JSON
            }
          }
        }

        if (fullContent) {
          const assistantMessage: Message = { role: "assistant", content: fullContent };
          setMessages((prev) => [...prev, assistantMessage]);
          if (currentConvoIdRef.current) {
            appendMessage(currentConvoIdRef.current, assistantMessage).catch(() => {});
          }
        }
        setStreamingContent("");
        setIsStreaming(false);
        isStreamingRef.current = false;
      } catch (err) {
        isStreamingRef.current = false;
        if (err instanceof DOMException && err.name === "AbortError") {
          setIsStreaming(false);
          setStreamingContent("");
          return;
        }
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        const assistantMessage: Message = { role: "assistant", content: `Error: ${msg}` };
        setMessages((prev) => [...prev, assistantMessage]);
        if (currentConvoIdRef.current) {
          appendMessage(currentConvoIdRef.current, assistantMessage).catch(() => {});
        }
        setStreamingContent("");
        setIsStreaming(false);
      }
    },
    [token, createConversation, appendMessage],
  );

  const handleSelectConversation = useCallback(
    (id: number) => {
      abortRef.current?.abort();
      setIsStreaming(false);
      setStreamingContent("");
      currentConvoIdRef.current = id;
      selectConversation(id);
    },
    [selectConversation],
  );

  useEffect(() => {
    if (activeId !== null) {
      setMessages(activeMessages);
    }
  }, [activeId, activeMessages]);

  const handleNewChat = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent("");
    setMessages([]);
    currentConvoIdRef.current = null;
    newChat();
  }, [newChat]);

  const handleDeleteConversation = useCallback(
    (id: number) => {
      deleteConversation(id);
      if (currentConvoIdRef.current === id) {
        abortRef.current?.abort();
        setIsStreaming(false);
        setStreamingContent("");
        setMessages([]);
        currentConvoIdRef.current = null;
      }
    },
    [deleteConversation],
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  return (
    <div className="flex h-screen bg-bg pt-16 md:pt-[72px]">
      {/* Full page skeleton on initial load */}
      {isLoadingConversations ? (
        <>
          {/* Desktop sidebar skeleton */}
          <div className="hidden md:block shrink-0" style={{ width: sidebarOpen ? 256 : 48 }}>
            {sidebarOpen && <SidebarSkeleton />}
          </div>
          {/* Mobile sidebar skeleton */}
          <div className={`md:hidden fixed inset-y-0 left-0 z-40 pt-16 overflow-hidden ${sidebarOpen ? "w-64" : "w-0"}`}>
            <div className="h-full w-64">
              <SidebarSkeleton />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center border-b border-line px-3 py-2 md:px-4">
              <div className="h-9 w-9 rounded-lg bg-surface2 animate-shimmer" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
              <MessageSkeleton />
            </div>
            <InputSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - desktop */}
          <div
            className="hidden md:block shrink-0 transition-[width] duration-300 ease-in-out"
            style={{ width: sidebarOpen ? 256 : 48 }}
          >
            <ChatSidebar
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelectConversation}
              onNewChat={handleNewChat}
              onDelete={handleDeleteConversation}
              collapsed={!sidebarOpen}
            />
          </div>

          {/* Sidebar - mobile */}
          <div
            className={`md:hidden fixed inset-y-0 left-0 z-40 pt-16 transition-[width] duration-300 ease-in-out overflow-hidden ${sidebarOpen ? "w-64" : "w-0"}`}
          >
            <div className="h-full w-64">
              <ChatSidebar
                conversations={conversations}
                activeId={activeId}
                onSelect={(id) => { handleSelectConversation(id); setSidebarOpen(false); }}
                onNewChat={handleNewChat}
                onDelete={handleDeleteConversation}
                collapsed={false}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center border-b border-line px-3 py-2 md:px-4">
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface2 hover:text-ink"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
              {isLoadingMessages && messages.length === 0 && !isStreaming && (
                <MessageSkeleton />
              )}

              {accessExpired && messages.length === 0 && !isStreaming && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow/10">
                <svg className="h-8 w-8 text-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="mb-2 font-mono text-lg md:text-xl font-bold text-ink">Access Expired</h2>
              <p className="mb-8 max-w-md text-center text-sm text-muted px-4">
                {accessExpired}
              </p>
              <button
                onClick={() => navigate("/#pricing")}
                className="rounded-xl bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
              >
                View Plans
              </button>
            </div>
          )}

              {!accessExpired && !isLoadingMessages && messages.length === 0 && !isStreaming && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface2">
                <svg className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h2 className="mb-2 font-mono text-lg md:text-xl font-bold">What are you building?</h2>
              <p className="mb-8 max-w-md text-center text-sm text-muted px-4">
                Ask me anything about programming, architecture, debugging, code review, or system design.
              </p>
              <div className="grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-3 px-4">
                {["Help me debug this error", "Explain this code pattern", "Review my PR changes", "Design a REST API"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="rounded-lg border border-line bg-surface px-4 py-3 text-left text-sm text-muted transition-colors hover:border-blue hover:text-ink"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageItem key={msg.id || i} msg={msg} />
          ))}

          {accessExpired && !isStreaming && (
            <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-yellow/30 bg-yellow/5 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-ink">{accessExpired}</p>
                  <button
                    onClick={() => navigate("/#pricing")}
                    className="mt-2 text-sm font-semibold text-blue hover:underline"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </div>
          )}

          {isStreaming && streamingContent && <StreamingMessage content={streamingContent} />}
          {isStreaming && !streamingContent && <StreamingSkeleton />}
          <div ref={messagesEndRef} />
        </div>

        {isLoadingMessages ? (
          <InputSkeleton />
        ) : (
          <div className="border-t border-line bg-surface px-4 py-3 md:px-6 md:py-4 pb-20 md:pb-4">
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2 md:gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                disabled={isStreaming || !!accessExpired}
                className="flex-1 resize-none rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming || !!accessExpired}
                className="self-end rounded-xl bg-blue px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        )}
          </div>
        </>
      )}
    </div>
  );
}
