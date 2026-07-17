import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  readonly message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-blue/20 text-ink rounded-br-md"
            : "bg-surface2 text-muted rounded-bl-md"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
