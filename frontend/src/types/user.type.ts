// This file is kept for backward compatibility.
// Actual types are in user.types.ts
export type { User } from "./user.types";

export const normalizeUser = (user?: Partial<import("./user.types").User> | null): import("./user.types").User | null => {
  if (!user) return null;

  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();
  const displayName =
    user.displayName?.trim() ||
    user.name?.trim() ||
    [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    ...user,
    _id: user._id ?? "",
    email: user.email ?? "",
    displayName,
    name: displayName || user.email?.split("@")[0] || "Người dùng",
    firstName: firstName ?? displayName?.split(" ")[0] ?? "",
    lastName: lastName ?? displayName?.split(" ").slice(1).join(" ") ?? "",
    role: (user.role as import("./user.types").User["role"]) ?? "user",
    streak: user.streak ?? 0,
    totalStudyTime: user.totalStudyTime ?? 0,
    totalCardsLearned: user.totalCardsLearned ?? 0,
    settings: {
      theme: user.settings?.theme ?? "system",
      language: user.settings?.language ?? "vi",
      emailNotifications: user.settings?.emailNotifications ?? true,
    },
    createdAt: user.createdAt ?? new Date().toISOString(),
  } as import("./user.types").User;
};

export const getUserDisplayName = (user?: Partial<import("./user.types").User> | null) => {
  return normalizeUser(user)?.name || "Người dùng";
};
