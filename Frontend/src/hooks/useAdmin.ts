import { useState, useCallback } from "react";
import { apiClient } from "../lib/axios";

interface AdminFaq {
  readonly id: number;
  readonly question: string;
  readonly answer: string;
  readonly is_active: boolean;
  readonly sort_order: number;
  readonly created_at: string;
  readonly updated_at: string;
}

interface AdminProfile {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly avatar: string | null;
}

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchFaqs = useCallback(async (): Promise<readonly AdminFaq[]> => {
    try {
      const { data } = await apiClient.get<readonly AdminFaq[]>("/admin/faqs");
      return data;
    } catch {
      return [];
    }
  }, []);

  const createFaq = useCallback(async (faq: { question: string; answer: string; is_active: boolean }) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post<AdminFaq>("/admin/faqs", faq);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create FAQ.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFaq = useCallback(async (id: number, faq: { question: string; answer: string; is_active: boolean }) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.put<AdminFaq>(`/admin/faqs/${id}`, faq);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update FAQ.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFaq = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/admin/faqs/${id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete FAQ.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async (): Promise<AdminProfile | null> => {
    try {
      const { data } = await apiClient.get<AdminProfile>("/admin/profile");
      return data;
    } catch {
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (profile: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.put<AdminProfile>("/admin/profile", profile);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update profile.";
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<AdminProfile> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await apiClient.post<AdminProfile>("/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }, []);

  const removeAvatar = useCallback(async (): Promise<AdminProfile> => {
    const { data } = await apiClient.delete<AdminProfile>("/me/avatar");
    return data;
  }, []);

  return {
    isLoading,
    fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
}
