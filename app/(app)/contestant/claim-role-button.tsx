"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api, type Role } from "@/lib/api";

export function ClaimRoleButton({
  role,
}: {
  role: Extract<Role, "contestant" | "brand">;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() =>
          start(async () => {
            setErr(null);
            try {
              await api.claimRole({ role });
              router.refresh();
            } catch (e: any) {
              setErr(e?.message ?? "Failed to claim role");
            }
          })
        }
        disabled={pending}
        className="self-start px-5 py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold shadow-glow disabled:opacity-60 hover:opacity-95 transition text-sm sm:text-base"
      >
        {pending ? "Claiming…" : `Claim ${role} role`}
      </button>
      {err && <p className="text-sm text-destructive">{err}</p>}
    </div>
  );
}