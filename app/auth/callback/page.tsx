"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

// Landing spot after a social sign-in redirect.
// We wait for the session to be written to storage, then move the user on.
function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => {
    const sb = supabaseBrowser();
    let done = false;

    const go = () => {
      if (done) return;
      done = true;
      router.replace(redirect);
      router.refresh();
    };

    sb.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) go();
    });

    // Fallback: if session never arrives, send them back to login
    const timeout = setTimeout(() => {
      router.replace("/auth/login");
    }, 8000);

    return () => {
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, [redirect, router]);

  return (
    <main className="min-h-screen grid place-items-center bg-background px-4 sm:px-6">
      <div className="text-center">
        <span className="inline-grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-hero shadow-glow mb-3 sm:mb-4 animate-pulse">
          <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
        </span>
        <p className="font-semibold text-sm sm:text-base">Signing you in…</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-background">
          <p className="text-muted-foreground text-sm">Loading…</p>
        </main>
      }
    >
      <Callback />
    </Suspense>
  );
}