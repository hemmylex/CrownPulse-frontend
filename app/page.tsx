import Link from "next/link";
import Image from "next/image";
import {
  Crown,
  Sparkles,
  Heart,
  Trophy,
  Zap,
  Gift,
  Users,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Roles />
      <Stats />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      {/* Decorative blurs */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-40 -right-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-coral/40 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 md:pt-24 pb-14 sm:pb-20 md:pb-28 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* Left content */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Paystack · Made in Nigeria
          </span>

          <h1 className="mt-5 font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
            Vote. <span className="text-gradient italic">Crown.</span>
            <br />
            Celebrate.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
            The playful home for pageants, talent shows and brand contests
            across Nigeria. Cast secure votes, earn rewards, and cheer on the
            next star.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              href="/contests"
              className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full shadow-glow hover:scale-[1.02] transition"
            >
              Start voting <Heart className="w-4 h-4 fill-current" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-card border border-border font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full hover:bg-secondary transition"
            >
              Enter a contest <Crown className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground justify-center md:justify-start">
            <div className="flex -space-x-2">
              {["#ff4f8a", "#ff8a5c", "#ffbf47", "#c04adf"].map((c) => (
                <span
                  key={c}
                  className="w-8 h-8 rounded-full border-2 border-background"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>
              <b className="text-foreground">12,400+</b> voters this week
            </span>
          </div>
        </div>

        {/* Right image + floating cards */}
        <div className="relative max-w-lg mx-auto md:max-w-none">
          <div className="absolute inset-0 bg-gradient-royal rounded-[2rem] sm:rounded-[2.5rem] blur-2xl opacity-40 scale-95" />
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-glow border-4 border-card">
            <Image
              src="/hero-crown.jpg"
              alt="Three Nigerian contestants wearing sparkling crowns"
              width={1600}
              height={1200}
              priority
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Floating card - Leading */}
          <div className="absolute -left-2 sm:-left-4 md:-left-10 top-4 sm:top-8 bg-card rounded-2xl shadow-soft border border-border px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 animate-float">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-hero grid place-items-center shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </span>
            <div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Leading
              </div>
              <div className="text-xs sm:text-sm font-bold">
                Adaeze · 8,420 votes
              </div>
            </div>
          </div>

          {/* Floating card - Live now */}
          <div
            className="absolute -right-1 sm:-right-2 md:-right-8 bottom-4 sm:bottom-6 bg-card rounded-2xl shadow-soft border border-border px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-coral grid place-items-center shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-coral-foreground" />
            </span>
            <div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Live now
              </div>
              <div className="text-xs sm:text-sm font-bold">
                Face of Lagos &apos;26
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Face of Lagos",
    "Naija Voice",
    "Campus Queen",
    "Afrobeats Star",
    "Chef Champion",
    "Style Icon",
  ];

  return (
    <div className="bg-gradient-royal py-3.5 sm:py-4 overflow-hidden">
      <div className="flex gap-8 sm:gap-10 whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 sm:gap-3 font-display italic font-bold text-xl sm:text-2xl text-primary-foreground/90"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold shrink-0" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: Heart,
      title: "Paystack voting",
      body: "Cards, transfers, USSD and mobile money. Every vote is secure and instant.",
      tint: "primary" as const,
    },
    {
      icon: Trophy,
      title: "Live leaderboards",
      body: "Watch votes climb in real time. No refreshing, no waiting.",
      tint: "coral" as const,
    },
    {
      icon: Gift,
      title: "Rewards that pop",
      body: "Earn badges, coupons and brand perks the more you play.",
      tint: "gold" as const,
    },
    {
      icon: Users,
      title: "Fan communities",
      body: "Join fan clubs, chat with contestants, and stream live shows.",
      tint: "primary" as const,
    },
    {
      icon: Sparkles,
      title: "Brand campaigns",
      body: "Sponsor contests, launch AR filters, and reach real fans.",
      tint: "coral" as const,
    },
    {
      icon: Crown,
      title: "Contestant portfolios",
      body: "Beautiful profiles with bios, photos, videos and endorsements.",
      tint: "gold" as const,
    },
  ];

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28"
    >
      <div className="max-w-2xl">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">
          Everything you need
        </span>
        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl md:text-5xl leading-tight">
          Built for the whole{" "}
          <span className="text-gradient italic">pageant party</span>.
        </h2>
      </div>

      <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map(({ icon: Icon, title, body, tint }) => (
          <div
            key={title}
            className="group relative rounded-2xl sm:rounded-3xl bg-card border border-border p-5 sm:p-6 hover:shadow-glow hover:-translate-y-1 transition-all"
          >
            <span
              className={`inline-grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl mb-4 ${
                tint === "primary"
                  ? "bg-gradient-hero"
                  : tint === "coral"
                    ? "bg-coral"
                    : "bg-gold"
              }`}
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  tint === "coral"
                    ? "text-coral-foreground"
                    : tint === "gold"
                      ? "text-foreground"
                      : "text-primary-foreground"
                }`}
              />
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl">
              {title}
            </h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Discover a contest",
      body: "Browse personalized feeds of pageants, talent shows and brand challenges.",
    },
    {
      n: "02",
      title: "Verify & vote",
      body: "Sign up with email verification, then vote securely with Paystack.",
    },
    {
      n: "03",
      title: "Earn & celebrate",
      body: "Collect badges, unlock coupons, and share your crown moments.",
    },
  ];

  return (
    <section id="how" className="bg-gradient-soft py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-coral">
            How it works
          </span>
          <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl md:text-5xl">
            Three steps to the crown.
          </h2>
        </div>

        <div className="mt-10 sm:mt-12 grid md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl sm:rounded-3xl bg-card p-6 sm:p-8 border border-border shadow-soft"
            >
              <span className="font-display italic text-4xl sm:text-5xl text-gradient font-black">
                {s.n}
              </span>
              <h3 className="mt-3 sm:mt-4 font-display font-bold text-xl sm:text-2xl">
                {s.title}
              </h3>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roles() {
  const roles = [
    {
      tag: "For voters",
      title: "Root for your fave.",
      perks: [
        "Personalized contest feed",
        "Paystack in one tap",
        "Loyalty rewards & badges",
      ],
      accent: "bg-gradient-hero text-primary-foreground",
    },
    {
      tag: "For contestants",
      title: "Own your spotlight.",
      perks: [
        "Portfolio pages with video",
        "Share-ready voting links",
        "Milestone-triggered prizes",
      ],
      accent: "bg-coral text-coral-foreground",
    },
    {
      tag: "For brands",
      title: "Sponsor the moment.",
      perks: [
        "Sponsored campaigns & AR",
        "Real-time ROI dashboards",
        "Coupon & perk delivery",
      ],
      accent: "bg-foreground text-background",
    },
  ];

  return (
    <section
      id="roles"
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28"
    >
      <div className="max-w-2xl">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">
          Made for everyone
        </span>
        <h2 className="mt-3 font-display font-black text-3xl sm:text-4xl md:text-5xl">
          One platform.{" "}
          <span className="italic text-gradient">Three crowns.</span>
        </h2>
      </div>

      <div className="mt-10 sm:mt-12 grid md:grid-cols-3 gap-4 sm:gap-5">
        {roles.map((r) => (
          <article
            key={r.tag}
            className={`relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-7 ${r.accent} shadow-soft`}
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <span className="relative text-xs font-bold uppercase tracking-widest opacity-80">
              {r.tag}
            </span>
            <h3 className="relative mt-2 font-display font-black text-2xl sm:text-3xl">
              {r.title}
            </h3>
            <ul className="relative mt-5 sm:mt-6 space-y-2.5 text-sm">
              {r.perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check className="w-4 h-4 opacity-80 shrink-0" /> {p}
                </li>
              ))}
            </ul>
            <Link
              href="/contests"
              className="relative mt-6 sm:mt-8 inline-flex items-center gap-1.5 bg-background/15 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold hover:bg-background/25 transition"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: "2M+", l: "Votes cast" },
    { n: "450+", l: "Contests hosted" },
    { n: "90+", l: "Brand partners" },
    { n: "5", l: "Languages" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
      <div className="rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-royal p-6 sm:p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 text-primary-foreground shadow-glow">
        {stats.map((s) => (
          <div key={s.l} className="text-center md:text-left">
            <div className="font-display font-black text-3xl sm:text-4xl md:text-5xl">
              {s.n}
            </div>
            <div className="mt-1 text-xs sm:text-sm opacity-80">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 text-center">
      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        Join the pulse
      </span>

      <h2 className="mt-5 font-display font-black text-3xl sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-[1.05]">
        Ready to crown the{" "}
        <span className="text-gradient italic">next star</span>?
      </h2>

      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
        Sign up in seconds. Vote in one tap. Get rewarded for showing up.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-glow hover:scale-[1.02] transition"
        >
          Create free account <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/contests"
          className="inline-flex items-center gap-2 bg-card border border-border font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-secondary transition"
        >
          Explore contests
        </Link>
      </div>
    </section>
  );
}