import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { requireRole } from "@/lib/rbac";
import { api } from "@/lib/api";
import { EntriesManager } from "./entries-manager";

export const metadata: Metadata = {
  title: "My entries · CrownPulse",
  description:
    "Apply to open CrownPulse contests, submit your pitch, and track the status of every entry.",
  robots: { index: false },
};

export default async function ContestantEntriesPage() {
  const s = await requireRole(["contestant", "admin"], "/contestant/entries");

  const [entries, open] = await Promise.all([
    api.myEntries({ token: s.token }).catch(() => []),
    api.openContests({ token: s.token }).catch(() => []),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Contestant workspace
            </span>
            <h1 className="mt-2 font-display font-black text-2xl sm:text-3xl md:text-4xl">
              My entries
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Enter open contests and follow your review status round by round.
            </p>
          </div>
          <Link
            href="/contestant/portfolio"
            className="self-start sm:self-auto px-5 py-3 rounded-full bg-secondary font-semibold text-sm sm:text-base hover:bg-muted transition"
          >
            Portfolio builder
          </Link>
        </header>

        <EntriesManager
          initialEntries={entries as any}
          initialOpen={open as any}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
