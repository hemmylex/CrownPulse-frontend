"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Minus, Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { api } from "@/lib/api";

export function EntryCard({
  entry,
  rank,
  contestStatus,
  pricingKobo,
}: {
  entry: any;
  rank: number;
  contestStatus: string;
  pricingKobo: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function vote() {
    setPending(true);
    try {
      const res = await api.initiateVote({
        entry_id: entry.id,
        quantity: qty,
      });
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      } else if (res.stub) {
        toast.info(res.message ?? "Paystack not configured yet.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setPending(false);
    }
  }

  const c = entry.contestant;

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-card border border-border overflow-hidden hover:shadow-glow transition-all">
      <div className="aspect-[4/3] bg-gradient-royal grid place-items-center relative">
        {c?.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.photo_url}
            alt={c.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-display font-black text-5xl sm:text-6xl text-primary-foreground/80">
            {c?.display_name?.[0] ?? "?"}
          </span>
        )}
        <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-full">
          #{rank}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display font-bold text-lg sm:text-xl">
          {c?.display_name}
        </h3>
        {c?.city && (
          <p className="text-sm text-muted-foreground">{c.city}</p>
        )}

        <div className="mt-2 sm:mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-primary">
            {entry.vote_count.toLocaleString()} votes
          </span>
        </div>

        {contestStatus === "live" && (
          <div className="mt-3 sm:mt-4 space-y-2">
            <div className="flex items-center justify-between bg-secondary rounded-full px-2 py-1">
              <button
                type="button"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="w-8 h-8 rounded-full bg-card grid place-items-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold">
                {qty} vote{qty > 1 ? "s" : ""} · ₦
                {((pricingKobo * qty) / 100).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setQty((n) => Math.min(100, n + 1))}
                className="w-8 h-8 rounded-full bg-card grid place-items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {user ? (
              <button
                type="button"
                onClick={vote}
                disabled={pending}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground font-semibold py-2.5 rounded-full shadow-glow disabled:opacity-60 transition-opacity"
              >
                <Heart className="w-4 h-4 fill-current" />
                {pending ? "Redirecting…" : "Vote via Paystack"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-2.5 rounded-full"
              >
                Sign in to vote
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}