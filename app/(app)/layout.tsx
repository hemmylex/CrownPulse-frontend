// Shared session gate for signed-in surfaces (dashboard, contestant, brand).
// Middleware already redirects unauthenticated visitors; this layout hydrates
// the session server-side so nested pages can rely on it existing.

import type { ReactNode } from "react";
import { requireSession } from "@/lib/rbac";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSession();
  return children;
}