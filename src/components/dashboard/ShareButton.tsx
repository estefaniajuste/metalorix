"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [title, text, url]);

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-content-3 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-sm border border-border hover:border-brand-gold"
      aria-label={t("share")}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t("copied")}
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {t("share")}
        </>
      )}
    </button>
  );
}
