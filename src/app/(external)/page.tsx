import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  MOCK_ROLE_COOKIE_NAME,
  parseAppRole,
  roleHomeRoutes,
} from "@/lib/access-control/role-access.data";

export default async function Home() {
  const cookieStore = await cookies();
  const role = parseAppRole(
    cookieStore.get(MOCK_ROLE_COOKIE_NAME)?.value,
  );

  redirect(
    role
      ? roleHomeRoutes[role]
      : "/auth/v1/login",
  );
}