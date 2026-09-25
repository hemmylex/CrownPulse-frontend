import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CrownPulse logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-xl object-contain shrink-0"
            />
            <span className="font-display font-black">CrownPulse</span>
            <span className="text-sm text-muted-foreground ml-1">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/contests" className="hover:text-foreground transition">
              Contests
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}