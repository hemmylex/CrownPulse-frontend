import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabaseServer } from "@/lib/supabase/server";
import { api } from "@/lib/api";
import { RewardsCatalog } from "./rewards-catalog";

export const metadata: Metadata = {
  title: "Rewards — Spend Your Voting Points",
  description:
    "Turn CrownPulse loyalty points into airtime, vouchers, finale tickets and backstage passes from our partner brands.",
  openGraph: {
    title: "Rewards · CrownPulse",
    description:
      "Turn your voting points into airtime, vouchers and live show perks.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewards · CrownPulse",
    description: "Turn your voting points into real perks.",
  },
};

export default async function RewardsPage() {
  const sb = await supabaseServer();
  const {
    data: { session },
  } = await sb.auth.getSession();

  const [items, me] = await Promise.all([
    api.listRewardCatalog().catch(() => [] as any[]),
    session?.access_token
      ? api.me({ token: session.access_token }).catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Rewards
          </span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Every vote pays you back
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            You earn 10 loyalty points for every vote you cast. Spend them here
            on airtime, vouchers and live show perks.
          </p>
        </header>

        <RewardsCatalog
          items={items}
          points={me?.profile?.points ?? 0}
          signedIn={Boolean(me?.profile)}
        />
      </main>

      <SiteFooter />
    </div>
  );
}