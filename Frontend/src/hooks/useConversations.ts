import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../lib/axios";

export interface Message {
  readonly id?: number;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly created_at?: string;
}

export interface Conversation {
  readonly id: number;
  readonly title: string;
  readonly last_message_at: string | null;
  readonly created_at: string;
  readonly messages?: readonly Message[];
}

interface PaginatedResponse<T> {
  readonly data: T[];
  readonly current_page: number;
  readonly last_page: number;
  readonly per_page: number;
  readonly total: number;
}

function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/\n/g, " ").trim();
  return cleaned.length > 50 ? cleaned.slice(0, 50) + "..." : cleaned;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeMessages, setActiveMessages] = useState<readonly Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const { data } = await apiClient.get<PaginatedResponse<Conversation>>("/conversations");
      setConversations(data.data);
    } catch {
      // silent
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadMessages = useCallback(async (id: number) => {
    try {
      setIsLoadingMessages(true);
      const { data } = await apiClient.get<PaginatedResponse<Message>>(
        `/conversations/${id}/messages`,
      );
      setActiveMessages(data.data);
    } catch {
      setActiveMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback(
    (id: number) => {
      setActiveId(id);
      loadMessages(id);
    },
    [loadMessages],
  );

  const newChat = useCallback(() => {
    setActiveId(null);
    setActiveMessages([]);
  }, []);

  const createConversation = useCallback(
    async (firstMessage: string): Promise<number> => {
      setIsLoading(true);
      try {
        const { data: convo } = await apiClient.post<Conversation>("/conversations", {
          title: generateTitle(firstMessage),
        });
        setConversations((prev) => [convo, ...prev]);
        setActiveId(convo.id);
        setActiveMessages([]);
        return convo.id;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const appendMessage = useCallback(
    async (conversationId: number, message: Message): Promise<void> => {
      await apiClient.post(`/conversations/${conversationId}/messages`, {
        role: message.role,
        content: message.content,
      });
      setActiveMessages((prev) => [...prev, message]);
    },
    [],
  );

  const updateTitle = useCallback(async (id: number, title: string) => {
    try {
      await apiClient.put(`/conversations/${id}`, { title });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c)),
      );
    } catch {
      // silent
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: number) => {
      try {
        await apiClient.delete(`/conversations/${id}`);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeId === id) {
          setActiveId(null);
          setActiveMessages([]);
        }
      } catch {
        // silent
      }
    },
    [activeId],
  );

  return {
    conversations,
    activeId,
    activeMessages,
    isLoading,
    isLoadingConversations,
    isLoadingMessages,
    fetchConversations,
    createConversation,
    appendMessage,
    updateTitle,
    deleteConversation,
    selectConversation,
    newChat,
  };
}
