"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, type InputHTMLAttributes } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { api } from "@/lib/api";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const display_name = String(formData.get("display_name"));

    setLoading(true);

    try {
      const res = await api.signup({ email, password, display_name });
      await supabaseBrowser().auth.signInWithPassword({ email, password });

      if (res.dev_link) {
        setDevLink(res.dev_link);
      } else {
        toast.success("Check your inbox! We sent a verification link.");
      }

      router.push("/auth/verify?pending=1");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
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
            <Image
              src="/logo.png"
              alt="CrownPulse logo"
              width={60}
              height={60}
              className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-contain mb-3 sm:mb-4"
              priority
            />
            <h1 className="font-display font-black text-3xl sm:text-4xl">
              Join the pulse
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Vote, enter contests, and unlock rewards.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft space-y-4"
          >
            <Field
              label="Display name"
              name="display_name"
              placeholder="Ada Nwosu"
              required
              minLength={2}
              disabled={loading}
              autoComplete="name"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              disabled={loading}
              autoComplete="email"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Min 8 characters"
              required
              minLength={8}
              disabled={loading}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-hero text-primary-foreground font-semibold py-3 rounded-full shadow-glow disabled:opacity-60 transition-opacity"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>

            {devLink && (
              <div className="rounded-xl bg-secondary p-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dev: email domain not set up yet
                </div>
                <a
                  href={devLink}
                  className="text-primary break-all underline"
                >
                  {devLink}
                </a>
              </div>
            )}
          </form>

          {/* Social auth */}
          <div className="mt-6">
            <SocialAuthButtons redirectTo="/dashboard" />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <input
        {...rest}
        className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
      />
    </label>
  );
}