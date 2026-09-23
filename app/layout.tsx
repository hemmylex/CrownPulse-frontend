import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "CrownPulse — Vote. Crown. Celebrate.",
    template: "%s · CrownPulse",
  },
  description:
    "Nigeria's vibrant contest platform. Cast Paystack votes, earn rewards, and crown the next star across pageants, talent shows and brand campaigns.",
  openGraph: {
    type: "website",
    siteName: "CrownPulse",
    title: "CrownPulse — Vote. Crown. Celebrate.",
    description: "Cast Paystack votes, earn rewards, and crown the next star.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}