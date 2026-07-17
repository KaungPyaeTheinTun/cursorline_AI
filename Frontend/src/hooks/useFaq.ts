import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/axios";

export interface Faq {
  readonly id: number;
  readonly question: string;
  readonly answer: string;
  readonly is_active: boolean;
  readonly sort_order: number;
}

export function useFaq() {
  const [faqs, setFaqs] = useState<readonly Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<readonly Faq[]>("/faqs");
      setFaqs(data);
    } catch {
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return { faqs, isLoading, refetch: fetchFaqs };
}
