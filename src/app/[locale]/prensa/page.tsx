import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAlternates } from "@/lib/seo/alternates";
import { CopySnippet } from "./CopySnippet";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "press" });
  const rawDesc = t("metaDescription");
  const metaDescription = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  return {
    title: `${t("title")} — Metalorix`,
    description: metaDescription,
    robots: { index: true, follow: true },
    alternates: getAlternates(locale, "/prensa"),
  };
}

const BADGE_SNIPPET_LIGHT = `<a href="https://metalorix.com" target="_blank" rel="noopener" title="Metalorix — Precious Metals Prices">
  <img src="https://metalorix.com/icon-192.png" alt="Metalorix" width="48" height="48" style="border-radius:8px" />
</a>`;

const BADGE_SNIPPET_TEXT = `<a href="https://metalorix.com" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:8px;background:#121826;color:#D6B35A;font-family:system-ui;font-weight:600;font-size:14px;text-decoration:none">
  <img src="https://metalorix.com/icon-192.png" alt="" width="24" height="24" style="border-radius:4px" />
  Metalorix — Precious Metals Prices
</a>`;

const CITATION_SNIPPET = `Source: <a href="https://metalorix.com" target="_blank" rel="noopener">Metalorix</a>`;

export default async function PressPage() {
  const t = await getTranslations("press");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav
          className="text-sm text-content-3 mb-6"
          aria-label={tc("breadcrumbNav")}
        >
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("title")}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-content-2 leading-relaxed mb-12">
          {t("subtitle")}
        </p>

        {/* About */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("aboutHeading")}
          </h2>
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 space-y-3 text-sm text-content-1 leading-relaxed">
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mt-4 text-xs">
              <dt className="font-semibold text-content-0">{t("founded")}</dt>
              <dd>2025</dd>
              <dt className="font-semibold text-content-0">{t("coverage")}</dt>
              <dd>{t("coverageValue")}</dd>
              <dt className="font-semibold text-content-0">{t("languages")}</dt>
              <dd>English, Español, Deutsch, 中文, العربية, Türkçe, हिन्दी</dd>
              <dt className="font-semibold text-content-0">URL</dt>
              <dd>
                <a
                  href="https://metalorix.com"
                  className="text-brand-gold hover:underline"
                >
                  metalorix.com
                </a>
              </dd>
              <dt className="font-semibold text-content-0">{t("contact")}</dt>
              <dd>
                <a
                  href="mailto:hola@metalorix.com"
                  className="text-brand-gold hover:underline"
                >
                  hola@metalorix.com
                </a>
              </dd>
            </dl>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("logoHeading")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col items-center gap-3">
              <div className="bg-[#0b0f17] rounded-DEFAULT p-6 w-full flex justify-center">
                <img
                  src="/icon-512.png"
                  alt="Metalorix logo"
                  width={96}
                  height={96}
                  className="rounded-lg"
                />
              </div>
              <span className="text-xs text-content-3">{t("logoDark")}</span>
              <a
                href="/icon-512.png"
                download="metalorix-logo-512.png"
                className="text-xs font-medium text-brand-gold hover:underline"
              >
                PNG 512×512 ↓
              </a>
            </div>
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col items-center gap-3">
              <div className="bg-white rounded-DEFAULT p-6 w-full flex justify-center">
                <img
                  src="/logo-full.png"
                  alt="Metalorix full logo"
                  width={200}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
              <span className="text-xs text-content-3">{t("logoFull")}</span>
              <a
                href="/logo-full.png"
                download="metalorix-logo-full.png"
                className="text-xs font-medium text-brand-gold hover:underline"
              >
                PNG ↓
              </a>
            </div>
          </div>
        </div>

        {/* Link to us */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-content-0 mb-2">
            {t("linkHeading")}
          </h2>
          <p className="text-sm text-content-2 mb-6">{t("linkDescription")}</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-content-0 mb-2">
                {t("badgeIcon")}
              </h3>
              <div className="mb-3 bg-surface-2 rounded-DEFAULT p-4 flex justify-center">
                <a
                  href="https://metalorix.com"
                  target="_blank"
                  rel="noopener"
                  title="Metalorix"
                >
                  <img
                    src="/icon-192.png"
                    alt="Metalorix"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </a>
              </div>
              <CopySnippet code={BADGE_SNIPPET_LIGHT} label={t("copyHtml")} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-content-0 mb-2">
                {t("badgeBanner")}
              </h3>
              <div className="mb-3 bg-surface-2 rounded-DEFAULT p-4 flex justify-center">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "#121826",
                    color: "#D6B35A",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="/icon-192.png"
                    alt=""
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  Metalorix — Precious Metals Prices
                </span>
              </div>
              <CopySnippet code={BADGE_SNIPPET_TEXT} label={t("copyHtml")} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-content-0 mb-2">
                {t("citationSnippet")}
              </h3>
              <p className="text-xs text-content-3 mb-2">
                {t("citationDescription")}
              </p>
              <CopySnippet code={CITATION_SNIPPET} label={t("copyHtml")} />
            </div>
          </div>
        </div>

        {/* Data usage */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("dataHeading")}
          </h2>
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 text-sm text-content-1 leading-relaxed space-y-3">
            <p>{t("dataP1")}</p>
            <p>{t("dataP2")}</p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/noticias"
                className="text-xs font-medium text-brand-gold hover:underline"
              >
                {t("newsLink")}
              </Link>
              <span className="text-content-3">·</span>
              <a
                href="/api/feed"
                target="_blank"
                rel="noopener"
                className="text-xs font-medium text-brand-gold hover:underline"
              >
                RSS Feed ↗
              </a>
            </div>
          </div>
        </div>

        {/* Dealers */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("dealerHeading")}
          </h2>
          <div className="bg-surface-1 border border-brand-gold/20 rounded-DEFAULT p-6 text-sm text-content-1 leading-relaxed space-y-3">
            <p>{t("dealerP1")}</p>
            <p>{t("dealerP2")}</p>
            <a
              href="mailto:hola@metalorix.com?subject=Dealer%20listing%20on%20Metalorix"
              className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-[#0B0F17] bg-brand-gold hover:brightness-110 transition-all px-5 py-2.5 rounded-sm"
            >
              {t("dealerCta")}
            </a>
          </div>
        </div>

        <footer className="pt-8 border-t border-border text-center">
          <p className="text-xs text-content-3">{t("footer")}</p>
        </footer>
      </div>
    </section>
  );
}
