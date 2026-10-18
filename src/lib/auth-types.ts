export type UserRole = "buyer" | "vendor" | "admin";
export type PublicRole = Exclude<UserRole, "admin">;
export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  title?: string;
  company?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatarUrl?: string;
}
export const dashboardFor = (role: UserRole): string =>
  role === "admin" ? "/admin" : role === "vendor" ? "/vendor" : "/dashboard";
