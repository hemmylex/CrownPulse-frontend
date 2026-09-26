import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Music2,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";
import { FollowButton } from "./follow-button";
import { ShareButtons } from "@/components/share-buttons";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 15;

// ── SVG social icons ──────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
// ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { contestant, total_votes } = await api.getContestantBySlug(slug);
    const title = contestant.display_name;
    const description =
      contestant.headline ||
      contestant.bio?.slice(0, 150) ||
      `${contestant.display_name} is competing on CrownPulse with ${total_votes} votes.`;
    const image = contestant.cover_url || contestant.photo_url || undefined;

    return {
      title,
      description,
      openGraph: {
        title: `${title} · CrownPulse`,
        description,
        type: "profile",
        images: image ? [image] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Contestant" };
  }
}

export default async function ContestantProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof api.getContestantBySlug>>;

  try {
    data = await api.getContestantBySlug(slug);
  } catch {
    notFound();
  }

  const { contestant: c, entries, media, achievements, total_votes } = data!;
  const linked = await api.contestantSocials(slug).catch(() => [] as any[]);

  const socials = [
    c.instagram && {
      icon: InstagramIcon,
      label: c.instagram,
      href: `https://instagram.com/${String(c.instagram).replace("@", "")}`,
    },
    c.twitter && {
      icon: XIcon,
      label: c.twitter,
      href: `https://x.com/${String(c.twitter).replace("@", "")}`,
    },
    c.tiktok && {
      icon: Music2, // still available in lucide (not a brand icon)
      label: c.tiktok,
      href: `https://tiktok.com/@${String(c.tiktok).replace("@", "")}`,
    },
  ].filter(Boolean) as { icon: any; label: string; href: string }[];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Cover */}
        <div className="relative h-40 sm:h-56 md:h-72 bg-gradient-hero overflow-hidden">
          {c.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.cover_url}
              alt=""
              className="w-full h-full object-cover opacity-90"
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
          {/* Profile header */}
          <div className="-mt-12 sm:-mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end gap-4 sm:gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-background bg-secondary shadow-glow shrink-0">
              {c.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.photo_url}
                  alt={c.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-hero" />
              )}
            </div>

            <div className="flex-1 pb-1 sm:pb-2">
              <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl">
                {c.display_name}
              </h1>
              {c.headline && (
                <p className="mt-1 text-base sm:text-lg text-muted-foreground">
                  {c.headline}
                </p>
              )}
              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                {(c.city || c.state) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {[c.city, c.state, c.country].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {total_votes.toLocaleString()} votes
                </span>
              </div>
            </div>

            <div className="pb-1 sm:pb-2">
              <FollowButton
                contestantId={c.id}
                initialCount={c.follower_count ?? 0}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 sm:mt-10 grid lg:grid-cols-3 gap-6 sm:gap-8 pb-12 sm:pb-16">
            <div className="lg:col-span-2 space-y-8 sm:space-y-10">
              {c.bio && (
                <section>
                  <h2 className="font-display font-bold text-xl sm:text-2xl">
                    About
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                    {c.bio}
                  </p>
                </section>
              )}

              {c.video_url && (
                <section>
                  <h2 className="font-display font-bold text-xl sm:text-2xl">
                    Video reel
                  </h2>
                  <a
                    href={c.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-primary font-semibold hover:underline text-sm sm:text-base"
                  >
                    Watch reel →
                  </a>
                </section>
              )}

              {media.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-xl sm:text-2xl">
                    Gallery
                  </h2>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {media.map((m: any) => (
                      <figure
                        key={m.id}
                        className="rounded-2xl overflow-hidden bg-secondary aspect-square"
                      >
                        {m.kind === "video" ? (
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full grid place-items-center bg-gradient-hero text-primary-foreground text-sm font-semibold"
                          >
                            ▶ Video
                          </a>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.url}
                            alt={m.caption ?? c.display_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {achievements.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-xl sm:text-2xl">
                    Achievements
                  </h2>
                  <ol className="mt-4 space-y-4 border-l-2 border-border pl-5 sm:pl-6">
                    {achievements.map((a: any) => (
                      <li key={a.id} className="relative">
                        <span className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-3 h-3 rounded-full bg-gradient-hero" />
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-semibold text-sm sm:text-base">
                            {a.title}
                          </h3>
                          {a.year && (
                            <span className="text-xs font-bold text-coral">
                              {a.year}
                            </span>
                          )}
                        </div>
                        {a.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {a.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 sm:space-y-6">
              <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-lg sm:text-xl">
                    Contests
                  </h2>
                </div>
                {entries.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Not entered in any contest yet.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {entries.map((e: any) => (
                      <li key={e.id}>
                        <Link
                          href={`/contests/${e.contest.slug}`}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-secondary transition"
                        >
                          <span className="font-semibold text-sm">
                            {e.contest.title}
                          </span>
                          <span className="text-xs font-bold text-primary shrink-0">
                            {e.vote_count} votes
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {socials.length > 0 && (
                <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6">
                  <h2 className="font-display font-bold text-lg sm:text-xl">
                    Socials
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {socials.map((s) => (
                      <li key={s.href}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <s.icon className="w-4 h-4" /> {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {linked.length > 0 && (
                <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6">
                  <h2 className="font-display font-bold text-lg sm:text-xl">
                    Connected accounts
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {linked.map((a: any) => (
                      <li
                        key={a.provider}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <a
                          href={a.profile_url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold capitalize hover:text-primary"
                        >
                          {a.provider} · @{a.handle}
                        </a>
                        <span className="text-muted-foreground">
                          {(a.follower_count ?? 0).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6">
                <h2 className="font-display font-bold text-lg sm:text-xl">
                  Share this profile
                </h2>
                <div className="mt-4">
                  <ShareButtons
                    url={`${SITE}/c/${slug}`}
                    title={`Vote for ${c.display_name} on CrownPulse`}
                    target={{ contestant_id: c.id }}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}