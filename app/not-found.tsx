import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 grid place-items-center px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="max-w-md">
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tight">
            404
          </h1>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            This page isn&apos;t on the runway yet.
          </p>

          <Link
            href="/"
            className="mt-6 sm:mt-8 inline-flex items-center justify-center bg-gradient-hero text-primary-foreground font-semibold px-6 sm:px-8 py-3 rounded-full shadow-glow hover:opacity-90 transition-opacity"
          >
            Back home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}