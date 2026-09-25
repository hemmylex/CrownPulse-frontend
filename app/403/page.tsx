import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Access denied",
  description: "You don't have permission to view this page on CrownPulse.",
  robots: { index: false },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 grid place-items-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-md text-center">
          <span className="inline-grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-hero shadow-glow mx-auto">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
          </span>

          <h1 className="mt-5 sm:mt-6 font-display font-black text-3xl sm:text-4xl">
            403 — Access denied
          </h1>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Your account doesn&apos;t have the role required to view this page.
            If you think this is a mistake, please reach out to a CrownPulse
            admin.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm sm:text-base hover:bg-muted transition"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="px-5 py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold text-sm sm:text-base shadow-glow hover:opacity-95 transition"
            >
              Home
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}