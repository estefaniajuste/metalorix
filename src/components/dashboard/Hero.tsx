"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const QUICK_LINKS = [
  { key: "quickPrices", href: "#dashboard", icon: "chart", color: "#D6B35A" },
  { key: "quickNews", href: "/noticias", icon: "news", color: "#34D399" },
  { key: "quickTools", href: "/herramientas", icon: "tools", color: "#8B9DC3" },
  { key: "quickProducts", href: "/productos", icon: "box", color: "#B87333" },
  { key: "quickGuide", href: "/guia-inversion", icon: "guide", color: "#A7B0BE" },
  { key: "quickLearn", href: "/learn", icon: "book", color: "#CED0CE" },
  { key: "quickAlerts", href: "/alertas", icon: "bell", color: "#F59E0B" },
  { key: "quickCalendar", href: "/calendario-economico", icon: "calendar", color: "#6366F1" },
] as const;

function QuickIcon({ icon, color }: { icon: string; color: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const };
  const icons: Record<string, React.ReactNode> = {
    chart: <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    news: <svg {...props}><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" /><line x1="10" y1="6" x2="18" y2="6" /><line x1="10" y1="10" x2="18" y2="10" /></svg>,
    tools: <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    box: <svg {...props}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    guide: <svg {...props}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
    book: <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>,
    bell: <svg {...props}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
    calendar: <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  };
  return <>{icons[icon]}</>;
}

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="pt-8 pb-2 max-sm:pt-6">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-[clamp(20px,3vw,28px)] font-bold text-content-0 tracking-tight mb-1">
          {t("title")}{" "}
          <span className="text-brand-gold">{t("titleAccent")}</span>
        </h1>
        <p className="text-[13px] text-content-2 mb-5 max-w-[520px]">
          {t("subtitle")}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_LINKS.map(({ key, href, icon, color }) => {
            const isAnchor = href.startsWith("#");
            const inner = (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-1 border border-border rounded-full text-[11px] font-medium text-content-2 hover:text-content-0 hover:border-border-hover hover:shadow-sm transition-all cursor-pointer">
                <QuickIcon icon={icon} color={color} />
                {t(key as any)}
              </span>
            );
            if (isAnchor) return <a key={key} href={href}>{inner}</a>;
            return <Link key={key} href={href as any}>{inner}</Link>;
          })}
        </div>
      </div>
    </section>
  );
}
