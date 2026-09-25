"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Trash2, Plus, Check } from "lucide-react";
import { api } from "@/lib/api";

const STEPS = ["Basics", "Story", "Media", "Achievements", "Socials"] as const;
type Profile = any;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function PortfolioEditor({
  initial,
  defaultName,
}: {
  initial: Profile | null;
  defaultName: string;
}) {
  const [step, setStep] = useState<number>(initial?.onboarding_step ?? 0);
  const [form, setForm] = useState({
    display_name: initial?.display_name ?? defaultName ?? "",
    slug: initial?.slug ?? slugify(defaultName ?? ""),
    headline: initial?.headline ?? "",
    bio: initial?.bio ?? "",
    photo_url: initial?.photo_url ?? "",
    cover_url: initial?.cover_url ?? "",
    video_url: initial?.video_url ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    country: initial?.country ?? "Nigeria",
    instagram: initial?.instagram ?? "",
    twitter: initial?.twitter ?? "",
    tiktok: initial?.tiktok ?? "",
  });
  const [media, setMedia] = useState<any[]>(initial?.media ?? []);
  const [achievements, setAchievements] = useState<any[]>(
    initial?.achievements ?? []
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const created = useRef(!!initial);
  const firstRun = useRef(true);

  const canSave =
    form.display_name.trim().length >= 2 && /^[a-z0-9-]+$/.test(form.slug);

  const payload = useMemo(
    () => ({
      ...form,
      onboarding_step: step,
      onboarding_complete: step >= STEPS.length - 1,
    }),
    [form, step]
  );

  // Autosave (debounced) once the required fields are valid
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!canSave) return;

    const t = setTimeout(async () => {
      setStatus("saving");
      try {
        await api.saveContestant(payload);
        created.current = true;
        setStatus("saved");
        setErr(null);
      } catch (e: any) {
        setStatus("error");
        setErr(e?.message ?? "Autosave failed");
      }
    }, 900);

    return () => clearTimeout(t);
  }, [payload, canSave]);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-5 sm:gap-8">
      {/* Step nav */}
      <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={`text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition ${
              step === i
                ? "bg-gradient-hero text-primary-foreground shadow-glow"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            <span className="opacity-70 mr-2">{i + 1}</span>
            {s}
          </button>
        ))}
      </nav>

      {/* Step content */}
      <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
          <h2 className="font-display font-bold text-xl sm:text-2xl">
            {STEPS[step]}
          </h2>
          <span className="text-xs font-semibold text-muted-foreground shrink-0">
            {status === "saving" ? (
              "Saving…"
            ) : status === "saved" ? (
              <span className="text-primary inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            ) : status === "error" ? (
              <span className="text-destructive">{err}</span>
            ) : (
              "Autosave on"
            )}
          </span>
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <Field
              label="Display name"
              value={form.display_name}
              onChange={(v) => {
                set("display_name", v);
                if (!created.current) set("slug", slugify(v));
              }}
            />
            <Field
              label="Profile URL (slug)"
              value={form.slug}
              onChange={(v) => set("slug", slugify(v))}
              hint={`crownpulse.app/c/${form.slug || "your-name"}`}
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field
                label="City"
                value={form.city}
                onChange={(v) => set("city", v)}
              />
              <Field
                label="State"
                value={form.state}
                onChange={(v) => set("state", v)}
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => set("country", v)}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field
              label="Headline"
              value={form.headline}
              onChange={(v) => set("headline", v)}
              hint='One punchy line, e.g. "Lagos-born dancer chasing the crown".'
            />
            <label className="block">
              <span className="text-sm font-semibold">Bio</span>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={8}
                className="mt-1.5 w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Profile photo URL"
                value={form.photo_url}
                onChange={(v) => set("photo_url", v)}
              />
              <Field
                label="Cover photo URL"
                value={form.cover_url}
                onChange={(v) => set("cover_url", v)}
              />
            </div>
            <Field
              label="Video reel URL"
              value={form.video_url}
              onChange={(v) => set("video_url", v)}
              hint="YouTube, Vimeo or TikTok link."
            />
            <GalleryEditor
              media={media}
              setMedia={setMedia}
              disabled={!created.current}
              pending={pending}
              start={start}
            />
          </div>
        )}

        {step === 3 && (
          <AchievementsEditor
            items={achievements}
            setItems={setAchievements}
            disabled={!created.current}
            pending={pending}
            start={start}
          />
        )}

        {step === 4 && (
          <div className="grid sm:grid-cols-3 gap-4">
            <Field
              label="Instagram"
              value={form.instagram}
              onChange={(v) => set("instagram", v)}
              hint="@handle"
            />
            <Field
              label="X (Twitter)"
              value={form.twitter}
              onChange={(v) => set("twitter", v)}
              hint="@handle"
            />
            <Field
              label="TikTok"
              value={form.tiktok}
              onChange={(v) => set("tiktok", v)}
              hint="@handle"
            />
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-secondary font-semibold text-sm disabled:opacity-40 hover:bg-muted transition"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-95 transition"
            >
              Continue
            </button>
          ) : (
            <a
              href={`/c/${form.slug}`}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-hero text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-95 transition"
            >
              View public profile
            </a>
          )}
        </div>

        {!canSave && (
          <p className="mt-4 text-sm text-destructive">
            Add a display name and a valid profile URL to enable autosave.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-full bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
      />
      {hint && (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}

function GalleryEditor({
  media,
  setMedia,
  disabled,
  pending,
  start,
}: any) {
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");

  return (
    <div>
      <h3 className="font-display font-bold text-lg">Gallery</h3>
      {disabled && (
        <p className="text-sm text-muted-foreground mt-1">
          Save your basics first to unlock the gallery.
        </p>
      )}
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://image-or-video-url"
          className="flex-1 rounded-full bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="sm:w-40 rounded-full bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as any)}
          className="rounded-full bg-background border border-border px-4 py-3 text-sm"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button
          type="button"
          disabled={disabled || pending || !url}
          onClick={() =>
            start(async () => {
              try {
                const m = await api.addMedia({
                  url,
                  kind,
                  caption: caption || undefined,
                  sort_order: media.length,
                });
                setMedia((list: any[]) => [...list, m]);
                setUrl("");
                setCaption("");
              } catch {
                // ignore
              }
            })
          }
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gradient-hero text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {media.map((m: any) => (
          <div
            key={m.id}
            className="relative rounded-2xl overflow-hidden bg-secondary aspect-square group"
          >
            {m.kind === "video" ? (
              <div className="w-full h-full grid place-items-center bg-gradient-hero text-primary-foreground text-xs font-bold">
                VIDEO
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.url}
                alt={m.caption ?? ""}
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  try {
                    await api.deleteMedia(m.id);
                    setMedia((l: any[]) =>
                      l.filter((x) => x.id !== m.id)
                    );
                  } catch {
                    // ignore
                  }
                })
              }
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition"
              aria-label="Remove media"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsEditor({
  items,
  setItems,
  disabled,
  pending,
  start,
}: any) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>
      {disabled && (
        <p className="text-sm text-muted-foreground mb-3">
          Save your basics first to unlock achievements.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Achievement title"
          className="flex-1 rounded-full bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          inputMode="numeric"
          className="sm:w-28 rounded-full bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
        />
        <button
          type="button"
          disabled={disabled || pending || title.trim().length < 2}
          onClick={() =>
            start(async () => {
              try {
                const a = await api.addAchievement({
                  title,
                  description: description || undefined,
                  year: year ? Number(year) : undefined,
                });
                setItems((l: any[]) => [a, ...l]);
                setTitle("");
                setYear("");
                setDescription("");
              } catch {
                // ignore
              }
            })
          }
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-gradient-hero text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Short description (optional)"
        className="mt-3 w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
      />
      <ul className="mt-5 space-y-3">
        {items.map((a: any) => (
          <li
            key={a.id}
            className="flex items-start justify-between gap-4 rounded-2xl bg-secondary/60 px-4 py-3"
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{a.title}</span>
                {a.year && (
                  <span className="text-xs font-bold text-coral">
                    {a.year}
                  </span>
                )}
              </div>
              {a.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  try {
                    await api.deleteAchievement(a.id);
                    setItems((l: any[]) =>
                      l.filter((x) => x.id !== a.id)
                    );
                  } catch {
                    // ignore
                  }
                })
              }
              aria-label="Remove achievement"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}