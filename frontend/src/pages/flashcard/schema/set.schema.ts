import { z } from "zod";

// ===== Create / Edit Set Schema =====
export const setSchema = z.object({
  name: z.string().min(2, "Tên bộ thẻ ít nhất 2 ký tự").max(200, "Tên quá dài"),
  description: z.string().max(1000, "Mô tả quá dài").optional(),
  categoryId: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export type SetFormData = z.infer<typeof setSchema>;

// ===== Single Card Schema =====
export const cardSchema = z.object({
  front: z.string().min(1, "Thuật ngữ không được trống"),
  back: z.string().min(1, "Định nghĩa không được trống"),
});

export type CardFormData = z.infer<typeof cardSchema>;

// ===== AI Generate Schema =====
export const aiGenerateSchema = z.object({
  topic: z.string().min(3, "Chủ đề ít nhất 3 ký tự").max(200),
  language: z.enum(["vi", "en", "ja", "ko"]).default("vi"),
  count: z.number().int().min(5).max(50).default(20),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
});

export type AIGenerateFormData = z.infer<typeof aiGenerateSchema>;
