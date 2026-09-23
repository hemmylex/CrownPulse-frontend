"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    setLoading(true);

    try {
      const sb = supabaseBrowser();
      const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      const { data: profile } = await sb
        .from("profiles")
        .select("email_verified")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!profile?.email_verified) {
        toast.info("Please verify your email to continue.");
        router.push("/auth/verify?pending=1");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 grid place-items-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-hero shadow-glow mb-3 sm:mb-4">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl">
              Welcome back
            </h1>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft space-y-4"
          >
            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Email</span>
              <input
                name="email"
                type="email"
                required
                disabled={loading}
                autoComplete="email"
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Password</span>
              <input
                name="password"
                type="password"
                required
                disabled={loading}
                autoComplete="current-password"
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-hero text-primary-foreground font-semibold py-3 rounded-full shadow-glow disabled:opacity-60 transition-opacity"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm pt-1">
              <Link
                href="/auth/signup"
                className="text-primary font-semibold hover:underline"
              >
                Create account
              </Link>
              <Link
                href="/auth/verify"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Resend verification
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}