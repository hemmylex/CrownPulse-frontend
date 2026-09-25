"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trophy, Send, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

type Entry = {
  id: string;
  status: "pending" | "approved" | "rejected" | "eliminated";
  vote_count: number;
  pitch: string | null;
  created_at: string;
  contest: {
    id: string;
    slug: string;
    title: string;
    status: string;
    category: string | null;
    ends_at: string | null;
  } | null;
  round: {
    id: string;
    name: string;
    round_number: number;
    is_active: boolean;
  } | null;
};

type Open = {
  id: string;
  slug: string;
  title: string;
  status: string;
  category: string | null;
  tagline: string | null;
};

const STATUS_META: Record<
  Entry["status"],
  { label: string; cls: string; hint: string }
> = {
  pending: {
    label: "Under review",
    cls: "bg-secondary",
    hint: "Our team is reviewing your entry.",
  },
  approved: {
    label: "Approved",
    cls: "bg-primary/15 text-primary",
    hint: "You're live — share your profile and gather votes.",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-destructive/15 text-destructive",
    hint: "This entry wasn't accepted.",
  },
  eliminated: {
    label: "Eliminated",
    cls: "bg-muted text-muted-foreground",
    hint: "You didn't advance from this round.",
  },
};

export function EntriesManager({
  initialEntries,
  initialOpen,
}: {
  initialEntries: Entry[];
  initialOpen: Open[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [open, setOpen] = useState(initialOpen);
  const [selected, setSelected] = useState(initialOpen[0]?.id ?? "");
  const [pitch, setPitch] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const [mine, openList] = await Promise.all([
        api.myEntries(),
        api.openContests(),
      ]);
      setEntries(mine as Entry[]);
      setOpen(openList as Open[]);
      setSelected((openList as Open[])[0]?.id ?? "");
    } catch {
      // keep current state
    }
  }

  async function apply() {
    if (!selected) return toast.error("Pick a contest to enter.");
    setBusy(true);
    try {
      await api.applyToContest({
        contest_id: selected,
        pitch: pitch.trim() || undefined,
      });
      setPitch("");
      await refresh();
      toast.success("Entry submitted — we'll review it shortly.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not submit entry"
      );
    } finally {
      setBusy(false);
    }
  }

  async function withdraw(id: string) {
    try {
      await api.withdrawEntry(id);
      await refresh();
      toast.success("Entry withdrawn.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not withdraw"
      );
    }
  }

  return (
    <div className="mt-6 sm:mt-8 grid lg:grid-cols-[380px_1fr] gap-5 sm:gap-8 items-start">
      {/* Apply form */}
      <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-display font-bold text-lg sm:text-xl flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" /> Enter a contest
        </h2>

        {open.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No open contests right now — check back soon.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <select
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {open.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} · {c.status}
                </option>
              ))}
            </select>

            <textarea
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm min-h-28 outline-none focus:ring-2 ring-primary"
              placeholder="Your pitch — why should voters crown you?"
              value={pitch}
              maxLength={2000}
              onChange={(e) => setPitch(e.target.value)}
            />

            <button
              type="button"
              onClick={apply}
              disabled={busy}
              className="w-full px-5 py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold shadow-glow disabled:opacity-60 hover:opacity-95 transition text-sm sm:text-base"
            >
              {busy ? "Submitting…" : "Submit entry"}
            </button>

            <p className="text-xs text-muted-foreground">
              Make sure your portfolio is complete before applying —
              reviewers look at it first.
            </p>
          </div>
        )}
      </section>

      {/* Entries list */}
      <section>
        <h2 className="font-display font-bold text-xl sm:text-2xl flex items-center gap-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-coral" /> My entries
        </h2>

        <div className="mt-4 space-y-4">
          {entries.length === 0 && (
            <p className="text-sm sm:text-base text-muted-foreground">
              You haven&apos;t entered any contests yet.
            </p>
          )}

          {entries.map((e) => {
            const meta = STATUS_META[e.status];
            return (
              <article
                key={e.id}
                className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base sm:text-lg">
                      {e.contest?.title ?? "Contest"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {e.round
                        ? `${e.round.name} (round ${e.round.round_number})`
                        : "No round assigned"}{" "}
                      · {e.vote_count} votes
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shrink-0 ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {meta.hint}
                </p>
                {e.pitch && (
                  <p className="mt-2 text-sm">{e.pitch}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {e.contest && (
                    <Link
                      href={`/contests/${e.contest.slug}`}
                      className="px-4 py-2 rounded-full bg-secondary text-sm font-semibold hover:bg-muted transition"
                    >
                      View contest
                    </Link>
                  )}
                  {e.vote_count === 0 && e.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => withdraw(e.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Withdraw
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}