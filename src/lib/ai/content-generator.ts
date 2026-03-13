import { generateText, isConfigured } from "./gemini";
import { getDb } from "@/lib/db";
import { articles, newsSources, metalPrices } from "@/lib/db/schema";
import { desc, gte, eq } from "drizzle-orm";

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

interface NewsItem {
  title: string;
  source: string;
  summary: string;
  metals: string[] | null;
  sentiment: string | null;
}

async function getCurrentPrices(): Promise<PriceData[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db.select().from(metalPrices);
    return rows.map((r) => ({
      symbol: r.symbol,
      name: r.name,
      price: parseFloat(r.priceUsd),
      change: parseFloat(r.change24h ?? "0"),
      changePct: parseFloat(r.changePct24h ?? "0"),
    }));
  } catch {
    return [];
  }
}

async function getRecentNews(hours: number = 24): Promise<NewsItem[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const rows = await db
      .select()
      .from(newsSources)
      .where(gte(newsSources.scrapedAt, since))
      .orderBy(desc(newsSources.scrapedAt))
      .limit(20);
    return rows.map((r) => ({
      title: r.title,
      source: r.source,
      summary: r.summary ?? "",
      metals: r.metals,
      sentiment: r.sentiment,
    }));
  } catch {
    return [];
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrices(prices: PriceData[]): string {
  return prices
    .map(
      (p) =>
        `- ${p.name} (${p.symbol}): $${p.price.toFixed(2)} USD/oz (${p.changePct >= 0 ? "+" : ""}${p.changePct.toFixed(2)}%)`
    )
    .join("\n");
}

function formatNews(news: NewsItem[]): string {
  if (news.length === 0) return "No hay noticias relevantes recientes.";
  return news
    .slice(0, 10)
    .map((n) => `- [${n.source}] ${n.title}: ${n.summary.slice(0, 150)}`)
    .join("\n");
}

export async function generateDailySummary(): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
} | null> {
  if (!isConfigured()) return null;

  const prices = await getCurrentPrices();
  const news = await getRecentNews(24);
  const today = new Date();
  const dateStr = formatDate(today);

  const prompt = `Eres un analista experto en metales preciosos que escribe en español para inversores hispanohablantes. 

Escribe un RESUMEN DIARIO del mercado de metales preciosos para hoy, ${dateStr}.

DATOS DE PRECIOS ACTUALES:
${formatPrices(prices)}

NOTICIAS RELEVANTES DE LAS ÚLTIMAS 24H:
${formatNews(news)}

INSTRUCCIONES:
- Escribe en español natural, profesional pero accesible
- Longitud: 400-600 palabras
- Estructura: Empieza con un párrafo resumen, luego analiza cada metal, luego perspectivas
- Usa formato: párrafos normales, encabezados con ## para secciones principales
- NO uses markdown en exceso, solo ## para títulos de sección
- Menciona datos concretos (precios, porcentajes)
- Si hay noticias relevantes, menciona cómo afectan a los precios
- Incluye una sección "Perspectivas" al final con lo que podría pasar
- Tono: informativo, analítico, útil para quien invierte en metales
- NO incluyas título ni fecha al inicio (se añaden automáticamente)
- NO digas "como analista" ni uses primera persona`;

  const content = await generateText(prompt);
  if (!content) return null;

  const dateSlug = today.toISOString().slice(0, 10);
  const slug = `resumen-diario-metales-preciosos-${dateSlug}`;
  const title = `Resumen del mercado de metales preciosos — ${dateStr}`;
  const excerpt = `Oro a $${prices.find((p) => p.symbol === "XAU")?.price.toFixed(0) ?? "N/A"}, Plata a $${prices.find((p) => p.symbol === "XAG")?.price.toFixed(2) ?? "N/A"}, Platino a $${prices.find((p) => p.symbol === "XPT")?.price.toFixed(0) ?? "N/A"}. Análisis del día.`;

  return {
    slug,
    title,
    excerpt,
    content: content.trim(),
    metals: ["XAU", "XAG", "XPT"],
  };
}

