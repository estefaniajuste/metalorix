import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Precio del metal en tiempo real — Metalorix";

const METAL_DATA: Record<string, { name: string; symbol: string; color: string; emoji: string }> = {
  oro: { name: "Oro", symbol: "XAU", color: "#D6B35A", emoji: "🥇" },
  plata: { name: "Plata", symbol: "XAG", color: "#A7B0BE", emoji: "🥈" },
  platino: { name: "Platino", symbol: "XPT", color: "#8B9DC3", emoji: "💎" },
};

export function generateImageMetadata({ params }: { params: { metal: string } }) {
  const data = METAL_DATA[params.metal];
  return [
    {
      id: "og",
      alt: data ? `Precio del ${data.name} (${data.symbol}) hoy — Metalorix` : alt,
      size,
      contentType,
    },
  ];
}

export default function OgImage({ params }: { params: { metal: string } }) {
  const data = METAL_DATA[params.metal] ?? METAL_DATA.oro;

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
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
          }}
        />

        {/* Metal circle */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${data.color}33, ${data.color}11)`,
            border: `2px solid ${data.color}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: data.color,
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#EAEDF3",
            marginBottom: "8px",
            letterSpacing: "-1px",
          }}
        >
          Precio del {data.name}
        </div>

        {/* Symbol */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: data.color,
            marginBottom: "24px",
            letterSpacing: "4px",
          }}
        >
          {data.symbol}/USD
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "20px",
            color: "#8B95A8",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Cotización en tiempo real, gráfico interactivo y análisis
        </div>

        {/* Branding */}
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
          <span style={{ color: "#4A5568", fontSize: "16px" }}>
            metalorix.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
