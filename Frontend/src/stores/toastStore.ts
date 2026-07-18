import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
  exiting?: boolean;
}

interface ToastState {
  toasts: readonly Toast[];
  toast: (message: string, type?: ToastType) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  toast: (message, type = "info") => {
    const id = nextId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, exiting: false }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, exiting: true } : t,
        ),
      }));
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 250);
    }, 4000);
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, exiting: true } : t,
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 250);
  },
}));
