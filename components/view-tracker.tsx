"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

function getSessionId(): string | undefined {
  try {
    let id = localStorage.getItem("cp_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("cp_session", id);
    }
    return id;
  } catch {
    // localStorage may be unavailable (SSR / private mode)
    return undefined;
  }
}

/**
 * Logs one page view so brands can measure campaign reach.
 * Fire-and-forget — renders nothing.
 */
export function ViewTracker({
  contestId,
  contestantId,
}: {
  contestId?: string;
  contestantId?: string;
}) {
  useEffect(() => {
    api
      .trackView({
        path: window.location.pathname,
        contest_id: contestId,
        contestant_id: contestantId,
        session_id: getSessionId(),
        referrer: document.referrer || undefined,
      })
      .catch(() => {
        // silently ignore tracking failures
      });
  }, [contestId, contestantId]);

  return null;
}