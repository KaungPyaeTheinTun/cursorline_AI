import { useState, useCallback } from "react";
import { apiClient } from "../lib/axios";

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);

  const requestCode = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await apiClient.post("/forgot-password", { email });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send code.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await apiClient.post("/verify-code", { email, code });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, password: string) => {
      setIsLoading(true);
      try {
        await apiClient.post("/reset-password", {
          email,
          code,
          password,
          password_confirmation: password,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Reset failed.";
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, requestCode, verifyCode, resetPassword };
}
