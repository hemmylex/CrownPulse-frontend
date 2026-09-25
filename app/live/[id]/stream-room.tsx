"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Minus, Plus, Users } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { ShareButtons } from "@/components/share-buttons";

export function StreamRoom({
  stream,
  entries,
  streamVotes,
  shareUrl,
}: {
  stream: any;
  entries: any[];
  streamVotes: number;
  shareUrl: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [rows, setRows] = useState(entries);
  const [selected, setSelected] = useState<string | null>(
    entries[0]?.id ?? null
  );
  const [qty, setQty] = useState(5);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // Keep the live leaderboard fresh while the show is running
  useEffect(() => {
    if (stream.status !== "live") return;
    const t = setInterval(async () => {
      try {
        const fresh = await api.getStream(stream.id);
        setRows(fresh.entries);
      } catch {
        // ignore refresh errors
      }
    }, 15000);
    return () => clearInterval(t);
  }, [stream.id, stream.status]);

  const price = stream.contest?.vote_price_kobo ?? 10000;
  const votingOpen =
    stream.voting_enabled &&
    stream.status === "live" &&
    stream.contest?.status === "live";

  async function vote() {
    if (!selected) return;
    setPending(true);
    try {
      const res = await api.initiateVote({
        entry_id: selected,
        quantity: qty,
        stream_id: stream.id,
      });
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      } else if (res.stub) {
        toast.info(res.message ?? "Paystack is not configured yet.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
      {/* Player + details */}
      <div>
        <div className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-border">
          {stream.embed_url ? (
            <iframe
              src={stream.embed_url}
              title={stream.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-sm text-muted-foreground px-4 text-center">
              The stream link will appear here when the show goes live.
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {stream.viewer_count.toLocaleString()} watching
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{streamVotes.toLocaleString()} votes cast in this show</span>
          {stream.contest && (
            <>
              <span className="hidden sm:inline">·</span>
              <Link
                href={`/contests/${stream.contest.slug}`}
                className="text-primary font-semibold hover:underline"
              >
                {stream.contest.title}
              </Link>
            </>
          )}
        </div>

        {stream.description && (
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {stream.description}
          </p>
        )}

        <div className="mt-5 sm:mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Share this show
          </p>
          <ShareButtons
            url={shareUrl}
            title={stream.title}
            target={{
              stream_id: stream.id,
              contest_id: stream.contest?.id,
            }}
          />
        </div>
      </div>

      {/* Leaderboard + voting */}
      <aside className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 h-fit lg:sticky lg:top-24">
        <h2 className="font-display font-bold text-xl sm:text-2xl">
          Live leaderboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap a contestant, then vote with Paystack.
        </p>

        <div className="mt-4 space-y-2 max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-1">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No entries linked to this show yet.
            </p>
          )}
          {rows.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelected(e.id)}
              className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border text-left transition ${
                selected === e.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <span className="w-6 text-sm font-bold text-muted-foreground shrink-0">
                #{i + 1}
              </span>
              {e.contestant?.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.contestant.photo_url}
                  alt={e.contestant.display_name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-royal grid place-items-center font-bold text-primary-foreground shrink-0 text-sm">
                  {e.contestant?.display_name?.[0] ?? "?"}
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block font-semibold truncate text-sm sm:text-base">
                  {e.contestant?.display_name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {e.vote_count.toLocaleString()} votes
                </span>
              </span>
            </button>
          ))}
        </div>

        {votingOpen ? (
          <div className="mt-4 sm:mt-5 space-y-3">
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
                {((price * qty) / 100).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setQty((n) => Math.min(500, n + 1))}
                className="w-8 h-8 rounded-full bg-card grid place-items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {user ? (
              <button
                type="button"
                onClick={vote}
                disabled={pending || !selected}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground font-semibold py-3 rounded-full shadow-glow disabled:opacity-60 transition-opacity"
              >
                <Heart className="w-4 h-4 fill-current" />
                {pending ? "Redirecting…" : "Vote via Paystack"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center bg-foreground text-background font-semibold py-3 rounded-full"
              >
                Sign in to vote
              </Link>
            )}
          </div>
        ) : (
          <p className="mt-4 sm:mt-5 text-sm text-muted-foreground rounded-2xl bg-secondary p-4">
            {stream.status === "ended"
              ? "This show has ended. Voting is closed."
              : "Live voting opens when the show goes live."}
          </p>
        )}
      </aside>
    </div>
  );
}