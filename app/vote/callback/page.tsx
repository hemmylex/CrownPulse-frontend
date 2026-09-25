"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

export default function VoteCallbackPage() {
  const params = useSearchParams();
  const reference = params.get("reference");
  const [status, setStatus] = useState<
    "loading" | "success" | "pending" | "failed" | "error"
  >("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    api
      .verifyVoteByReference({ reference })
      .then((r) => setStatus(r.status))
      .catch(() => setStatus("error"));
  }, [reference]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 grid place-items-center px-4 sm:px-6 py-10 sm:py-14 text-center">
        <div className="max-w-md w-full">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 mx-auto animate-spin text-primary" />
              <h1 className="mt-5 sm:mt-6 font-display font-black text-2xl sm:text-3xl">
                Confirming your vote…
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Please wait a moment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-primary" />
              <h1 className="mt-5 sm:mt-6 font-display font-black text-3xl sm:text-4xl">
                Vote confirmed 🎉
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Thanks for supporting your fave. You earned loyalty points!
              </p>
            </>
          )}

          {status === "pending" && (
            <>
              <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-primary" />
              <h1 className="mt-5 sm:mt-6 font-display font-black text-2xl sm:text-3xl">
                Still processing
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                This can take a minute. Check your history shortly.
              </p>
            </>
          )}

          {(status === "failed" || status === "error") && (
            <>
              <XCircle className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-destructive" />
              <h1 className="mt-5 sm:mt-6 font-display font-black text-2xl sm:text-3xl">
                Vote failed
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                The payment didn&apos;t go through. You can try again.
              </p>
            </>
          )}

          <Link
            href="/dashboard"
            className="mt-6 sm:mt-8 inline-flex bg-gradient-hero text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:opacity-95 transition"
          >
            Go to dashboard
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}