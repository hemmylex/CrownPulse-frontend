"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MailCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const pending = params.get("pending");

  const [status, setStatus] = useState<"idle" | "verifying" | "ok" | "err">(
    token ? "verifying" : "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    api
      .verifyEmail({ token })
      .then(() => setStatus("ok"))
      .catch((e) => {
        setStatus("err");
        setError(e instanceof Error ? e.message : "Verification failed");
      });
  }, [token]);

  async function onResend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResending(true);

    try {
      const res = await api.resendVerification({
        email: String(formData.get("email")),
      });

      if (res.dev_link) {
        setDevLink(res.dev_link);
      } else {
        toast.success("If that email exists, we've sent a new link.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md text-center">
      <span className="inline-grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-hero shadow-glow mb-3 sm:mb-4 mx-auto">
        {status === "ok" ? (
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
        ) : (
          <MailCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
        )}
      </span>

      {status === "ok" ? (
        <>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            You&apos;re verified 🎉
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Your CrownPulse account is ready.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 inline-flex bg-gradient-hero text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:opacity-95 transition"
          >
            Go to dashboard
          </button>
        </>
      ) : status === "verifying" ? (
        <>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            Verifying…
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            One moment.
          </p>
        </>
      ) : status === "err" ? (
        <>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            Link invalid
          </h1>
          <p className="mt-2 text-destructive text-sm">{error}</p>
          <ResendForm
            onSubmit={onResend}
            devLink={devLink}
            loading={resending}
          />
        </>
      ) : (
        <>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {pending
              ? "We just sent a verification link to your email. It expires in 15 minutes."
              : "Click the link in the email we sent to activate your account."}
          </p>
          <ResendForm
            onSubmit={onResend}
            devLink={devLink}
            loading={resending}
          />
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm text-primary font-semibold hover:underline"
          >
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 grid place-items-center px-4 sm:px-6 py-10 sm:py-14">
        <Suspense
          fallback={
            <div className="w-full max-w-md text-center text-muted-foreground py-12">
              Loading…
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}

function ResendForm({
  onSubmit,
  devLink,
  loading,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  devLink: string | null;
  loading: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-left space-y-3"
    >
      <span className="text-sm font-semibold">Resend verification email</span>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          name="email"
          type="email"
          placeholder="you@email.com"
          required
          disabled={loading}
          autoComplete="email"
          className="flex-1 bg-background border border-input rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-foreground text-background font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60 transition-opacity"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
      {devLink && (
        <div className="rounded-xl bg-secondary p-3 text-xs">
          Dev link:{" "}
          <a href={devLink} className="text-primary break-all underline">
            {devLink}
          </a>
        </div>
      )}
    </form>
  );
}