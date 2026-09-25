"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Gift, Sparkles, Lock } from "lucide-react";
import { api } from "@/lib/api";

type Item = {
  id: string;
  title: string;
  description: string | null;
  brand_name: string | null;
  image_url: string | null;
  cost_points: number;
  stock: number | null;
};

export function RewardsCatalog({
  items,
  points,
  signedIn,
}: {
  items: Item[];
  points: number;
  signedIn: boolean;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [balance, setBalance] = useState(points);
  const router = useRouter();

  async function claim(item: Item) {
    setPendingId(item.id);
    try {
      const res = await api.claimReward({ catalog_id: item.id });
      setBalance(res.points_left);
      toast.success(`Claimed! Your code: ${res.reward.code}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not claim reward"
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      {/* Balance banner */}
      <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl bg-gradient-soft border border-border p-4 sm:p-6 flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-hero grid place-items-center shadow-glow shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        </span>
        <div className="flex-1 min-w-[160px]">
          <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-bold">
            Your balance
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl">
            {signedIn ? balance.toLocaleString() : "—"} points
          </div>
        </div>
        {!signedIn && (
          <Link
            href="/auth/login"
            className="rounded-full bg-gradient-hero text-primary-foreground font-semibold px-4 sm:px-5 py-2.5 sm:py-3 text-sm shadow-glow hover:opacity-95 transition"
          >
            Sign in to claim
          </Link>
        )}
      </div>

      {/* Catalog */}
      {items.length === 0 ? (
        <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-card border border-border p-8 sm:p-10 text-center text-muted-foreground text-sm sm:text-base">
          The catalog is being restocked. Check back soon.
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item) => {
            const affordable = signedIn && balance >= item.cost_points;
            const soldOut = item.stock !== null && item.stock <= 0;

            return (
              <article
                key={item.id}
                className="rounded-2xl sm:rounded-3xl bg-card border border-border overflow-hidden flex flex-col"
              >
                <div className="aspect-[5/3] bg-secondary">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-hero opacity-80">
                      <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {item.brand_name && (
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-muted-foreground">
                      {item.brand_name}
                    </span>
                  )}
                  <h2 className="font-display font-bold text-base sm:text-lg leading-tight mt-1">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 sm:mt-4 flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">
                      {item.cost_points.toLocaleString()} pts
                    </span>
                    {item.stock !== null && (
                      <span className="text-xs text-muted-foreground">
                        {item.stock} left
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!affordable || soldOut || pendingId === item.id}
                    onClick={() => claim(item)}
                    className="mt-3 sm:mt-4 w-full rounded-full bg-gradient-hero text-primary-foreground font-semibold py-2.5 text-sm shadow-glow disabled:opacity-50 disabled:shadow-none transition-opacity"
                  >
                    {soldOut
                      ? "Sold out"
                      : pendingId === item.id
                        ? "Claiming…"
                        : affordable
                          ? "Claim reward"
                          : signedIn
                            ? `Need ${(item.cost_points - balance).toLocaleString()} more`
                            : "Sign in to claim"}
                  </button>

                  {!signedIn && (
                    <p className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1 justify-center">
                      <Lock className="w-3 h-3" /> Points are earned by voting
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}