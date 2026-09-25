import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Camera, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { requireRole, getSessionAndRoles } from "@/lib/rbac";
import { ClaimRoleButton } from "./claim-role-button";

export const metadata: Metadata = {
  title: "Contestant workspace",
  description:
    "Manage your CrownPulse contestant portfolio, entries, and stream schedule.",
  robots: { index: false },
};

export default async function ContestantHome() {
  // Voters can self-claim the contestant role; admins pass through.
  const s = await getSessionAndRoles();
  if (!s) redirect("/auth/login?redirect=/contestant");

  const isContestant =
    s.roles.includes("contestant") || s.roles.includes("admin");

  if (!isContestant) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Become a contestant
          </span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl">
            Ready to enter the spotlight?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Claim the contestant role to unlock your portfolio, submit entries
            to live contests, and start collecting votes.
          </p>
          <div className="mt-6">
            <ClaimRoleButton role="contestant" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  await requireRole(["contestant", "admin"], "/contestant");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <header>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Contestant workspace
          </span>
          <h1 className="mt-2 font-display font-black text-2xl sm:text-3xl md:text-4xl">
            Welcome, {s.profile?.display_name ?? "contestant"} ✨
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Build your portfolio, enter contests, and go live to your voters.
          </p>
        </header>

        <section className="mt-6 sm:mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <Card
            icon={Camera}
            title="Portfolio"
            desc="Cover photo, gallery, video reel, achievements."
            cta="Open builder"
            href="/contestant/portfolio"
          />
          <Card
            icon={Trophy}
            title="My entries"
            desc="Apply to open contests and track your review status."
            cta="Manage entries"
            href="/contestant/entries"
          />
          <Card
            icon={Sparkles}
            title="Social accounts"
            desc="Link Instagram, X, TikTok and YouTube to your profile."
            cta="Connect handles"
            href="/contestant/social"
          />
        </section>

        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
          <Link
            href="/contestant/portfolio"
            className="inline-flex bg-gradient-hero text-primary-foreground font-semibold px-5 py-3 rounded-full shadow-glow hover:opacity-95 transition text-sm sm:text-base"
          >
            Build my portfolio
          </Link>
          <Link
            href="/contestant/entries"
            className="inline-flex bg-secondary font-semibold px-5 py-3 rounded-full hover:bg-muted transition text-sm sm:text-base"
          >
            Enter a contest
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  cta,
  href,
}: {
  icon: any;
  title: string;
  desc: string;
  cta: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-hero shadow-glow">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
      </span>
      <h3 className="mt-3 sm:mt-4 font-display font-bold text-lg sm:text-xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-3 sm:mt-4 text-xs uppercase tracking-widest font-bold text-coral">
        {cta}
      </div>
    </>
  );

  const cls =
    "rounded-2xl sm:rounded-3xl bg-card border border-border p-5 sm:p-6 block";

  return href ? (
    <Link
      href={href}
      className={`${cls} hover:border-primary transition`}
    >
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}