import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      // IndexNow verification: /{key}.txt must serve the key for Bing
      { source: "/:key([a-zA-Z0-9_-]+)\\.txt", destination: "/api/indexnow-verification?key=:key" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/favicon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icon-:size.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/api/prices",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=30, stale-while-revalidate=60" },
        ],
      },
      {
        source: "/api/exchange-rates",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=7200" },
        ],
      },
      {
        // Learn/aprende article pages: static educational content, revalidated every hour.
        // These patterns cover all locale variants (en/learn, es/aprende-inversion, de/lernen-investition, etc.)
        source: "/:locale(en|es|de|zh|ar|tr|hi)/(learn|aprende-inversion|lernen-investition|xuexi|taallam|ogren-yatirim|gyaan-nivesh)/:cluster/:slug",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=7200" },
        ],
      },
      {
        // Learn cluster index pages
        source: "/:locale(en|es|de|zh|ar|tr|hi)/(learn|aprende-inversion|lernen-investition|xuexi|taallam|ogren-yatirim|gyaan-nivesh)/:cluster",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=7200" },
        ],
      },
      {
        // Interactive tools: ratio, ROI calculator, comparator, currency converter, jewelry,
        // fear-greed, economic calendar, investment guide, outlook, tools hub.
        // s-maxage=3600 — HTML shell is stable; live data is fetched client-side.
        source: "/:locale(en|es|de|zh|ar|tr|hi)/(gold-silver-ratio|ratio-oro-plata|gold-silber-verhaeltnis|jin-yin-bi|nisbat-althahab-alfiddah|altin-gumus-orani|sona-chandi-anupat|roi-calculator|calculadora-rentabilidad|renditerechner|shouyi-jisuan|hasibat-alarabah|getiri-hesaplayici|laabh-ganak|comparator|comparador|vergleich|bijiao|muqarin|karsilastirma|tulana|currency-converter|conversor-divisas|waehrungsrechner|huobi-zhuanhua|muhawwil-alumlat|doviz-cevirici|mudra-badlav|tools|herramientas|werkzeuge|gongju|adawat|araclar|upakar|jewelry-value-calculator|valor-joyas|schmuck-wert-rechner|fear-greed-metals|miedo-codicia-metales|angst-gier-metalle|economic-calendar|calendario-economico|wirtschaftskalender|investment-guide|guia-inversion|outlook|predicciones|prognose)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=7200" },
        ],
      },
      {
        // Live price pages: update frequently, short cache to stay fresh.
        source: "/:locale(en|es|de|zh|ar|tr|hi)/(gold-price-today|precio-oro-hoy|goldpreis-heute|jin-ri-jin-jia|sier-althahab-alyawm|altin-fiyati-bugun|sona-bhav-aaj|gold-price-per-gram|precio-gramo-oro|goldpreis-pro-gramm|mei-ke-jin-jia|sier-ghram-althahab|gram-altin-fiyati|sona-gram-mulya|price/:path*|precio/:path*|preis/:path*|jiage/:path*|sier/:path*|fiyat/:path*|mulya/:path*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=120" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
