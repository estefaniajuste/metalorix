import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { verifyImageSignature } from "@/lib/social/instagram";

export const runtime = "edge";

const SIZE = 1080;
const GOLD = "#D6B35A";
const BG_DARK = "#0B0F17";
const BG_GRADIENT = "linear-gradient(160deg, #0B0F17 0%, #151B2B 50%, #0B0F17 100%)";
const TEXT_PRIMARY = "#F1F3F7";
const TEXT_SECONDARY = "#8B95A8";
const SIGNAL_UP = "#34D399";
const SIGNAL_DOWN = "#F87171";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "https://metalorix.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "prices";
  const ts = searchParams.get("ts");
  const sig = searchParams.get("sig");

  if (!verifyImageSignature(type, ts, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  try {
    switch (type) {
      case "prices":
        return await renderPrices();
      case "fear_greed":
        return await renderFearGreed();
      case "gold_btc":
        return await renderGoldBtc();
      case "market_summary":
        return await renderMarketSummary(searchParams);
      case "learn_tip":
        return await renderLearnTip(searchParams);
      case "weekly_summary":
        return await renderMarketSummary(searchParams);
      default:
        return await renderPrices();
    }
  } catch (err) {
    console.error("[Instagram Image] Error:", err);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}

/* ────────────────────────────────────────────────────────────────── */
/*  Shared layout components                                         */
/* ────────────────────────────────────────────────────────────────── */

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
  return (
    <div style={{ fontSize: "20px", color: TEXT_SECONDARY, marginTop: "8px" }}>{label}</div>
  );
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
        gap: "8px",
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

/* ────────────────────────────────────────────────────────────────── */
/*  Prices card                                                      */
/* ────────────────────────────────────────────────────────────────── */

interface PriceRow {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  color: string;
}

async function fetchPrices(): Promise<PriceRow[]> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/prices`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const metals = Array.isArray(data) ? data : data.prices ?? [];
    const colorMap: Record<string, string> = {
      XAU: "#D6B35A",
      XAG: "#A7B0BE",
      XPT: "#8B9DC3",
      XPD: "#CED0CE",
      HG: "#B87333",
    };
    const nameMap: Record<string, string> = {
      XAU: "Gold",
      XAG: "Silver",
      XPT: "Platinum",
      XPD: "Palladium",
      HG: "Copper",
    };
    return metals
      .filter((m: Record<string, unknown>) => ["XAU", "XAG", "XPT", "XPD"].includes(m.symbol as string))
      .map((m: Record<string, unknown>) => ({
        symbol: m.symbol as string,
        name: nameMap[m.symbol as string] ?? (m.symbol as string),
        price: Number(m.priceUsd ?? m.price ?? 0),
        changePct: Number(m.changePct24h ?? m.changePct ?? 0),
        color: colorMap[m.symbol as string] ?? GOLD,
      }));
  } catch (err) {
    console.error("[Instagram Image] fetchPrices error:", err);
    return [];
  }
}

async function renderPrices() {
  const metals = await fetchPrices();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BG_GRADIENT,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <GoldBar />
        <Logo />
        <DateStamp />

        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: GOLD,
            marginTop: "40px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Daily Spot Prices
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "36px",
            width: "85%",
          }}
        >
          {metals.map((m) => (
            <div
              key={m.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px 32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: m.color,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: TEXT_PRIMARY, fontSize: "28px", fontWeight: 700 }}>
                    {m.name}
                  </span>
                  <span style={{ color: TEXT_SECONDARY, fontSize: "18px" }}>{m.symbol}</span>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}
              >
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

/* ────────────────────────────────────────────────────────────────── */
/*  Fear & Greed card                                                */
/* ────────────────────────────────────────────────────────────────── */

interface FGData {
  score: number;
  label: string;
  color: string;
  goldPrice: number;
  goldChange24h: number;
}

async function fetchFearGreed(): Promise<FGData | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/fear-greed`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function renderFearGreed() {
  const fg = await fetchFearGreed();
  const score = fg?.score ?? 50;
  const label = fg?.label ?? "Neutral";
  const labelColor = fg?.color ?? "#eab308";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BG_GRADIENT,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <GoldBar />
        <Logo />
        <DateStamp />

        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: GOLD,
            marginTop: "36px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Fear &amp; Greed Index
        </div>

        {/* Score circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "48px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            border: `6px solid ${labelColor}`,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "96px", fontWeight: 800, color: labelColor }}>{score}</span>
            <span style={{ fontSize: "28px", fontWeight: 600, color: labelColor, marginTop: "-8px" }}>
              {label}
            </span>
          </div>
        </div>

        {fg && (
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "12px",
                padding: "20px 32px",
              }}
            >
              <span style={{ color: TEXT_SECONDARY, fontSize: "18px" }}>Gold</span>
              <span style={{ color: TEXT_PRIMARY, fontSize: "28px", fontWeight: 700 }}>
                ${fg.goldPrice.toFixed(2)}
              </span>
              <ChangeArrow pct={fg.goldChange24h} />
            </div>
          </div>
        )}

        <Footer />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Gold vs Bitcoin card                                             */
/* ────────────────────────────────────────────────────────────────── */

interface BtcData {
  price: number;
  changePct24h: number;
}

async function fetchBtcPrice(): Promise<BtcData | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/btc-price`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function renderGoldBtc() {
  const [metals, btc] = await Promise.all([fetchPrices(), fetchBtcPrice()]);
  const gold = metals.find((m) => m.symbol === "XAU");
  const goldPrice = gold?.price ?? 0;
  const goldPct = gold?.changePct ?? 0;
  const btcPrice = btc?.price ?? 0;
  const btcPct = btc?.changePct24h ?? 0;
  const ratio = goldPrice > 0 ? btcPrice / goldPrice : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BG_GRADIENT,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <GoldBar />
        <Logo />
        <DateStamp />

        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: GOLD,
            marginTop: "36px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Gold vs Bitcoin
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "48px",
            width: "85%",
          }}
        >
          {/* Gold card */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(214,179,90,0.08)",
              border: "1px solid rgba(214,179,90,0.2)",
              borderRadius: "20px",
              padding: "36px 24px",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 700, color: GOLD }}>GOLD</span>
            <span style={{ fontSize: "48px", fontWeight: 800, color: TEXT_PRIMARY }}>
              ${goldPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <ChangeArrow pct={goldPct} />
          </div>

          {/* BTC card */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(247,147,26,0.08)",
              border: "1px solid rgba(247,147,26,0.2)",
              borderRadius: "20px",
              padding: "36px 24px",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#F7931A" }}>BITCOIN</span>
            <span style={{ fontSize: "48px", fontWeight: 800, color: TEXT_PRIMARY }}>
              ${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <ChangeArrow pct={btcPct} />
          </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            padding: "16px 32px",
          }}
        >
          <span style={{ color: TEXT_SECONDARY, fontSize: "22px" }}>BTC/Gold Ratio:</span>
          <span style={{ color: TEXT_PRIMARY, fontSize: "28px", fontWeight: 700 }}>
            {ratio.toFixed(2)}
          </span>
        </div>

        <Footer />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Market Summary / Weekly / Learn Tip cards                        */
/* ────────────────────────────────────────────────────────────────── */

async function renderMarketSummary(params: URLSearchParams) {
  const title = params.get("title") || "Market Update";
  const excerpt = params.get("excerpt") || "";
  const category = params.get("category") || "daily";
  const categoryLabel = category === "weekly" ? "WEEKLY REVIEW" : "DAILY MARKET UPDATE";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BG_GRADIENT,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          padding: "60px",
        }}
      >
        <GoldBar />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Logo />
          <DateStamp />

          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: GOLD,
              marginTop: "40px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: TEXT_PRIMARY,
              textAlign: "center",
              marginTop: "32px",
              lineHeight: 1.3,
              maxWidth: "900px",
            }}
          >
            {title.length > 80 ? title.slice(0, 80) + "..." : title}
          </div>

          {excerpt && (
            <div
              style={{
                fontSize: "22px",
                color: TEXT_SECONDARY,
                textAlign: "center",
                marginTop: "24px",
                lineHeight: 1.5,
                maxWidth: "800px",
              }}
            >
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

async function renderLearnTip(params: URLSearchParams) {
  const title = params.get("title") || "Precious Metals Fact";
  const topic = params.get("topic") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BG_GRADIENT,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          padding: "60px",
        }}
      >
        <GoldBar />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Logo />

          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: GOLD,
              marginTop: "48px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Did You Know?
          </div>

          {topic && (
            <div
              style={{
                fontSize: "18px",
                color: TEXT_SECONDARY,
                marginTop: "16px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "8px",
                padding: "8px 20px",
              }}
            >
              {topic}
            </div>
          )}

          <div
            style={{
              fontSize: "42px",
              fontWeight: 800,
              color: TEXT_PRIMARY,
              textAlign: "center",
              marginTop: "48px",
              lineHeight: 1.3,
              maxWidth: "860px",
            }}
          >
            {title.length > 90 ? title.slice(0, 90) + "..." : title}
          </div>

          <div
            style={{
              marginTop: "48px",
              fontSize: "22px",
              color: GOLD,
              fontWeight: 600,
            }}
          >
            Swipe up or check link in bio to learn more
          </div>
        </div>

        <Footer />
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
