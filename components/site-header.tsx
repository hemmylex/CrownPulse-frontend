"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Crown, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

const navLinks = [
  { href: "/contests", label: "Contests" },
  { href: "/contestants", label: "Contestants" },
  { href: "/live", label: "Live" },
  { href: "/winners", label: "Winners" },
  { href: "/rewards", label: "Rewards" },
  { href: "/#how", label: "How it works" },
];

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sb = supabaseBrowser();

    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    setMobileOpen(false);
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 sm:h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-hero grid place-items-center shadow-glow">
            <Crown
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </span>
          <span className="font-display font-black text-lg sm:text-xl tracking-tight">
            CrownPulse
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth + Mobile toggle */}
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="h-9 w-20 sm:w-24 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full hover:bg-secondary transition"
              >
                <UserIcon className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full hover:bg-secondary transition"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex text-sm font-semibold text-foreground/80 hover:text-foreground px-3 py-2 transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 bg-gradient-hero text-primary-foreground text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-glow hover:opacity-95 transition"
              >
                Join
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-border/60 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition"
                  >
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-hero text-primary-foreground text-center"
                  >
                    Join CrownPulse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}