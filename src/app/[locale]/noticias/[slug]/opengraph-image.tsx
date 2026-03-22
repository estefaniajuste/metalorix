import { ImageResponse } from "next/og";
import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";
export const alt = "Metalorix — News Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  daily: { es: "Resumen Diario", en: "Daily Summary", de: "Tagesbericht", zh: "每日摘要", ar: "ملخص يومي", tr: "Günlük Özet", hi: "दैनिक सारांश" },
  weekly: { es: "Análisis Semanal", en: "Weekly Analysis", de: "Wochenanalyse", zh: "每周分析", ar: "تحليل أسبوعي", tr: "Haftalık Analiz", hi: "साप्ताहिक विश्लेषण" },
  event: { es: "Alerta de Mercado", en: "Market Alert", de: "Marktwarnung", zh: "市场警报", ar: "تنبيه السوق", tr: "Piyasa Uyarısı", hi: "बाजार अलर्ट" },
};

export default async function OgImage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale || "en";
  const slug = params.slug;

  let title = "Metalorix News";
  let category = "daily";

  try {
    const db = getDb();
    if (db) {
      const [article] = await db
        .select({ id: articles.id, title: articles.title, category: articles.category })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (article) {
        category = article.category;

        if (locale !== "es") {
          const [translation] = await db
            .select({ title: articleTranslations.title })
            .from(articleTranslations)
            .where(
              and(
                eq(articleTranslations.articleId, article.id),
                eq(articleTranslations.locale, locale)
              )
            )
            .limit(1);
          title = translation?.title ?? article.title;
        } else {
          title = article.title;
        }
      }
    }
  } catch {
    // fallback to default title
  }

  const categoryLabel = CATEGORY_LABELS[category]?.[locale] ?? CATEGORY_LABELS[category]?.en ?? category;

  const truncatedTitle =
    title.length > 90 ? title.slice(0, 87) + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B0F17 0%, #151B2B 50%, #0B0F17 100%)",
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
            background:
              "linear-gradient(90deg, transparent, #D6B35A, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
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
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#EAEDF3",
              letterSpacing: "-0.5px",
            }}
          >
            Metalorix
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#D6B35A",
              background: "rgba(214,179,90,0.12)",
              padding: "6px 16px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            {categoryLabel}
          </div>
        </div>

        <div
          style={{
            fontSize: "44px",
            fontWeight: 800,
            color: "#F1F3F7",
            lineHeight: 1.2,
            letterSpacing: "-1px",
            maxWidth: "900px",
          }}
        >
          {truncatedTitle}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "80px",
            color: "#4A5568",
            fontSize: "18px",
          }}
        >
          metalorix.com
        </div>
      </div>
    ),
    { ...size }
  );
}
