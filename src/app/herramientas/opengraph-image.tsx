import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Herramientas de trading para metales preciosos — Metalorix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tools = [
  { name: "Comparación", icon: "📊" },
  { name: "Ratio Au/Ag", icon: "⚖️" },
  { name: "Conversor", icon: "💱" },
  { name: "DCA", icon: "📈" },
  { name: "Unidades", icon: "🔄" },
];

export default function OgImage() {
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
          Herramientas
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#8B95A8",
            marginBottom: "48px",
          }}
        >
          Analiza y compara metales preciosos
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {tools.map((t) => (
            <div
              key={t.name}
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
              <span style={{ fontSize: "28px" }}>{t.icon}</span>
              <span style={{ color: "#EAEDF3", fontSize: "14px", fontWeight: 600 }}>
                {t.name}
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
