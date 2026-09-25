import type { Metadata } from "next";
import Link from "next/link";
import { Radio, CalendarClock, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Live Shows — Watch & Vote",
  description:
    "Watch CrownPulse pageant live streams, follow the leaderboard in real time and vote for your favourite contestant with Paystack.",
  openGraph: {
    title: "CrownPulse Live Shows — Watch & Vote",
    description: "Stream live pageant rounds and vote instantly with Paystack.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrownPulse Live Shows",
    description: "Watch live pageant rounds and vote instantly.",
  },
};

const badge: Record<string, string> = {
  live: "bg-coral text-primary-foreground",
  scheduled: "bg-secondary text-foreground",
  ended: "bg-muted text-muted-foreground",
};

export default async function LivePage() {
  let streams: any[] = [];
  try {
    streams = await api.listStreams();
  } catch {
    streams = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Radio className="w-4 h-4" /> Streaming
          </span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Live shows
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            Catch every crowning moment. Vote live while the show is running —
            votes land on the leaderboard instantly.
          </p>
        </header>

        {streams.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center">
            <PlayCircle className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-semibold text-sm sm:text-base">
              No streams scheduled yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check the contests page for what&apos;s coming up.
            </p>
            <Link
              href="/contests"
              className="mt-5 inline-flex bg-gradient-hero text-primary-foreground font-semibold px-5 py-2.5 rounded-full shadow-glow hover:opacity-95 transition"
            >
              Browse contests
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {streams.map((s) => (
              <Link
                key={s.id}
                href={`/live/${s.id}`}
                className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden hover:shadow-glow transition group"
              >
                <div className="aspect-video bg-gradient-royal relative grid place-items-center">
                  {s.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.thumbnail_url}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground/80" />
                  )}
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      badge[s.status] ?? badge.ended
                    }`}
                  >
                    {s.status === "live" ? "● Live now" : s.status}
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-display font-bold text-lg sm:text-xl group-hover:text-primary transition">
                    {s.title}
                  </h2>
                  {s.contest && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {s.contest.title}
                    </p>
                  )}
                  {s.scheduled_at && (
                    <p className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="w-3.5 h-3.5" />
                      {new Date(s.scheduled_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}