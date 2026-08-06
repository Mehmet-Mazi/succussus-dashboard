import type { AppRole } from "@/lib/access-control/role-access.data";

export const AUTH_MODES = ["api", "mock"] as const;

export type AuthMode = (typeof AUTH_MODES)[number];

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  role: AppRole;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthSession {
  user: AuthenticatedUser;
  tokens?: AuthTokens;
}