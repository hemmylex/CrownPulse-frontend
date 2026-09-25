import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Contestants",
  description:
    "Meet the contestants competing for crowns on CrownPulse — browse portfolios, follow favourites, and vote.",
  openGraph: {
    title: "Contestants · CrownPulse",
    description: "Meet the contestants competing for crowns on CrownPulse.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contestants · CrownPulse",
    description: "Meet the contestants competing for crowns.",
  },
};

export default async function ContestantsDirectory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let list: any[] = [];
  try {
    list = await api.listContestants(q);
  } catch {
    list = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <header className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            The line-up
          </span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Contestants
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Browse portfolios, follow your favourites, and back them with votes.
          </p>
        </header>

        {/* Search */}
        <form
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
          action="/contestants"
        >
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name or city…"
            className="flex-1 rounded-full bg-card border border-border px-5 py-3 text-sm outline-none focus:ring-2 ring-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-hero text-primary-foreground font-semibold px-5 py-3 text-sm shadow-glow hover:opacity-95 transition"
          >
            Search
          </button>
        </form>

        {/* Grid */}
        {list.length === 0 ? (
          <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-card border border-border p-8 sm:p-10 text-center text-muted-foreground text-sm sm:text-base">
            No contestants found yet.
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {list.map((c) => (
              <Link
                key={c.id}
                href={`/c/${c.slug}`}
                className="group rounded-2xl sm:rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition"
              >
                <div className="aspect-[4/5] bg-secondary overflow-hidden">
                  {c.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.photo_url}
                      alt={c.display_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-hero opacity-80" />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="font-display font-bold text-sm sm:text-lg leading-tight">
                    {c.display_name}
                  </h2>
                  {c.headline && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                      {c.headline}
                    </p>
                  )}
                  <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-muted-foreground">
                    {(c.city || c.state) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {[c.city, c.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {c.follower_count ?? 0}
                    </span>
                  </div>
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