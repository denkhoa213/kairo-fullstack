import {
  loginSchema,
  type LoginFormData,
} from "@/pages/auth/client/schema/auth.schema";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export function useLogin() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: loading,
    showPassword,
    setShowPassword,
  };
}
