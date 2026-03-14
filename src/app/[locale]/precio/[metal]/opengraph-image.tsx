import { ImageResponse } from "next/og";
import { resolveMetalSlug } from "@/lib/utils/metal-slugs";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Metal price in real time — Metalorix";

const METAL_I18N: Record<string, Record<string, { name: string; title: string; subtitle: string }>> = {
  oro: {
    es: { name: "Oro", title: "Precio del Oro", subtitle: "Cotización en tiempo real, gráfico interactivo y análisis" },
    en: { name: "Gold", title: "Gold Price", subtitle: "Real-time quote, interactive chart and analysis" },
  },
  plata: {
    es: { name: "Plata", title: "Precio de la Plata", subtitle: "Cotización en tiempo real, gráfico interactivo y análisis" },
    en: { name: "Silver", title: "Silver Price", subtitle: "Real-time quote, interactive chart and analysis" },
  },
  platino: {
    es: { name: "Platino", title: "Precio del Platino", subtitle: "Cotización en tiempo real, gráfico interactivo y análisis" },
    en: { name: "Platinum", title: "Platinum Price", subtitle: "Real-time quote, interactive chart and analysis" },
  },
  paladio: {
    es: { name: "Paladio", title: "Precio del Paladio", subtitle: "Cotización en tiempo real, gráfico interactivo y análisis" },
    en: { name: "Palladium", title: "Palladium Price", subtitle: "Real-time quote, interactive chart and analysis" },
  },
  cobre: {
    es: { name: "Cobre", title: "Precio del Cobre", subtitle: "Cotización en tiempo real, gráfico interactivo y análisis" },
    en: { name: "Copper", title: "Copper Price", subtitle: "Real-time quote, interactive chart and analysis" },
  },
};

const METAL_DATA: Record<string, { symbol: string; color: string }> = {
  oro: { symbol: "XAU", color: "#D6B35A" },
  plata: { symbol: "XAG", color: "#A7B0BE" },
  platino: { symbol: "XPT", color: "#8B9DC3" },
  paladio: { symbol: "XPD", color: "#CED0CE" },
  cobre: { symbol: "HG", color: "#B87333" },
};

export function generateImageMetadata({ params }: { params: { locale: string; metal: string } }) {
  const internalSlug = resolveMetalSlug(params.metal) ?? params.metal;
  const data = METAL_DATA[internalSlug];
  const texts = METAL_I18N[internalSlug]?.en;
  return [
    {
      id: "og",
      alt: data && texts ? `${texts.title} (${data.symbol}) — Metalorix` : alt,
      size,
      contentType,
    },
  ];
}

export default async function OgImage({ params }: { params: { locale: string; metal: string } }) {
  const locale = params.locale || "es";
  const internalSlug = resolveMetalSlug(params.metal) ?? params.metal;
  const data = METAL_DATA[internalSlug] ?? METAL_DATA.oro;
  const texts = METAL_I18N[internalSlug]?.[locale] || METAL_I18N[internalSlug]?.es || METAL_I18N.oro.es;

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
            background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
          }}
        />

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

        <div
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#EAEDF3",
            marginBottom: "8px",
            letterSpacing: "-1px",
          }}
        >
          {texts.title}
        </div>

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

        <div
          style={{
            fontSize: "20px",
            color: "#8B95A8",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {texts.subtitle}
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
          <span style={{ color: "#4A5568", fontSize: "16px" }}>
            metalorix.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
