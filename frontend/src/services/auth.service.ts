import api from "@/lib/axios";
import { normalizeUser, type User } from "@/types/user.type";

interface AuthApiResponse {
  user: User | null;
  accessToken: string | null;
}

export const authService = {
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<AuthApiResponse> => {
    const response = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    });

    const payload = response.data?.data ?? {};
    return {
      user: normalizeUser(payload.user),
      accessToken: payload.token ?? payload.accessToken ?? null,
    };
  },

  login: async (email: string, password: string): Promise<AuthApiResponse> => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const payload = response.data?.data ?? {};
    return {
      user: normalizeUser(payload.user),
      accessToken: payload.token ?? payload.accessToken ?? null,
    };
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  getProfile: async (): Promise<User | null> => {
    const response = await api.get("/users/profile");
    return normalizeUser(response.data?.data ?? null);
  },
};
