import { NextResponse } from "next/server";

import {
  MOCK_ROLE_COOKIE_NAME,
  MOCK_USER_ID_COOKIE_NAME,
} from "@/lib/access-control/role-access.data";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AUTH_MODE_COOKIE_NAME,
  AUTH_USERNAME_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/auth/auth.constants";

const authenticationCookieNames = [
  MOCK_ROLE_COOKIE_NAME,
  MOCK_USER_ID_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  AUTH_MODE_COOKIE_NAME,
  AUTH_USERNAME_COOKIE_NAME,
] as const;

export async function POST() {
  const response = NextResponse.json({
    redirectTo: "/auth/v1/login",
  });

  for (const cookieName of authenticationCookieNames) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}