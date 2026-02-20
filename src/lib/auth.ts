export interface AuthUser {
  userId: string;
}

export function getAuthUser(req: Request): AuthUser | null {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId && headerUserId.trim()) {
    return { userId: headerUserId.trim() };
  }

  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("jidong_user_id="));
  if (!token) return null;
  const value = token.slice("jidong_user_id=".length).trim();
  if (!value) return null;
  return { userId: value };
}
