import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Crown, Trophy, Gift, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabaseServer } from "@/lib/supabase/server";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

async function fetchAll(token: string | undefined) {
  if (!token) return { me: null, votes: [] as any[], rewards: [] as any[] };

  const [me, votes, rewards] = await Promise.all([
    api.me({ token }).catch(() => null),
    api.listMyVotes({ token }).catch(() => []),
    api.listMyRewards({ token }).catch(() => []),
  ]);

  return { me, votes, rewards };
}

export default async function Dashboard() {
  const sb = await supabaseServer();
  const {
    data: { session },
  } = await sb.auth.getSession();

  const { me, votes, rewards } = await fetchAll(session?.access_token);
  const successVotes = votes.filter((x) => x.status === "success");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Your dashboard
            </span>
            <h1 className="mt-2 font-display font-black text-2xl sm:text-3xl md:text-4xl">
              Hi {me?.profile?.display_name ?? "there"} 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {me?.profile?.email_verified ? (
                "You're verified and ready to vote."
              ) : (
                <>
                  Please{" "}
                  <Link
                    href="/auth/verify"
                    className="text-primary underline"
                  >
                    verify your email
                  </Link>{" "}
                  to unlock voting.
                </>
              )}
            </p>
          </div>
          <Link
            href="/contests"
            className="inline-flex self-start sm:self-auto bg-gradient-hero text-primary-foreground font-semibold px-5 py-3 rounded-full shadow-glow hover:opacity-95 transition text-sm sm:text-base"
          >
            Browse contests
          </Link>
        </header>

        {/* Stats */}
        <section className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Stat
            icon={Crown}
            label="Loyalty points"
            value={me?.profile?.points ?? 0}
          />
          <Stat
            icon={Trophy}
            label="Successful votes"
            value={successVotes.length}
          />
          <Stat icon={Gift} label="Rewards" value={rewards.length} />
        </section>

        {/* Recent votes + Rewards */}
        <section className="mt-8 sm:mt-10 grid lg:grid-cols-2 gap-5 sm:gap-6">
          <Panel title="Recent votes" icon={Trophy}>
            {votes.length === 0 ? (
              <Empty text="No votes yet. Cast your first!" />
            ) : (
              <ul className="divide-y divide-border">
                {votes.slice(0, 8).map((x) => (
                  <li
                    key={x.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate">
                        {x.entry?.contestant?.display_name ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {x.contest?.title}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm">
                        {x.quantity} vote{x.quantity > 1 ? "s" : ""}
                      </div>
                      <div
                        className={`text-xs ${
                          x.status === "success"
                            ? "text-primary"
                            : x.status === "pending"
                              ? "text-muted-foreground"
                              : "text-destructive"
                        }`}
                      >
                        {x.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Your rewards" icon={Gift}>
            {rewards.length === 0 ? (
              <Empty text="No rewards yet — keep voting to unlock perks." />
            ) : (
              <ul className="divide-y divide-border">
                {rewards.map((x) => (
                  <li key={x.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base truncate">
                          {x.title}
                        </div>
                        {x.brand_name && (
                          <div className="text-xs text-muted-foreground">
                            {x.brand_name}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${
                          x.status === "redeemed"
                            ? "bg-muted text-muted-foreground"
                            : "bg-coral text-coral-foreground"
                        }`}
                      >
                        {x.status}
                      </span>
                    </div>
                    {x.code && (
                      <div className="mt-2 text-sm font-mono bg-secondary rounded-lg px-3 py-2 inline-block">
                        {x.code}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </section>

        {/* Upsell */}
        <section className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-gradient-soft p-5 sm:p-6 md:p-8 border border-border">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-hero shadow-glow shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </span>
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl">
                Want more from CrownPulse?
              </h3>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                Become a contestant to build a portfolio and enter contests, or
                partner as a brand to sponsor campaigns.
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 text-sm">
                {(me?.roles ?? []).map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold uppercase tracking-widest text-xs"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-hero grid place-items-center shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
      </span>
      <div>
        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-bold">
          {label}
        </div>
        <div className="font-display font-black text-2xl sm:text-3xl">
          {value}
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-lg sm:text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-6 sm:py-8 text-center text-muted-foreground text-sm">
      {text}
    </div>
  );
}