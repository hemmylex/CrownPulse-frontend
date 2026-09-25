import { supabaseBrowser } from "@/lib/supabase/client";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(
  /\/$/,
  ""
);

type Opts = {
  auth?: boolean;
  token?: string;
};

export type Role = "admin" | "brand" | "contestant" | "voter";

async function browserAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  const { data } = await supabaseBrowser().auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: Opts = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  } else if (opts.auth) {
    Object.assign(headers, await browserAuthHeader());
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      (json && (json.error || json.message)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}

export const api = {
  // ─── Auth ───────────────────────────────────────────────
  signup: (b: {
    email: string;
    password: string;
    display_name: string;
  }) =>
    request<{ ok: true; email_sent: boolean; dev_link: string | null }>(
      "POST",
      "/api/auth/signup",
      b
    ),

  verifyEmail: (b: { token: string }) =>
    request<{ ok: true }>("POST", "/api/auth/verify", b),

  resendVerification: (b: { email: string }) =>
    request<{ ok: true; email_sent?: boolean; dev_link?: string | null }>(
      "POST",
      "/api/auth/resend",
      b
    ),

  me: (opts?: Opts) =>
    request<{
      profile: {
        id: string;
        email: string;
        display_name: string | null;
        avatar_url: string | null;
        email_verified: boolean;
        points: number;
      } | null;
      roles: Role[];
    }>("GET", "/api/auth/me", undefined, { auth: true, ...opts }),

  claimRole: (b: { role: "contestant" | "brand" }, opts?: Opts) =>
    request<{ ok: true }>("POST", "/api/auth/roles", b, {
      auth: true,
      ...opts,
    }),

  // ─── Contests ───────────────────────────────────────────
  listContests: () => request<any[]>("GET", "/api/contests"),

  getContestBySlug: (slug: string) =>
    request<{ contest: any; entries: any[] }>(
      "GET",
      `/api/contests/${encodeURIComponent(slug)}`
    ),

  // ─── Contestants ────────────────────────────────────────
  listContestants: (q?: string) =>
    request<any[]>(
      "GET",
      `/api/contestants${q ? `?q=${encodeURIComponent(q)}` : ""}`
    ),

  getContestantBySlug: (slug: string) =>
    request<{
      contestant: any;
      entries: any[];
      media: any[];
      achievements: any[];
      total_votes: number;
    }>("GET", `/api/contestants/${encodeURIComponent(slug)}`),

  myContestant: (opts?: Opts) =>
    request<any | null>("GET", "/api/contestants/me", undefined, {
      auth: true,
      ...opts,
    }),

  saveContestant: (b: Record<string, unknown>, opts?: Opts) =>
    request<any>("POST", "/api/contestants/me", b, { auth: true, ...opts }),

  addMedia: (b: {
    url: string;
    kind?: "image" | "video";
    caption?: string;
    sort_order?: number;
  }) =>
    request<any>("POST", "/api/contestants/me/media", b, { auth: true }),

  deleteMedia: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/contestants/me/media/${id}`,
      undefined,
      { auth: true }
    ),

  addAchievement: (b: {
    title: string;
    description?: string;
    year?: number;
  }) =>
    request<any>("POST", "/api/contestants/me/achievements", b, {
      auth: true,
    }),

  deleteAchievement: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/contestants/me/achievements/${id}`,
      undefined,
      { auth: true }
    ),

  isFollowing: (id: string, opts?: Opts) =>
    request<{ following: boolean }>(
      "GET",
      `/api/contestants/${id}/follow`,
      undefined,
      { auth: true, ...opts }
    ),

  follow: (id: string) =>
    request<{ ok: true }>(
      "POST",
      `/api/contestants/${id}/follow`,
      {},
      { auth: true }
    ),

  unfollow: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/contestants/${id}/follow`,
      undefined,
      { auth: true }
    ),

  // ─── Entries ────────────────────────────────────────────
  applyToContest: (b: { contest_id: string; pitch?: string }) =>
    request<any>("POST", "/api/entries/apply", b, { auth: true }),

  myEntries: (opts?: Opts) =>
    request<any[]>("GET", "/api/entries/mine", undefined, {
      auth: true,
      ...opts,
    }),

  openContests: (opts?: Opts) =>
    request<any[]>("GET", "/api/entries/open", undefined, {
      auth: true,
      ...opts,
    }),

  withdrawEntry: (id: string) =>
    request<{ ok: true }>("DELETE", `/api/entries/${id}`, undefined, {
      auth: true,
    }),

  // ─── Votes ──────────────────────────────────────────────
  initiateVote: (b: {
    entry_id: string;
    quantity: number;
    stream_id?: string;
  }) =>
    request<{
      reference: string;
      authorization_url: string | null;
      stub?: boolean;
      message?: string;
    }>("POST", "/api/votes/init", b, { auth: true }),

  verifyVoteByReference: (b: { reference: string }) =>
    request<{ status: "success" | "pending" | "failed" }>(
      "POST",
      "/api/votes/verify",
      b
    ),

  listMyVotes: (opts?: Opts) =>
    request<any[]>("GET", "/api/votes/mine", undefined, {
      auth: true,
      ...opts,
    }),

  // ─── Rewards ────────────────────────────────────────────
  listMyRewards: (opts?: Opts) =>
    request<any[]>("GET", "/api/rewards/mine", undefined, {
      auth: true,
      ...opts,
    }),

  redeemReward: (b: { id: string }) =>
    request<{ ok: true }>("POST", "/api/rewards/redeem", b, { auth: true }),

  listRewardCatalog: () => request<any[]>("GET", "/api/rewards/catalog"),

  claimReward: (b: { catalog_id: string }) =>
    request<{ reward: any; points_left: number }>(
      "POST",
      "/api/rewards/claim",
      b,
      { auth: true }
    ),

  adminListRewardCatalog: (opts?: Opts) =>
    request<any[]>("GET", "/api/rewards/catalog/all", undefined, {
      auth: true,
      ...opts,
    }),

  adminCreateRewardItem: (b: Record<string, unknown>) =>
    request<any>("POST", "/api/rewards/catalog", b, { auth: true }),

  adminUpdateRewardItem: (id: string, b: Record<string, unknown>) =>
    request<any>("PUT", `/api/rewards/catalog/${id}`, b, { auth: true }),

  adminDeleteRewardItem: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/rewards/catalog/${id}`,
      undefined,
      { auth: true }
    ),

  // ─── Manage (Admin / Brand) ─────────────────────────────
  finalizeContest: (contestId: string, top_n = 3) =>
    request<{ created: number }>(
      "POST",
      `/api/manage/contests/${contestId}/finalize`,
      { top_n },
      { auth: true }
    ),

  listManagedWinners: (contestId: string, opts?: Opts) =>
    request<any[]>(
      "GET",
      `/api/manage/contests/${contestId}/winners`,
      undefined,
      { auth: true, ...opts }
    ),

  // ─── Admin ──────────────────────────────────────────────
  adminStats: (opts?: Opts) =>
    request<{
      contests: number;
      contestants: number;
      users: number;
      successful_votes: number;
      gross_naira: number;
    }>("GET", "/api/admin/stats", undefined, { auth: true, ...opts }),

  adminListUsers: (opts?: Opts) =>
    request<
      Array<{
        id: string;
        email: string;
        display_name: string | null;
        email_verified: boolean;
        points: number;
        created_at: string;
        roles: Role[];
      }>
    >("GET", "/api/admin/users", undefined, { auth: true, ...opts }),

  adminAssignRole: (
    b: { user_id: string; role: Role },
    opts?: Opts
  ) =>
    request<{ ok: true }>("POST", "/api/admin/roles/assign", b, {
      auth: true,
      ...opts,
    }),

  adminRevokeRole: (
    b: { user_id: string; role: Role },
    opts?: Opts
  ) =>
    request<{ ok: true }>("POST", "/api/admin/roles/revoke", b, {
      auth: true,
      ...opts,
    }),

  adminListContests: (opts?: Opts) =>
    request<any[]>("GET", "/api/admin/contests", undefined, {
      auth: true,
      ...opts,
    }),

  // ─── Brands & Campaigns ─────────────────────────────────
  listBrands: () => request<any[]>("GET", "/api/brands"),

  getBrandBySlug: (slug: string) =>
    request<{ brand: any; campaigns: any[] }>(
      "GET",
      `/api/brands/${encodeURIComponent(slug)}`
    ),

  myBrand: (opts?: Opts) =>
    request<any | null>("GET", "/api/brands/me", undefined, {
      auth: true,
      ...opts,
    }),

  saveBrand: (b: Record<string, unknown>, opts?: Opts) =>
    request<any>("POST", "/api/brands/me", b, { auth: true, ...opts }),

  createCampaign: (b: Record<string, unknown>) =>
    request<any>("POST", "/api/brands/me/campaigns", b, { auth: true }),

  updateCampaign: (id: string, b: Record<string, unknown>) =>
    request<any>("PUT", `/api/brands/me/campaigns/${id}`, b, {
      auth: true,
    }),

  deleteCampaign: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/brands/me/campaigns/${id}`,
      undefined,
      { auth: true }
    ),

  launchCampaign: (b: Record<string, unknown>) =>
    request<{ campaign: any; contest: any }>(
      "POST",
      "/api/brands/me/campaigns/launch",
      b,
      { auth: true }
    ),

  trackView: (b: {
    path: string;
    contest_id?: string;
    contestant_id?: string;
    session_id?: string;
    referrer?: string;
  }) => request<{ ok: true }>("POST", "/api/track/view", b),

  roiCsvUrl: (days: number) =>
    `${BASE}/api/brands/me/roi.csv?days=${days}`,

  brandRoi: (opts?: Opts & { days?: number }) =>
    request<BrandRoi | null>(
      "GET",
      `/api/brands/me/roi?days=${opts?.days ?? 30}`,
      undefined,
      { auth: true, ...opts }
    ),

  // ─── Admin CMS — Rounds, Entries, Winners ───────────────
  listRounds: (contestId: string, opts?: Opts) =>
    request<any[]>(
      "GET",
      `/api/manage/contests/${contestId}/rounds`,
      undefined,
      { auth: true, ...opts }
    ),

  createRound: (contestId: string, b: Record<string, unknown>) =>
    request<any>(
      "POST",
      `/api/manage/contests/${contestId}/rounds`,
      b,
      { auth: true }
    ),

  updateRound: (id: string, b: Record<string, unknown>) =>
    request<any>("PUT", `/api/manage/rounds/${id}`, b, { auth: true }),

  deleteRound: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/manage/rounds/${id}`,
      undefined,
      { auth: true }
    ),

  activateRound: (id: string) =>
    request<any>(
      "POST",
      `/api/manage/rounds/${id}/activate`,
      {},
      { auth: true }
    ),

  listManagedEntries: (contestId: string, opts?: Opts) =>
    request<any[]>(
      "GET",
      `/api/manage/contests/${contestId}/entries`,
      undefined,
      { auth: true, ...opts }
    ),

  setEntryStatus: (
    id: string,
    status: "pending" | "approved" | "rejected" | "eliminated"
  ) =>
    request<any>(
      "POST",
      `/api/manage/entries/${id}/status`,
      { status },
      { auth: true }
    ),

  createWinner: (b: Record<string, unknown>) =>
    request<any>("POST", "/api/manage/winners", b, { auth: true }),

  setPayoutStatus: (
    id: string,
    b: { payout_status: string; payout_reference?: string }
  ) =>
    request<any>(
      "POST",
      `/api/manage/winners/${id}/payout`,
      b,
      { auth: true }
    ),

  deleteWinner: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/manage/winners/${id}`,
      undefined,
      { auth: true }
    ),

  // ─── Admin Contest CMS ──────────────────────────────────
  adminGetContest: (id: string, opts?: Opts) =>
    request<any>("GET", `/api/manage/contests/${id}`, undefined, {
      auth: true,
      ...opts,
    }),

  adminCreateContest: (b: Record<string, unknown>) =>
    request<any>("POST", "/api/manage/contests", b, { auth: true }),

  adminUpdateContest: (id: string, b: Record<string, unknown>) =>
    request<any>("PUT", `/api/manage/contests/${id}`, b, {
      auth: true,
    }),

  adminDeleteContest: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/manage/contests/${id}`,
      undefined,
      { auth: true }
    ),

  // ─── Fraud & Audit ──────────────────────────────────────
  fraudSignals: (opts?: Opts) =>
    request<{
      window_hours: number;
      totals: {
        attempts: number;
        successful: number;
        failed: number;
        pending: number;
        stale_pending: number;
        gross_naira: number;
        unique_accounts: number;
        unique_ips: number;
        success_rate: number;
      };
      shared_ips: Array<{
        ip: string;
        accounts: number;
        votes: number;
      }>;
      bursts: Array<{
        email: string;
        attempts: number;
        window_minutes: number;
        quantity: number;
      }>;
      failures: Array<{ email: string; attempts: number }>;
    }>("GET", "/api/fraud/signals", undefined, { auth: true, ...opts }),

  fraudVotes: (
    status?: "pending" | "success" | "failed",
    opts?: Opts
  ) =>
    request<any[]>(
      "GET",
      `/api/fraud/votes${status ? `?status=${status}` : ""}`,
      undefined,
      { auth: true, ...opts }
    ),

  auditLog: (opts?: Opts) =>
    request<any[]>("GET", "/api/fraud/audit", undefined, {
      auth: true,
      ...opts,
    }),

  // ─── Winners (Public) ───────────────────────────────────
  listWinners: () => request<any[]>("GET", "/api/winners"),

  listContestWinners: (slug: string) =>
    request<any[]>(
      "GET",
      `/api/winners/contest/${encodeURIComponent(slug)}`
    ),

  // ─── Streams ────────────────────────────────────────────
  listStreams: (status?: "live" | "scheduled" | "ended") =>
    request<any[]>(
      "GET",
      `/api/streams${status ? `?status=${status}` : ""}`
    ),

  getStream: (id: string) =>
    request<{ stream: any; entries: any[]; stream_votes: number }>(
      "GET",
      `/api/streams/${id}`
    ),

  adminListStreams: (opts?: Opts) =>
    request<any[]>("GET", "/api/streams/manage/all", undefined, {
      auth: true,
      ...opts,
    }),

  createStream: (b: Record<string, unknown>) =>
    request<any>("POST", "/api/streams/manage", b, { auth: true }),

  updateStream: (id: string, b: Record<string, unknown>) =>
    request<any>("PUT", `/api/streams/manage/${id}`, b, {
      auth: true,
    }),

  setStreamStatus: (
    id: string,
    status: "scheduled" | "live" | "ended"
  ) =>
    request<any>(
      "POST",
      `/api/streams/manage/${id}/status`,
      { status },
      { auth: true }
    ),

  deleteStream: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/streams/manage/${id}`,
      undefined,
      { auth: true }
    ),

  // ─── Social ─────────────────────────────────────────────
  mySocialAccounts: (opts?: Opts) =>
    request<any[]>("GET", "/api/social/me", undefined, {
      auth: true,
      ...opts,
    }),

  saveSocialAccount: (b: {
    provider: string;
    handle: string;
    profile_url?: string;
    follower_count?: number;
  }) => request<any>("POST", "/api/social/me", b, { auth: true }),

  deleteSocialAccount: (provider: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/social/me/${provider}`,
      undefined,
      { auth: true }
    ),

  contestantSocials: (slug: string) =>
    request<any[]>(
      "GET",
      `/api/social/contestant/${encodeURIComponent(slug)}`
    ),

  trackShare: (b: {
    platform: string;
    share_url?: string;
    contestant_id?: string;
    contest_id?: string;
    stream_id?: string;
  }) => request<{ ok: true; id: string }>("POST", "/api/social/share", b),

  // ─── Brand Auto-posting ─────────────────────────────────
  brandConnections: (opts?: Opts) =>
    request<
      Array<{
        id: string;
        provider: string;
        handle: string;
        account_id: string | null;
        is_active: boolean;
        has_token: boolean;
        last_synced_at: string | null;
      }>
    >("GET", "/api/social/brand/connections", undefined, {
      auth: true,
      ...opts,
    }),

  saveBrandConnection: (b: {
    provider: string;
    handle: string;
    account_id?: string;
    access_token?: string;
    is_active?: boolean;
  }) =>
    request<any>("POST", "/api/social/brand/connections", b, {
      auth: true,
    }),

  deleteBrandConnection: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/social/brand/connections/${id}`,
      undefined,
      { auth: true }
    ),

  brandPosts: (opts?: Opts) =>
    request<any[]>("GET", "/api/social/brand/posts", undefined, {
      auth: true,
      ...opts,
    }),

  composeBrandPost: (b: {
    provider: string;
    body: string;
    link_url?: string;
    media_url?: string;
    contest_id?: string;
    scheduled_for?: string;
  }) =>
    request<{ ok: true; created: number }>(
      "POST",
      "/api/social/brand/posts",
      b,
      { auth: true }
    ),

  publishBrandPost: (id: string) =>
    request<{ ok: true; results: any[] }>(
      "POST",
      `/api/social/brand/posts/${id}/publish`,
      {},
      { auth: true }
    ),

  deleteBrandPost: (id: string) =>
    request<{ ok: true }>(
      "DELETE",
      `/api/social/brand/posts/${id}`,
      undefined,
      { auth: true }
    ),

  contestantSocialStats: (slug: string) =>
    request<{
      reach: number;
      synced_at: string | null;
      history: Array<{
        provider: string;
        handle: string | null;
        follower_count: number;
        engagement_rate: number;
        captured_on: string;
        source: string;
      }>;
    }>(
      "GET",
      `/api/social/stats/contestant/${encodeURIComponent(slug)}`
    ),
};

// ─── Types ────────────────────────────────────────────────

export type BrandRoiCampaign = {
  id: string;
  name: string;
  is_active: boolean;
  contest: {
    id: string;
    slug: string;
    title: string;
    status: string;
  } | null;
  budget_naira: number;
  prize_pool_naira: number;
  spend_naira: number;
  impressions: number;
  clicks: number;
  ctr: number;
  votes: number;
  orders: number;
  unique_voters: number;
  gross_naira: number;
  net_naira: number;
  fees_naira: number;
  cpm: number;
  cost_per_vote: number;
  roi_percent: number;
};

export type BrandRoi = {
  brand: {
    id: string;
    name: string;
    slug: string;
    contact_email: string | null;
  };
  range: { days: number; since: string };
  campaigns: BrandRoiCampaign[];
  totals: {
    budget_naira: number;
    prize_pool_naira: number;
    spend_naira: number;
    impressions: number;
    logged_impressions: number;
    clicks: number;
    votes: number;
    orders: number;
    gross_naira: number;
    net_naira: number;
    fees_naira: number;
    unique_voters: number;
    followers_converted: number;
    conversion_percent: number;
    ctr: number;
    cpm: number;
    cost_per_vote: number;
    roi_percent: number;
    social_reach: number;
    social_shares: number;
  };
  timeline: Array<{
    date: string;
    votes: number;
    revenue_naira: number;
    impressions: number;
  }>;
  geo: Array<{
    name: string;
    votes: number;
    voters: number;
    revenue_naira: number;
  }>;
  top_contestants: Array<{
    entry_id: string;
    contestant: string;
    slug: string | null;
    contest: string | null;
    votes: number;
    revenue_naira: number;
  }>;
};