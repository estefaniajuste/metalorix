import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trading tools for precious metals — Metalorix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const i18n: Record<string, { title: string; subtitle: string; tools: string[] }> = {
  es: {
    title: "Herramientas",
    subtitle: "Analiza y compara metales preciosos",
    tools: ["Comparación", "Ratio Au/Ag", "Conversor", "DCA", "Unidades"],
  },
  en: {
    title: "Tools",
    subtitle: "Analyze and compare precious metals",
    tools: ["Comparison", "Ratio Au/Ag", "Converter", "DCA", "Units"],
  },
};

const toolIcons = ["📊", "⚖️", "💱", "📈", "🔄"];

export default async function OgImage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "es";
  const t = i18n[locale] || i18n.es;

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
            fontSize: "48px",
            fontWeight: 800,
            color: "#EAEDF3",
            marginBottom: "12px",
            letterSpacing: "-1px",
          }}
        >
          {t.title}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#8B95A8",
            marginBottom: "48px",
          }}
        >
          {t.subtitle}
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {t.tools.map((name, i) => (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "20px 28px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{toolIcons[i]}</span>
              <span style={{ color: "#EAEDF3", fontSize: "14px", fontWeight: 600 }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #D6B35A, #B8962E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 800,
              color: "#0B0F17",
            }}
          >
            M
          </div>
          <span style={{ color: "#4A5568", fontSize: "16px" }}>metalorix.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
