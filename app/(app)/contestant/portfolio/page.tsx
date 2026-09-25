import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { requireRole } from "@/lib/rbac";
import { api } from "@/lib/api";
import { PortfolioEditor } from "./portfolio-editor";

export const metadata: Metadata = {
  title: "Portfolio builder",
  description:
    "Build your CrownPulse contestant portfolio: photos, story, achievements and socials.",
  robots: { index: false },
};

export default async function PortfolioPage() {
  const s = await requireRole(["contestant", "admin"], "/contestant/portfolio");

  let initial: any = null;
  try {
    initial = await api.myContestant({ token: s.token });
  } catch {
    initial = null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <Link
            href="/contestant"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← Contestant workspace
          </Link>
          <h1 className="mt-2 font-display font-black text-2xl sm:text-3xl md:text-4xl">
            Portfolio builder
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Five quick steps. Everything autosaves as you type.
          </p>
        </header>

        <PortfolioEditor
          initial={initial}
          defaultName={s.profile?.display_name ?? ""}
        />
      </main>

      <SiteFooter />
    </div>
  );
}