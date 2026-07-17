import { create } from "zustand";
import { apiClient } from "../lib/axios";

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly avatar: string | null;
  readonly provider: string | null;
  readonly subscribed_at: string | null;
  readonly roles: readonly string[];
}

interface AuthResponse {
  readonly user: User;
  readonly token: string;
}

const TOKEN_KEY = "cursorline_token";

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

function writeToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  isAuthLoaded: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
  loginWithToken: (tokenValue: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: readToken(),
  isLoading: false,
  isLoggingOut: false,
  isAuthLoaded: !readToken(),

  init: async () => {
    const { token, isAuthLoaded } = get();
    if (isAuthLoaded) return;
    if (token) {
      try {
        const { data: userData } = await apiClient.get<User>("/me");
        set({ user: userData, isAuthLoaded: true });
      } catch {
        clearToken();
        set({ token: null, user: null, isAuthLoaded: true });
      }
    } else {
      set({ isAuthLoaded: true });
    }
  },

  login: async (email, password, remember = false) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post<AuthResponse>("/login", { email, password });
      writeToken(data.token, remember);
      set({ token: data.token, user: data.user, isAuthLoaded: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed.";
      throw new Error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      await apiClient.post<AuthResponse>("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Signup failed.";
      throw new Error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithOAuth: async (provider) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get<{ redirect_url: string }>(
        `/oauth/${provider}/redirect`,
      );
      window.location.href = data.redirect_url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "OAuth redirect failed.";
      set({ isLoading: false });
      throw new Error(msg);
    }
  },

  loginWithToken: async (tokenValue) => {
    localStorage.setItem(TOKEN_KEY, tokenValue);
    set({ token: tokenValue });
    try {
      const { data: userData } = await apiClient.get<User>("/me", {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      set({ user: userData, isAuthLoaded: true });
    } catch {
      clearToken();
      set({ token: null, user: null, isAuthLoaded: true });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    const { token } = get();
    if (token) {
      try {
        await apiClient.post("/logout");
      } catch {
        // silent
      }
    }
    clearToken();
    set({ token: null, user: null, isLoggingOut: false, isAuthLoaded: true });
  },

  refreshUser: async () => {
    const { token } = get();
    if (token) {
      try {
        const { data: userData } = await apiClient.get<User>("/me");
        set({ user: userData });
      } catch {
        clearToken();
        set({ token: null, user: null, isAuthLoaded: true });
      }
    }
  },
}));
