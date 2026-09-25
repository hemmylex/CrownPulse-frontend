import Link from "next/link";
import type { Metadata } from "next";
import { Trophy, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contests",
  description:
    "Browse live and upcoming contests on CrownPulse. Vote securely with Paystack.",
  openGraph: {
    title: "Contests · CrownPulse",
    description:
      "Live and upcoming pageants, talent shows and brand contests.",
  },
};

export const revalidate = 30;

export default async function ContestsPage() {
  let contests: any[] = [];
  try {
    contests = await api.listContests();
  } catch {
    contests = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Contests
          </span>
          <h1 className="mt-2 sm:mt-3 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Find your{" "}
            <span className="text-gradient italic">next crown</span>.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Live now, opening soon, and freshly wrapped. Tap in and cast your
            vote.
          </p>
        </header>

        <section className="mt-8 sm:mt-10">
          {contests.length === 0 ? (
            <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-8 sm:p-10 text-center text-muted-foreground text-sm sm:text-base">
              No contests yet. Check back soon!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {contests.map((c) => (
                <Link
                  key={c.id}
                  href={`/contests/${c.slug}`}
                  className="group rounded-2xl sm:rounded-3xl bg-card border border-border p-5 sm:p-6 hover:shadow-glow hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        c.status === "live"
                          ? "bg-primary text-primary-foreground"
                          : c.status === "upcoming"
                            ? "bg-coral text-coral-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </span>
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>

                  <h3 className="mt-3 sm:mt-4 font-display font-black text-xl sm:text-2xl leading-tight">
                    {c.title}
                  </h3>

                  {c.tagline && (
                    <p className="mt-1.5 text-muted-foreground text-sm">
                      {c.tagline}
                    </p>
                  )}

                  <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.brand_name ?? "CrownPulse"}</span>
                    <span>
                      ₦{(c.vote_price_kobo / 100).toLocaleString()} / vote
                    </span>
                  </div>

                  <span className="mt-4 sm:mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View & vote <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}