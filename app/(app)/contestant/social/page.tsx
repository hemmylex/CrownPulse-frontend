import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/rbac";
import { api } from "@/lib/api";
import { SocialLinksForm } from "./social-links-form";

export const metadata: Metadata = {
  title: "Social accounts",
  description:
    "Connect your Instagram, X, TikTok and YouTube handles so fans can follow and share your CrownPulse profile.",
  robots: { index: false },
};

export default async function ContestantSocialPage() {
  const s = await requireSession("/contestant/social");

  let accounts: any[] = [];
  try {
    accounts = await api.mySocialAccounts({ token: s.token });
  } catch {
    accounts = [];
  }

  return (
    <div>
      <header className="mb-6 sm:mb-8">
        <Link
          href="/contestant"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Contestant workspace
        </Link>
        <h1 className="mt-2 font-display font-black text-2xl sm:text-3xl md:text-4xl">
          Social accounts
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Linked handles show on your public profile and power share tracking.
        </p>
      </header>

      <SocialLinksForm initial={accounts} />
    </div>
  );
}