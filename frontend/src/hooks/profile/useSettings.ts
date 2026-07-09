import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
} from "@/pages/profile/schema/profile.schema";
import api from "@/lib/axios";

export function useSettings() {
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  // ── Profile form ──────────────────────────────────────────────────────────
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? "",
    },
  });

  const onSaveProfile = async (data: ProfileFormData) => {
    try {
      await api.put("/users/profile", data);
      await checkAuth();
      toast.success("Đã lưu thông tin cá nhân");
    } catch {
      toast.error("Lưu thất bại, thử lại sau");
    }
  };

  // ── Password form ─────────────────────────────────────────────────────────
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await api.put("/users/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return {
    user,
    // Profile
    profileForm,
    onSaveProfile: profileForm.handleSubmit(onSaveProfile),
    isSavingProfile: profileForm.formState.isSubmitting,

    // Password
    passwordForm,
    onChangePassword: passwordForm.handleSubmit(onChangePassword),
    isSavingPassword: passwordForm.formState.isSubmitting,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,

    // Logout
    handleLogout,
  };
}
