import { ImageResponse } from "next/og";
import { resolveMetalSlug } from "@/lib/utils/metal-slugs";

export const runtime = "edge";
export const alt = "Metal price";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const METAL_INFO: Record<string, { name: string; symbol: string; color: string }> = {
  oro: { name: "Gold", symbol: "XAU", color: "#D6B35A" },
  plata: { name: "Silver", symbol: "XAG", color: "#A7B0BE" },
  platino: { name: "Platinum", symbol: "XPT", color: "#8B9DC3" },
  paladio: { name: "Palladium", symbol: "XPD", color: "#CED0CE" },
  cobre: { name: "Copper", symbol: "HG", color: "#B87333" },
};

const NAMES_I18N: Record<string, Record<string, string>> = {
  oro: { es: "Oro", en: "Gold", de: "Gold", zh: "黄金", ar: "الذهب", tr: "Altın", hi: "सोना" },
  plata: { es: "Plata", en: "Silver", de: "Silber", zh: "白银", ar: "الفضة", tr: "Gümüş", hi: "चांदी" },
  platino: { es: "Platino", en: "Platinum", de: "Platin", zh: "铂金", ar: "البلاتين", tr: "Platin", hi: "प्लैटिनम" },
  paladio: { es: "Paladio", en: "Palladium", de: "Palladium", zh: "钯金", ar: "البلاديوم", tr: "Paladyum", hi: "पैलेडियम" },
  cobre: { es: "Cobre", en: "Copper", de: "Kupfer", zh: "铜", ar: "النحاس", tr: "Bakır", hi: "तांबा" },
};

const LABELS: Record<string, { priceToday: string; liveData: string }> = {
  es: { priceToday: "Precio hoy", liveData: "Datos en tiempo real" },
  en: { priceToday: "Price today", liveData: "Live data" },
  de: { priceToday: "Preis heute", liveData: "Echtzeitdaten" },
  zh: { priceToday: "今日价格", liveData: "实时数据" },
  ar: { priceToday: "السعر اليوم", liveData: "بيانات مباشرة" },
  tr: { priceToday: "Bugünkü fiyat", liveData: "Canlı veri" },
  hi: { priceToday: "आज का भाव", liveData: "लाइव डेटा" },
};

type PricesApiRow = { symbol?: string; price?: number };

function pricesApiUrl(): string {
  const base = (process.env.NEXT_PUBLIC_URL || "https://metalorix.com").replace(/\/$/, "");
  return `${base}/api/prices`;
}

export default async function OGImage({ params }: { params: { locale: string; metal: string } }) {
  const { locale, metal } = params;
  const internalSlug = resolveMetalSlug(metal) ?? metal;
  const info = METAL_INFO[internalSlug];
  if (!info) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0B0F17",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#D6B35A", fontSize: 60, fontWeight: "bold" }}>Metalorix</div>
      </div>,
      { ...size }
    );
  }

  const metalName = NAMES_I18N[internalSlug]?.[locale] || info.name;
  const label = LABELS[locale] || LABELS.en;

  let priceText = "";
  try {
    const res = await fetch(pricesApiUrl(), { next: { revalidate: 60 } });
    if (res.ok) {
      const data = (await res.json()) as { prices?: PricesApiRow[] };
      const spot = data.prices?.find((p) => p.symbol === info.symbol);
      if (spot != null && typeof spot.price === "number") {
        priceText = `$${spot.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
  } catch {
    /* OG still renders without price */
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0B0F17 0%, #121826 50%, #1a2035 100%)",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#34D399" }} />
        <div style={{ color: "#8891a5", fontSize: "22px" }}>{label.liveData}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        <div style={{ color: "#8891a5", fontSize: "28px", marginBottom: "8px" }}>
          {info.symbol}/USD · {label.priceToday}
        </div>
        <div style={{ color: "#f1f3f7", fontSize: "72px", fontWeight: "800", letterSpacing: "-2px" }}>{metalName}</div>
        {priceText ? (
          <div
            style={{
              color: info.color,
              fontSize: "80px",
              fontWeight: "800",
              marginTop: "8px",
              letterSpacing: "-2px",
            }}
          >
            {priceText}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: info.color, fontSize: "32px", fontWeight: "bold" }}>Metalorix</div>
        <div style={{ color: "#5a6478", fontSize: "20px" }}>metalorix.com</div>
      </div>
    </div>,
    { ...size }
  );
}
