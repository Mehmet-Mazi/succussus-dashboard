import { type NextRequest, NextResponse } from "next/server";

import {
  canAccessRoute,
  MOCK_ROLE_COOKIE_NAME,
  parseAppRole,
  roleHomeRoutes,
} from "@/lib/access-control/role-access.data";

const loginRoute = "/auth/v1/login";
const unauthorizedRoute = "/unauthorized";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = parseAppRole(
    request.cookies.get(MOCK_ROLE_COOKIE_NAME)?.value,
  );

  if (!role) {
    const loginUrl = new URL(loginRoute, request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL(roleHomeRoutes[role], request.url),
    );
  }

  if (!canAccessRoute(role, pathname)) {
    return NextResponse.redirect(
      new URL(unauthorizedRoute, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};