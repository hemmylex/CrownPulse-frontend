"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { api } from "@/lib/api";

const PLATFORMS = [
  "instagram",
  "twitter",
  "tiktok",
  "facebook",
  "youtube",
  "linkedin",
] as const;

export function SocialLinksForm({ initial }: { initial: any[] }) {
  const [accounts, setAccounts] = useState<any[]>(initial);
  const [provider, setProvider] = useState<string>("instagram");
  const [handle, setHandle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [followers, setFollowers] = useState(0);
  const [pending, start] = useTransition();

  const input =
    "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring";

  function save() {
    start(async () => {
      try {
        const saved = await api.saveSocialAccount({
          provider,
          handle,
          profile_url: profileUrl || undefined,
          follower_count: Number(followers) || 0,
        });
        setAccounts((a) => [
          ...a.filter((x) => x.provider !== provider),
          saved,
        ]);
        setHandle("");
        setProfileUrl("");
        setFollowers(0);
        toast.success("Social account connected");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not save account"
        );
      }
    });
  }

  function remove(p: string) {
    start(async () => {
      try {
        await api.deleteSocialAccount(p);
        setAccounts((a) => a.filter((x) => x.provider !== p));
        toast.success("Account removed");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not remove account"
        );
      }
    });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">
      {/* Add form */}
      <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl mb-4">
          Add a handle
        </h2>
        <div className="space-y-3">
          <select
            className={input}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            className={input}
            placeholder="@handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
          <input
            className={input}
            placeholder="Profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          <input
            className={input}
            type="number"
            min={0}
            placeholder="Follower count"
            value={followers}
            onChange={(e) => setFollowers(Number(e.target.value))}
          />
          <button
            type="button"
            onClick={save}
            disabled={pending || handle.trim().length < 1}
            className="bg-gradient-hero text-primary-foreground font-semibold px-5 py-2.5 rounded-full shadow-glow disabled:opacity-60 hover:opacity-95 transition text-sm sm:text-base"
          >
            {pending ? "Connecting…" : "Connect account"}
          </button>
        </div>
      </section>

      {/* Connected list */}
      <section className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl mb-4">
          Connected
        </h2>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No social accounts yet. Adding them boosts your profile reach.
          </p>
        ) : (
          <ul className="space-y-3">
            {accounts.map((a) => (
              <li
                key={a.provider}
                className="flex items-center justify-between gap-3 rounded-2xl bg-secondary px-3 sm:px-4 py-2.5 sm:py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold capitalize text-sm sm:text-base">
                    {a.provider}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    @{a.handle} · {(a.follower_count ?? 0).toLocaleString()}{" "}
                    followers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(a.provider)}
                  disabled={pending}
                  className="text-destructive p-2 rounded-full hover:bg-destructive/10 transition shrink-0"
                  aria-label={`Remove ${a.provider}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}