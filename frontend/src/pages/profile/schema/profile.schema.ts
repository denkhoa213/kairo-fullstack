import { z } from "zod";

// ===== Profile Update Schema =====
export const profileSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự").max(100),
  bio: z.string().max(500, "Giới thiệu tối đa 500 ký tự").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ===== Change Password Schema =====
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mật khẩu hiện tại ít nhất 6 ký tự"),
    newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
