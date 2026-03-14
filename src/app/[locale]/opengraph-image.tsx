import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Metalorix — Precious Metals Prices";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const i18n: Record<string, { heading: string; subtitle: string; metals: string[] }> = {
  es: {
    heading: "Metales Preciosos",
    subtitle: "Precios spot en tiempo real, gráficos profesionales y analítica para Oro, Plata y Platino",
    metals: ["Oro", "Plata", "Platino"],
  },
  en: {
    heading: "Precious Metals",
    subtitle: "Real-time spot prices, professional charts and analytics for Gold, Silver and Platinum",
    metals: ["Gold", "Silver", "Platinum"],
  },
};

export default async function OgImage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "es";
  const t = i18n[locale] || i18n.es;

  const metalPills = [
    { symbol: "XAU", name: t.metals[0], color: "#D6B35A" },
    { symbol: "XAG", name: t.metals[1], color: "#A7B0BE" },
    { symbol: "XPT", name: t.metals[2], color: "#8B9DC3" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0B0F17 0%, #151B2B 50%, #0B0F17 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #D6B35A, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #D6B35A, #B8962E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#0B0F17",
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: 800,
              color: "#EAEDF3",
              letterSpacing: "-1px",
            }}
          >
            Metalorix
          </div>
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#D6B35A",
            marginBottom: "16px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          {t.heading}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#8B95A8",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {t.subtitle}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "44px",
          }}
        >
          {metalPills.map((m) => (
            <div
              key={m.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 24px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: m.color,
                }}
              />
              <span style={{ color: "#EAEDF3", fontSize: "18px", fontWeight: 600 }}>
                {m.name}
              </span>
              <span style={{ color: "#8B95A8", fontSize: "14px" }}>
                {m.symbol}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            color: "#4A5568",
            fontSize: "16px",
          }}
        >
          metalorix.com
        </div>
      </div>
    ),
    { ...size }
  );
}
