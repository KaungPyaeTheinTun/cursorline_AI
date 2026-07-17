import { useState, useCallback } from "react";
import type { ChatMessage } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function useChat(token: string | null) {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers,
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (response.status === 401) {
          const authMsg: ChatMessage = {
            role: "assistant",
            content: "Please sign in to use the chat assistant.",
          };
          setMessages((prev) => [...prev, authMsg]);
          setError("auth_required");
          return;
        }

        const json = await response.json();

        if (!response.ok) {
          const msg = json?.message ?? json?.errors?.[Object.keys(json.errors ?? {})[0] ?? ""]?.[0] ?? `API returned ${response.status}`;
          throw new Error(msg);
        }

        const result = json?.data ?? json;
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: result.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Sorry, I encountered an error: ${msg}. Please try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, token],
  );

  return { messages, isLoading, error, sendMessage };
}
