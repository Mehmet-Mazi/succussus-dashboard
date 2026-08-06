import {
  authenticateWithApi,
} from "./api-auth-provider";
import type {
  AuthCredentials,
  AuthMode,
  AuthSession,
} from "./auth.types";
import {
  authenticateWithMock,
} from "./mock-auth-provider";

export class MockAuthDisabledError extends Error {
  constructor() {
    super("Local test authentication is disabled.");
    this.name = "MockAuthDisabledError";
  }
}

function isMockAuthAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

export async function authenticate(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthSession | null> {
  if (mode === "api") {
    return authenticateWithApi(credentials);
  }

  if (!isMockAuthAllowed()) {
    throw new MockAuthDisabledError();
  }

  return authenticateWithMock(credentials);
}