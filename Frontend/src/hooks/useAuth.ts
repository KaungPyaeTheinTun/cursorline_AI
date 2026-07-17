export { useAuthStore } from "../stores/authStore";
export { useToastStore } from "../stores/toastStore";

import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export function useAuth() {
  return useAuthStore();
}

export function useToast() {
  const toast = useToastStore((s) => s.toast);
  return { toast };
}
