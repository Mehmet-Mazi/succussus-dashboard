import type { AppRole } from "@/lib/access-control/role-access.data";

export function resolveAppRole(roles: readonly string[]): AppRole {
  const normalizedRoles = roles.map((role) => role.toLowerCase());

  if (normalizedRoles.includes("admin")) {
    return "admin";
  }

  if (normalizedRoles.includes("director")) {
    return "director";
  }

  if (normalizedRoles.includes("manager")) {
    return "manager";
  }

  return "guest";
}