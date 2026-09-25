import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { api } from "@/lib/api";
import { StreamRoom } from "./stream-room";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function load(id: string) {
  try {
    return await api.getStream(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await load(id);
  if (!data) return { title: "Stream not found" };

  const s = data.stream;
  const title = `${s.title} — Live on CrownPulse`;
  const description =
    s.description?.slice(0, 155) ??
    `Watch ${s.title} live and vote for your favourite contestant with Paystack.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.other",
      ...(s.thumbnail_url ? { images: [{ url: s.thumbnail_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(s.thumbnail_url ? { images: [s.thumbnail_url] } : {}),
    },
  };
}

export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await load(id);
  if (!data) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <Link
          href="/live"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← All live shows
        </Link>

        <h1 className="mt-2 mb-6 sm:mb-8 font-display font-black text-2xl sm:text-3xl md:text-4xl">
          {data.stream.title}
        </h1>

        <StreamRoom
          stream={data.stream}
          entries={data.entries}
          streamVotes={data.stream_votes}
          shareUrl={`${SITE}/live/${id}`}
        />
      </main>

      <SiteFooter />
    </div>
  );
}