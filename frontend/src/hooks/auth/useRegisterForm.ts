import {
  registerSchema,
  type RegisterFormData,
} from "@/pages/auth/client/schema/auth.schema";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";

export const useRegisterForm = () => {
  const { register: registerUser, loading } = useAuthStore();
  const navigate = useNavigate();
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form validate

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(passwordValue);
  const strengthColors = [
    "bg-muted",
    "bg-destructive",
    "bg-warning",
    "bg-yellow-400",
    "bg-success",
    "bg-success",
  ];

  const strengthLabels = ["", "Yếu", "Trung bình", "Khá", "Mạnh", "Rất mạnh"];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      navigate("/login");
    } catch (error) {
      console.error("Register failed:", error);
    }
  };
  return {
    // Form methods
    register,
    handleSubmit,
    errors,
    passwordValue,

    // UI states
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,

    // Password strength
    strength,
    strengthColors,
    strengthLabels,

    // Submit
    onSubmit,
    isLoading: loading,
  };
};
