export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export type UserRow = {
  id: string;
  name: string | null;
  login: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export const roleLabel = (role: string): UserRole => {
  const r = String(role || "").toUpperCase();
  if (r === "SUPERADMIN") return "SUPERADMIN";
  if (r === "ADMIN") return "ADMIN";
  return "USER";
};
