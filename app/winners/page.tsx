import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Crown, Medal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hall of Fame — Crowned Winners",
  description:
    "Every crown ever won on CrownPulse. Meet the winners, runners-up and their prizes across all contests.",
  openGraph: {
    title: "Hall of Fame · CrownPulse",
    description:
      "Every crown ever won on CrownPulse — winners, runners-up and prizes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hall of Fame · CrownPulse",
    description: "Every crown ever won on CrownPulse.",
  },
};

const naira = (kobo: number) =>
  `₦${Math.round((kobo ?? 0) / 100).toLocaleString("en-NG")}`;

function positionLabel(p: number) {
  if (p === 1) return "Winner";
  if (p === 2) return "1st runner-up";
  if (p === 3) return "2nd runner-up";
  return `Position ${p}`;
}

export default async function WinnersPage() {
  let winners: any[] = [];
  try {
    winners = await api.listWinners();
  } catch {
    winners = [];
  }

  const crowned = winners.filter((w) => w.position === 1);
  const rest = winners.filter((w) => w.position !== 1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Hall of fame
          </span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Crowned winners
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Every crown handed out on CrownPulse, decided by real votes from
            real fans.
          </p>
        </header>

        {winners.length === 0 ? (
          <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-card border border-border p-8 sm:p-10 text-center text-muted-foreground text-sm sm:text-base">
            No winners announced yet — the first crown is still up for grabs.{" "}
            <Link href="/contests" className="text-primary underline">
              Browse contests
            </Link>
          </div>
        ) : (
          <>
            {/* Winners grid */}
            <section className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {crowned.map((w) => (
                <article
                  key={w.id}
                  className="rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow transition"
                >
                  <div className="aspect-[4/3] bg-secondary relative">
                    {w.contestant?.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={w.contestant.photo_url}
                        alt={w.contestant.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-hero opacity-80" />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-hero text-primary-foreground text-xs font-bold px-3 py-1.5 shadow-glow">
                      <Crown className="w-3.5 h-3.5" /> Winner
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="font-display font-black text-xl sm:text-2xl leading-tight">
                      <Link
                        href={`/c/${w.contestant?.slug ?? ""}`}
                        className="hover:text-primary transition"
                      >
                        {w.contestant?.display_name ?? "—"}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {w.contest?.title}
                      {w.round?.name ? ` · ${w.round.name}` : ""}
                    </p>
                    <div className="mt-3 sm:mt-4 flex items-center justify-between text-sm gap-2">
                      <span className="font-semibold truncate">
                        {w.prize_title ?? "Crown"}
                      </span>
                      {w.prize_amount_kobo > 0 && (
                        <span className="font-bold text-primary shrink-0">
                          {naira(w.prize_amount_kobo)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Runners-up */}
            {rest.length > 0 && (
              <section className="mt-10 sm:mt-12">
                <h2 className="font-display font-black text-xl sm:text-2xl flex items-center gap-2">
                  <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Runners-up
                </h2>
                <ul className="mt-4 sm:mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {rest.map((w) => (
                    <li
                      key={w.id}
                      className="rounded-2xl bg-card border border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                    >
                      <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-secondary shrink-0">
                        {w.contestant?.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={w.contestant.photo_url}
                            alt={w.contestant.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="w-full h-full grid place-items-center bg-gradient-hero">
                            <Trophy className="w-5 h-5 text-primary-foreground" />
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/c/${w.contestant?.slug ?? ""}`}
                          className="font-semibold hover:text-primary transition block truncate text-sm sm:text-base"
                        >
                          {w.contestant?.display_name ?? "—"}
                        </Link>
                        <div className="text-xs text-muted-foreground truncate">
                          {w.contest?.title}
                        </div>
                        <div className="text-xs font-semibold text-primary mt-0.5">
                          {positionLabel(w.position)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}