"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/client";

// Social sign-in. Email + our own verification link stays the primary path;
// these are shortcuts. X only appears when the deployment has it configured.
const X_ENABLED = process.env.NEXT_PUBLIC_ENABLE_X_LOGIN === "true";

type Provider = "google" | "apple" | "twitter";

export function SocialAuthButtons({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string;
}) {
  const [busy, setBusy] = useState<Provider | null>(null);

  async function signIn(provider: Provider) {
    setBusy(provider);
    try {
      const { error } = await supabaseBrowser().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start sign in"
      );
      setBusy(null);
    }
  }

  const providers: Array<{
    id: Provider;
    label: string;
    mark: ReactNode;
  }> = [
    {
      id: "google",
      label: "Continue with Google",
      mark: <GoogleMark />,
    },
    {
      id: "apple",
      label: "Continue with Apple",
      mark: <AppleMark />,
    },
    ...(X_ENABLED
      ? [
          {
            id: "twitter" as const,
            label: "Continue with X",
            mark: <XMark />,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => signIn(p.id)}
          disabled={busy !== null}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-background py-3 text-sm sm:text-base font-semibold hover:bg-secondary transition disabled:opacity-60"
        >
          {p.mark}
          {busy === p.id ? "Redirecting…" : p.label}
        </button>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.7 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.8l7.8 6.1C12.3 13.7 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.3z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.1a14.6 14.6 0 0 1 0-8.2l-7.8-6.1a23.6 23.6 0 0 0 0 20.4l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 47.5c6.2 0 11.5-2 15.4-5.6l-7.5-5.8c-2.1 1.4-4.8 2.2-7.9 2.2-6.4 0-11.7-4.2-13.6-10l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.365 1.43c0 1.14-.46 2.23-1.22 3.04-.8.86-2.1 1.52-3.2 1.43-.14-1.1.42-2.26 1.16-3.04.8-.86 2.2-1.5 3.26-1.43zM20.5 17.1c-.56 1.25-.83 1.8-1.55 2.9-.99 1.5-2.4 3.37-4.15 3.39-1.55.02-1.95-1-4.05-1-2.1 0-2.55.98-4.1 1.02-1.75.04-3.08-1.62-4.08-3.12-2.8-4.2-3.1-9.15-1.37-11.76 1.2-1.8 3.1-2.85 4.9-2.85 1.82 0 2.96 1.05 4.46 1.05 1.45 0 2.33-1.05 4.4-1.05 1.57 0 3.23.86 4.42 2.34-3.88 2.13-3.25 7.68.12 9.08z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
    </svg>
  );
}