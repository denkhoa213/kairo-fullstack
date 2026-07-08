import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import api from "../lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/auth/login", { email, password });
          const { user, token } = res.data.data;
          localStorage.setItem("kairo_token", token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const msg =
            err instanceof Error
              ? err.message
              : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đăng nhập thất bại";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/auth/register", { name, email, password });
          const { user, token } = res.data.data;
          localStorage.setItem("kairo_token", token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đăng ký thất bại";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {
          // ignore
        }
        localStorage.removeItem("kairo_token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...data } });
      },

      setError: (error) => set({ error }),

      checkAuth: async () => {
        const token = localStorage.getItem("kairo_token");
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        try {
          const res = await api.get("/auth/me");
          set({ user: res.data.data, isAuthenticated: true, token });
        } catch {
          localStorage.removeItem("kairo_token");
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "kairo-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
