"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { api } from "@/lib/api";
import { supabaseBrowser } from "@/lib/supabase/client";

export function FollowButton({
  contestantId,
  initialCount,
}: {
  contestantId: string;
  initialCount: number;
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, start] = useTransition();

  useEffect(() => {
    supabaseBrowser()
      .auth.getUser()
      .then(async ({ data }) => {
        const ok = !!data.user;
        setSignedIn(ok);
        if (ok) {
          try {
            const res = await api.isFollowing(contestantId);
            setFollowing(res.following);
          } catch {
            // ignore
          }
        }
      });
  }, [contestantId]);

  if (signedIn === false) {
    return (
      <a
        href="/auth/login"
        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-secondary font-semibold text-sm hover:bg-muted transition"
      >
        <Heart className="w-4 h-4" />
        Sign in to follow · {count}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={pending || signedIn === null}
      onClick={() =>
        start(async () => {
          try {
            if (following) {
              await api.unfollow(contestantId);
              setFollowing(false);
              setCount((c) => Math.max(c - 1, 0));
            } else {
              await api.follow(contestantId);
              setFollowing(true);
              setCount((c) => c + 1);
            }
          } catch {
            // ignore
          }
        })
      }
      className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition disabled:opacity-60 ${
        following
          ? "bg-secondary text-foreground hover:bg-muted"
          : "bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
      }`}
    >
      <Heart
        className={`w-4 h-4 ${following ? "fill-current text-coral" : ""}`}
      />
      {following ? "Following" : "Follow"} · {count}
    </button>
  );
}