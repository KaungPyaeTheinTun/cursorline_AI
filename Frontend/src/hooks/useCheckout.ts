import { useState, useCallback } from "react";
import { apiClient } from "../lib/axios";

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = useCallback(async (priceId: string) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post<{ checkout_url: string }>("/checkout", {
        plan: priceId,
      });
      window.location.href = data.checkout_url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Checkout failed.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, startCheckout };
}
