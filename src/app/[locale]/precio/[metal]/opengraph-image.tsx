import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Metal price";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SLUG_TO_INTERNAL: Record<string, string> = {
  oro: "oro", gold: "oro", huangjin: "oro", dhahab: "oro", altin: "oro", sona: "oro", thahab: "oro",
  plata: "plata", silver: "plata", silber: "plata", baiyin: "plata", fiddah: "plata", gumus: "plata", chandi: "plata",
  platino: "platino", platinum: "platino", platin: "platino", bojin: "platino", blatiin: "platino", platinam: "platino",
  paladio: "paladio", palladium: "paladio", bajin: "paladio", baladiyum: "paladio", paladyum: "paladio",
  cobre: "cobre", copper: "cobre", kupfer: "cobre", tong: "cobre", nuhas: "cobre", bakir: "cobre", tamba: "cobre",
};

const METAL_INFO: Record<string, { name: string; symbol: string; color: string }> = {
  oro: { name: "Gold", symbol: "XAU", color: "#D6B35A" },
  plata: { name: "Silver", symbol: "XAG", color: "#A7B0BE" },
  platino: { name: "Platinum", symbol: "XPT", color: "#8B9DC3" },
  paladio: { name: "Palladium", symbol: "XPD", color: "#CED0CE" },
  cobre: { name: "Copper", symbol: "HG", color: "#B87333" },
};

const NAMES_I18N: Record<string, Record<string, string>> = {
  oro: { es: "Oro", en: "Gold", de: "Gold", zh: "Gold", ar: "Gold", tr: "Altin", hi: "Gold" },
  plata: { es: "Plata", en: "Silver", de: "Silber", zh: "Silver", ar: "Silver", tr: "Gumus", hi: "Silver" },
  platino: { es: "Platino", en: "Platinum", de: "Platin", zh: "Platinum", ar: "Platinum", tr: "Platin", hi: "Platinum" },
  paladio: { es: "Paladio", en: "Palladium", de: "Palladium", zh: "Palladium", ar: "Palladium", tr: "Paladyum", hi: "Palladium" },
  cobre: { es: "Cobre", en: "Copper", de: "Kupfer", zh: "Copper", ar: "Copper", tr: "Bakir", hi: "Copper" },
};

const LABELS: Record<string, { priceToday: string; liveData: string }> = {
  es: { priceToday: "Precio hoy", liveData: "Datos en tiempo real" },
  en: { priceToday: "Price today", liveData: "Live data" },
  de: { priceToday: "Preis heute", liveData: "Echtzeitdaten" },
  zh: { priceToday: "Price today", liveData: "Live data" },
  ar: { priceToday: "Price today", liveData: "Live data" },
  tr: { priceToday: "Bugunku fiyat", liveData: "Canli veri" },
  hi: { priceToday: "Price today", liveData: "Live data" },
};

export default async function OGImage({ params }: { params: { locale: string; metal: string } }) {
  const { locale, metal } = params;
  const internalSlug = SLUG_TO_INTERNAL[metal] ?? metal;
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
          {info.symbol}/USD
        </div>
        <div style={{ color: "#f1f3f7", fontSize: "72px", fontWeight: "800", letterSpacing: "-2px" }}>{metalName}</div>
        <div style={{ color: "#8891a5", fontSize: "32px", marginTop: "12px" }}>{label.priceToday}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: info.color, fontSize: "32px", fontWeight: "bold" }}>Metalorix</div>
        <div style={{ color: "#5a6478", fontSize: "20px" }}>metalorix.com</div>
      </div>
    </div>,
    { ...size }
  );
}
