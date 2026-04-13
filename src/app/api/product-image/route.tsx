import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const METAL_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  gold: { color: "#D6B35A", bg: "rgba(214,179,90,0.10)", label: "GOLD" },
  silver: { color: "#A7B0BE", bg: "rgba(167,176,190,0.10)", label: "SILVER" },
};

const TYPE_ICON: Record<string, string> = {
  coin: "\u25CF",
  bar: "\u25A0",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("name") || "Product";
  const metal = searchParams.get("metal") || "gold";
  const type = searchParams.get("type") || "coin";
  const weight = searchParams.get("weight") || "";
  const purity = searchParams.get("purity") || "";
  const mint = searchParams.get("mint") || "";

  const style = METAL_STYLES[metal] || METAL_STYLES.gold;
  const icon = TYPE_ICON[type] || TYPE_ICON.coin;

  const truncatedName = name.length > 60 ? name.slice(0, 57) + "…" : name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B0F17 0%, #151B2B 50%, #0B0F17 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, transparent, ${style.color}, transparent)`,
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #D6B35A, #B8962E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 800,
              color: "#0B0F17",
            }}
          >
            M
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#EAEDF3", letterSpacing: "-0.5px" }}>
            Metalorix
          </div>
        </div>

        {/* Metal badge + type */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: style.color,
              background: style.bg,
              padding: "6px 16px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            {style.label}
          </div>
          <div style={{ fontSize: "22px", color: style.color }}>{icon}</div>
        </div>

        {/* Product name */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "#F1F3F7",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            maxWidth: "900px",
            marginBottom: "32px",
          }}
        >
          {truncatedName}
        </div>

        {/* Specs row */}
        <div style={{ display: "flex", gap: "32px" }}>
          {weight && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "13px", color: "#5A6478", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Weight</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#C8CDD8" }}>{weight}</div>
            </div>
          )}
          {purity && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "13px", color: "#5A6478", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Purity</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#C8CDD8" }}>{purity}</div>
            </div>
          )}
          {mint && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "13px", color: "#5A6478", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Mint</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#C8CDD8" }}>{mint.length > 30 ? mint.slice(0, 27) + "…" : mint}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "32px", left: "80px", color: "#4A5568", fontSize: "18px" }}>
          metalorix.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
