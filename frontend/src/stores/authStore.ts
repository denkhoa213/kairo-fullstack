import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store.type";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  loading: false,
  isLoading: false,
  isAuthenticated: false,

  register: async (email, password, firstName, lastName) => {
    set({ loading: true, isLoading: true });
    try {
      const data = await authService.register(
        email,
        password,
        firstName,
        lastName,
      );
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        set({
          accessToken: data.accessToken,
          user: data.user,
          isAuthenticated: Boolean(data.user),
        });
      }
      toast.success("Đăng ký thành công!");
    } catch (error) {
      console.error("Register failed:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      set({ loading: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, isLoading: true });
    try {
      const data = await authService.login(email, password);
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      set({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: Boolean(data.user),
      });
      toast.success("Đăng nhập thành công!");
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      return null;
    } finally {
      set({ loading: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ loading: true, isLoading: true });
    try {
      await authService.logout().catch(() => undefined);
    } finally {
      localStorage.removeItem("accessToken");
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        isLoading: false,
      });
      toast.success("Đăng xuất thành công!");
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ accessToken: null, user: null, isAuthenticated: false });
      return;
    }

    set({ loading: true, isLoading: true });
    try {
      const user = await authService.getProfile();
      set({
        accessToken: token,
        user,
        isAuthenticated: Boolean(user),
      });
    } catch (error) {
      console.error("Check auth failed:", error);
      localStorage.removeItem("accessToken");
      set({ accessToken: null, user: null, isAuthenticated: false });
    } finally {
      set({ loading: false, isLoading: false });
    }
  },
}));
