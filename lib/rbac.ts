import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { api, type Role } from "@/lib/api";

export type SessionAndRoles = {
  token: string;
  userId: string;
  email: string;
  roles: Role[];
  profile: Awaited<ReturnType<typeof api.me>>["profile"];
};

/**
 * Returns the current session + roles, or null if unauthenticated.
 */
export async function getSessionAndRoles(): Promise<SessionAndRoles | null> {
  const sb = await supabaseServer();
  const {
    data: { session },
  } = await sb.auth.getSession();

  if (!session?.access_token || !session.user) return null;

  try {
    const me = await api.me({ token: session.access_token });

    return {
      token: session.access_token,
      userId: session.user.id,
      email: session.user.email ?? "",
      roles: me.roles,
      profile: me.profile,
    };
  } catch {
    // API unreachable or token invalid — return minimal session
    return {
      token: session.access_token,
      userId: session.user.id,
      email: session.user.email ?? "",
      roles: [],
      profile: null,
    };
  }
}

/**
 * Ensures the user is authenticated.
 * Redirects to /auth/login if not.
 */
export async function requireSession(
  redirectTo?: string
): Promise<SessionAndRoles> {
  const session = await getSessionAndRoles();

  if (!session) {
    const query = redirectTo
      ? `?redirect=${encodeURIComponent(redirectTo)}`
      : "";
    redirect(`/auth/login${query}`);
  }

  return session;
}

/**
 * Ensures the user has at least one of the allowed roles.
 * Redirects to /auth/login if unauthenticated, or /403 if missing the role.
 */
export async function requireRole(
  allowed: Role[],
  redirectTo?: string
): Promise<SessionAndRoles> {
  const session = await requireSession(redirectTo);

  const hasRole = session.roles.some((role) => allowed.includes(role));
  if (!hasRole) {
    redirect("/403");
  }

  return session;
}