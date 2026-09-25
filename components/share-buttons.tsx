"use client";

import { useState } from "react";
import {
  Facebook,
  Instagram,
  Link2,
  MessageCircle,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Target = {
  contestant_id?: string;
  contest_id?: string;
  stream_id?: string;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
    </svg>
  );
}

export function ShareButtons({
  url,
  title,
  target = {},
}: {
  url: string;
  title: string;
  target?: Target;
}) {
  const [copied, setCopied] = useState(false);

  function track(platform: string) {
    api.trackShare({ platform, share_url: url, ...target }).catch(() => {});
  }

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const links = [
    {
      key: "twitter",
      label: "Post on X",
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      Icon: MessageCircle,
      href: `https://wa.me/?text=${text}%20${encoded}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
  ];

  const buttonClass =
    "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-secondary text-xs sm:text-sm font-semibold hover:bg-muted transition";

  async function copy(message: string) {
    await navigator.clipboard.writeText(`${title} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(message);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map(({ key, label, Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(key)}
          className={buttonClass}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline sm:inline">{label}</span>
        </a>
      ))}

      {/* Instagram has no web share intent — copy caption + open app */}
      <button
        type="button"
        onClick={async () => {
          try {
            await copy("Caption copied — paste it into your story");
            track("instagram");
            window.open(
              "https://www.instagram.com/",
              "_blank",
              "noopener,noreferrer"
            );
          } catch {
            toast.error("Could not copy the caption");
          }
        }}
        className={buttonClass}
      >
        <Instagram className="w-4 h-4 shrink-0" />
        <span className="hidden xs:inline sm:inline">IG story</span>
      </button>

      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.share({ title, text: title, url });
              track("native");
            } catch {
              // user dismissed
            }
          }}
          className={buttonClass}
        >
          <Share2 className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline sm:inline">Share</span>
        </button>
      )}

      <button
        type="button"
        onClick={async () => {
          try {
            await copy("Link copied");
            track("copy");
          } catch {
            toast.error("Could not copy link");
          }
        }}
        className={buttonClass}
      >
        <Link2 className="w-4 h-4 shrink-0" />
        <span>{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}