export async function generateEventArticle(
  metal: string,
  metalName: string,
  price: number,
  changePct: number
): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
} | null> {
  if (!isConfigured()) return null;

  const news = await getRecentNews(12);
  const direction = changePct > 0 ? "sube" : "cae";
  const absChange = Math.abs(changePct).toFixed(1);
  const today = new Date();
  const dateStr = formatDate(today);

  const prompt = `Eres un analista experto en metales preciosos que escribe en español.

ALERTA DE MERCADO: ${metalName} ${direction} un ${absChange}% hoy (${dateStr}).
Precio actual: $${price.toFixed(2)} USD/oz

NOTICIAS RECIENTES:
${formatNews(news)}

Escribe un artículo de 300-400 palabras explicando:
1. Qué ha pasado (el movimiento de precio)
2. Por qué (contexto de noticias si hay, o factores técnicos/macro)
3. Qué significa para los inversores
4. Niveles clave a vigilar

FORMATO: párrafos normales, ## para secciones. Tono profesional, datos concretos.
NO incluyas título. NO uses primera persona.`;

  const content = await generateText(prompt);
  if (!content) return null;

  const dateSlug = today.toISOString().slice(0, 10);
  const slug = `${metalName.toLowerCase()}-${direction}-${absChange}-porciento-${dateSlug}`;
  const title = `${metalName} ${direction} un ${absChange}% — Análisis del movimiento`;
  const excerpt = `${metalName} cotiza a $${price.toFixed(2)} tras ${direction === "sube" ? "una subida" : "una caída"} del ${absChange}% hoy. Analizamos las causas y perspectivas.`;

  return {
    slug,
    title,
    excerpt,
    content: content.trim(),
    metals: [metal],
  };
}

export async function generateWeeklySummary(): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
} | null> {
  if (!isConfigured()) return null;

  const prices = await getCurrentPrices();
  const news = await getRecentNews(168);
  const today = new Date();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const weekRange = `${weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "long" })} — ${today.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`;

  const prompt = `Eres un analista experto en metales preciosos que escribe en español.

Escribe un ANÁLISIS SEMANAL del mercado de metales preciosos.
Semana: ${weekRange}

PRECIOS ACTUALES:
${formatPrices(prices)}

NOTICIAS DE LA SEMANA:
${formatNews(news)}

INSTRUCCIONES:
- 600-800 palabras
- Estructura: Resumen de la semana, análisis por metal, factores macro, perspectiva para la próxima semana
- Usa ## para títulos de sección
- Datos concretos, tendencias, niveles de soporte/resistencia
- Menciona factores macro: dólar, tipos de interés, geopolítica
- Tono: profesional, analítico
- NO incluyas título. NO uses primera persona.`;

  const content = await generateText(prompt);
  if (!content) return null;

  const dateSlug = today.toISOString().slice(0, 10);
  const slug = `analisis-semanal-metales-preciosos-${dateSlug}`;
  const title = `Análisis semanal — ${weekRange}`;
  const excerpt = `Repaso completo de la semana en el mercado de metales preciosos. Oro, plata y platino: tendencias, niveles clave y perspectivas.`;

  return {
    slug,
    title,
    excerpt,
    content: content.trim(),
    metals: ["XAU", "XAG", "XPT"],
  };
}

export async function saveArticle(
  article: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    metals: string[];
  },
  category: "daily" | "weekly" | "event" | "educational"
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, article.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(articles)
        .set({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metals: article.metals,
          updatedAt: new Date(),
        })
        .where(eq(articles.slug, article.slug));
    } else {
      await db.insert(articles).values({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category,
        metals: article.metals,
        published: true,
        publishedAt: new Date(),
      });
    }
    return true;
  } catch (err) {
    console.error("Failed to save article:", err);
    return false;
  }
}
