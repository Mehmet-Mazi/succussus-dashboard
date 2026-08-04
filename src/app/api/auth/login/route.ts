import { z } from "zod";

import { checkCredentials } from "./idcheck";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const invalidCredentialsResponse = {
  message: "Email or password is incorrect.",
};

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(invalidCredentialsResponse, { status: 401 });
  }

  const result = checkCredentials(parsedBody.data.email, parsedBody.data.password);

  if (!result.success) {
    return Response.json({ message: result.message }, { status: 401 });
  }

  return Response.json({ user: result.user });
}
