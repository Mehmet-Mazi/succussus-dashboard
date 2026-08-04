import { testUsers, type TestUser } from "@/data/test_users";

export type AuthenticatedUser = Omit<TestUser, "password">;

export type CredentialCheckResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; message: string };

export function checkCredentials(email: string, password: string): CredentialCheckResult {
  const normalizedEmail = email.trim().toLowerCase();
  const user = testUsers.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Email or password is incorrect.",
    };
  }

  const { password: _password, ...authenticatedUser } = user;

  return {
    success: true,
    user: authenticatedUser,
  };
}
