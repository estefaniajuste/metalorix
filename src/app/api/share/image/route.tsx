import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = 1080;
const GOLD = "#D6B35A";
const BG_GRADIENT = "linear-gradient(160deg, #0B0F17 0%, #151B2B 50%, #0B0F17 100%)";
const TEXT_PRIMARY = "#F1F3F7";
const TEXT_SECONDARY = "#8B95A8";
const SIGNAL_UP = "#34D399";
const SIGNAL_DOWN = "#F87171";
const BG_DARK = "#0B0F17";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "prices";

  try {
    if (type === "article") {
      return renderArticle(searchParams);
    }
    return await renderPrices();
  } catch (err) {
    console.error("[Share Image] Error:", err);
    return new Response("Image generation failed", { status: 500 });
  }
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${GOLD}, #B8962E)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          fontWeight: 800,
          color: BG_DARK,
        }}
      >
        M
      </div>
      <div style={{ fontSize: "36px", fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: "-1px" }}>
        Metalorix
      </div>
    </div>
  );
}

function DateStamp() {
  const d = new Date();
  const label = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return <div style={{ fontSize: "20px", color: TEXT_SECONDARY, marginTop: "8px" }}>{label}</div>;
}

function Footer() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "36px",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ color: TEXT_SECONDARY, fontSize: "18px" }}>metalorix.com</div>
    </div>
  );
}

function GoldBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }}
    />
  );
}

function ChangeArrow({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span style={{ color: up ? SIGNAL_UP : SIGNAL_DOWN, fontSize: "24px", fontWeight: 700 }}>
      {up ? "▲" : "▼"} {up ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

/* ── Prices card ─────────────────────────────────────────────── */

async function renderPrices() {
  let metals: { symbol: string; name: string; price: number; changePct: number; color: string }[] = [];

  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/prices`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.prices ?? [];
      const colorMap: Record<string, string> = {
        XAU: "#D6B35A", XAG: "#A7B0BE", XPT: "#8B9DC3", XPD: "#CED0CE",
      };
      const nameMap: Record<string, string> = {
        XAU: "Gold", XAG: "Silver", XPT: "Platinum", XPD: "Palladium",
      };
      metals = list
        .filter((m: Record<string, unknown>) => ["XAU", "XAG", "XPT", "XPD"].includes(m.symbol as string))
        .map((m: Record<string, unknown>) => ({
          symbol: m.symbol as string,
          name: nameMap[m.symbol as string] ?? (m.symbol as string),
          price: Number(m.priceUsd ?? m.price ?? 0),
          changePct: Number(m.changePct24h ?? m.changePct ?? 0),
          color: colorMap[m.symbol as string] ?? GOLD,
        }));
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: BG_GRADIENT, fontFamily: "system-ui, sans-serif", position: "relative",
        }}
      >
        <GoldBar />
        <Logo />
        <DateStamp />
        <div style={{ fontSize: "26px", fontWeight: 700, color: GOLD, marginTop: "40px", letterSpacing: "2px", textTransform: "uppercase" }}>
          Daily Spot Prices
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "36px", width: "85%" }}>
          {metals.map((m) => (
            <div
              key={m.symbol}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px", padding: "24px 32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: m.color }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: TEXT_PRIMARY, fontSize: "28px", fontWeight: 700 }}>{m.name}</span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: "18px" }}>{m.symbol}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ color: TEXT_PRIMARY, fontSize: "30px", fontWeight: 700 }}>
                  ${m.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <ChangeArrow pct={m.changePct} />
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}

/* ── Article card ────────────────────────────────────────────── */

function renderArticle(params: URLSearchParams) {
  const title = params.get("title") || "Metalorix";
  const excerpt = params.get("excerpt") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: BG_GRADIENT, fontFamily: "system-ui, sans-serif",
          position: "relative", padding: "60px",
        }}
      >
        <GoldBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Logo />
          <DateStamp />
          <div style={{ fontSize: "20px", fontWeight: 700, color: GOLD, marginTop: "40px", letterSpacing: "3px", textTransform: "uppercase" }}>
            News &amp; Analysis
          </div>
          <div style={{
            fontSize: "42px", fontWeight: 800, color: TEXT_PRIMARY,
            textAlign: "center", marginTop: "36px", lineHeight: 1.3, maxWidth: "900px",
          }}>
            {title.length > 90 ? title.slice(0, 90) + "..." : title}
          </div>
          {excerpt && (
            <div style={{
              fontSize: "22px", color: TEXT_SECONDARY,
              textAlign: "center", marginTop: "24px", lineHeight: 1.5, maxWidth: "800px",
            }}>
              {excerpt.length > 200 ? excerpt.slice(0, 200) + "..." : excerpt}
            </div>
          )}
        </div>
        <Footer />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
