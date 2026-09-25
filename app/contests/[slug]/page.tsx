import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";
import { EntryCard } from "./entry-card";
import { ViewTracker } from "@/components/view-tracker";

export const revalidate = 15;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { contest } = await api.getContestBySlug(slug);
    const title = contest.title;
    const description =
      contest.tagline || `Vote in ${contest.title} on CrownPulse.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} · CrownPulse`,
        description,
        images: contest.cover_url ? [contest.cover_url] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return { title: "Contest" };
  }
}

export default async function ContestDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof api.getContestBySlug>>;

  try {
    data = await api.getContestBySlug(slug);
  } catch {
    notFound();
  }

  const { contest, entries } = data!;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <ViewTracker contestId={contest.id} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="max-w-3xl">
          <Link
            href="/contests"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← All contests
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                contest.status === "live"
                  ? "bg-primary text-primary-foreground"
                  : "bg-coral text-coral-foreground"
              }`}
            >
              {contest.status}
            </span>
            {contest.brand_name && (
              <span className="text-xs text-muted-foreground">
                Presented by <b>{contest.brand_name}</b>
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            {contest.title}
          </h1>

          {contest.tagline && (
            <p className="mt-2 text-base sm:text-xl text-muted-foreground">
              {contest.tagline}
            </p>
          )}

          {contest.description && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              {contest.description}
            </p>
          )}

          <p className="mt-3 sm:mt-4 text-sm font-semibold">
            ₦{(contest.vote_price_kobo / 100).toLocaleString()} per vote
          </p>
        </header>

        <section className="mt-8 sm:mt-10">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl sm:text-2xl">
              Leaderboard
            </h2>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-6 sm:p-8 text-center text-muted-foreground text-sm sm:text-base">
              No contestants yet. Check back soon!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {entries.map((e: any, i: number) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  rank={i + 1}
                  contestStatus={contest.status}
                  pricingKobo={contest.vote_price_kobo}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}