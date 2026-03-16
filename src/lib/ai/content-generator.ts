import { generateText, isConfigured, type GeminiLog } from "./gemini";
import { getDb } from "@/lib/db";
import { articles, newsSources, metalPrices, glossaryTerms, articleTranslations } from "@/lib/db/schema";
import { desc, gte, eq, asc, and } from "drizzle-orm";
import { fetchAllSpotPrices as fetchFromYahoo } from "@/lib/providers/yahoo-finance";
import { METALS } from "@/lib/providers/metals";

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

interface NewsItem {
  title: string;
  url: string;
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

/** Fetches prices from Yahoo Finance when DB is empty. No API key required. */
async function fetchPricesFromProvider(): Promise<PriceData[]> {
  try {
    const spots = await fetchFromYahoo();
    if (!spots || spots.length === 0) return [];
    return spots.map((s) => ({
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      change: s.change,
      changePct: s.changePct,
    }));
  } catch (err) {
    console.warn("[ContentGenerator] fetchPricesFromProvider failed:", err);
    return [];
  }
}

/** Returns prices from DB, or from Yahoo if DB empty, or METALS base values as last resort. Never returns empty for daily summary. */
async function getPricesWithFallback(): Promise<PriceData[]> {
  let prices = await getCurrentPrices();
  if (prices.length > 0) return prices;

  console.warn("[ContentGenerator] metal_prices empty, fetching from Yahoo...");
  prices = await fetchPricesFromProvider();
  if (prices.length > 0) return prices;

  console.warn("[ContentGenerator] Yahoo fetch failed, using METALS base values");
  return (Object.entries(METALS) as [string, { name: string; base: number }][]).map(
    ([symbol, m]) => ({
      symbol,
      name: m.name,
      price: m.base,
      change: 0,
      changePct: 0,
    })
  );
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
      url: r.url,
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
    .slice(0, 100);
}

interface StructuredArticle {
  titulo_seo: string;
  meta_descripcion: string;
  palabras_clave_url: string;
  contenido: string;
  fuentes?: { titulo: string; url: string }[];
}

function parseStructuredResponse(raw: string): StructuredArticle | null {
  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const parsed = JSON.parse(jsonStr);
    if (
      parsed.titulo_seo &&
      parsed.meta_descripcion &&
      parsed.palabras_clave_url &&
      parsed.contenido
    ) {
      return parsed as StructuredArticle;
    }
    return null;
  } catch {
    return null;
  }
}

function appendSources(content: string, fuentes?: { titulo: string; url: string }[]): string {
  if (!fuentes || fuentes.length === 0) return content;
  const sourcesSection = fuentes
    .map((f) => `- [${f.titulo}](${f.url})`)
    .join("\n");
  return `${content}\n\n## Fuentes\n\n${sourcesSection}`;
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
  if (news.length === 0) return "No relevant recent news.";
  return news
    .slice(0, 15)
    .map((n) => `- [${n.source}] ${n.title}: ${n.summary.slice(0, 150)} (URL: ${n.url})`)
    .join("\n");
}

async function getGlossaryTermsForPrompt(): Promise<string> {
  const db = getDb();
  if (!db) return "";
  try {
    const terms = await db
      .select({ slug: glossaryTerms.slug, term: glossaryTerms.term })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.published, true))
      .orderBy(asc(glossaryTerms.term))
      .limit(200);
    if (terms.length === 0) return "";
    return terms.map((t) => `- ${t.term}`).join("\n");
  } catch {
    return "";
  }
}

export interface DailyGenerationLog {
  pricesCount: number;
  newsCount: number;
  promptSizeBytes: number;
  geminiResponseLength?: number;
  geminiLog?: GeminiLog;
  parseSuccess: boolean;
  discardReason?: string;
  usedFallback: "none" | "minimal" | "raw";
}

function buildGlossaryLinkingInstructions(termList: string): string {
  if (!termList) return "";
  return `
TERMINOLOGÍA DEL SECTOR:
Usa estos términos técnicos cuando sea apropiado. Incluye entre 3 y 5 enlaces a términos del glosario en el cuerpo del artículo usando formato markdown: [término](/learn/glossary/slug-del-termino). No repitas el mismo enlace más de una vez.

TÉRMINOS DISPONIBLES:
${termList}
`;
}

export async function generateDailySummary(log?: DailyGenerationLog): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
}> {
  const today = new Date();
  const dateStr = formatDate(today);
  const dateSlug = today.toISOString().slice(0, 10);

  const prices = await getPricesWithFallback();
  const news = await getRecentNews(24);

  if (log) {
    log.pricesCount = prices.length;
    log.newsCount = news.length;
  }
  console.log(`[ContentGenerator] generateDailySummary: prices=${prices.length}, news=${news.length}`);

  if (!isConfigured()) {
    console.warn("[ContentGenerator] Gemini not configured, using minimal article");
    if (log) log.usedFallback = "minimal";
    return buildMinimalDailyArticle(prices, dateStr, dateSlug);
  }

  const glossaryContext = await getGlossaryTermsForPrompt();
  const glossaryInstructions = buildGlossaryLinkingInstructions(glossaryContext);

  const prompt = `Eres un analista experto en metales preciosos, macroeconomía y geopolítica que escribe en español para inversores hispanohablantes.

Escribe un RESUMEN DIARIO del mercado de metales preciosos e industriales para hoy, ${dateStr}.

DATOS DE PRECIOS ACTUALES:
${formatPrices(prices)}

NOTICIAS RELEVANTES DE LAS ÚLTIMAS 24H:
${formatNews(news)}

INSTRUCCIONES PARA EL CONTENIDO:
- Escribe en español natural, profesional pero accesible
- Longitud: 500-700 palabras
- Estructura:
  1. Párrafo resumen con lo más importante del día
  2. Análisis de cada metal con datos concretos
  3. Contexto geopolítico y macroeconómico: explica cómo los eventos globales del día (conflictos, sanciones, decisiones de bancos centrales, datos de empleo, inflación, políticas comerciales, aranceles, etc.) afectan a los metales
  4. Perspectivas a corto plazo
- Conecta SIEMPRE los movimientos de precios con causas reales: decisiones de la Fed, tensiones geopolíticas, datos económicos, demanda industrial, compras de bancos centrales, etc.
- Usa formato: párrafos normales, encabezados con ## para secciones principales
- NO uses markdown en exceso, solo ## para títulos de sección
- Menciona datos concretos (precios, porcentajes, niveles)
- Tono: informativo, analítico, útil para quien invierte en metales
- NO incluyas título ni fecha al inicio (se añaden automáticamente)
- NO digas "como analista" ni uses primera persona
${glossaryInstructions}

INSTRUCCIONES SEO Y FUENTES (MUY IMPORTANTE):
Debes devolver tu respuesta como un JSON válido con esta estructura exacta:

{
  "titulo_seo": "Un título optimizado para SEO (50-65 caracteres). Debe captar la esencia de la jornada con palabras clave que la gente busca en Google. Ejemplos de buen título: 'El oro supera los $5000 por tensiones en Oriente Medio', 'Caída del oro y subida de la plata tras datos de empleo en EE.UU.', 'Récord del oro ante debilidad del dólar y compras de bancos centrales'. NO uses títulos genéricos como 'Resumen del mercado'. Incluye la causa principal del movimiento.",
  "meta_descripcion": "Metadescripción atractiva para Google (140-155 caracteres). Resumen con precios concretos y el factor clave del día. Debe invitar al clic.",
  "palabras_clave_url": "3-6 palabras clave separadas por espacios para la URL, sin fecha. Ejemplo: 'oro sube tensiones geopoliticas ormuz' o 'plata maximo anual demanda industrial'. Solo las palabras más relevantes del día.",
  "contenido": "El artículo completo aquí (500-700 palabras con formato ## para secciones). NO incluyas la sección de fuentes aquí, va en el campo fuentes.",
  "fuentes": [{"titulo": "Título descriptivo de la fuente", "url": "URL completa de la noticia original"}]
}

IMPORTANTE sobre fuentes:
- Incluye en "fuentes" las noticias originales que hayas utilizado para escribir el artículo
- Usa las URLs proporcionadas en las noticias de arriba
- Mínimo 2 fuentes, máximo 6
- Si no hay URLs de noticias disponibles, incluye fuentes genéricas como {"titulo": "Reuters Commodities", "url": "https://www.reuters.com/business/commodities/"}

Devuelve SOLO el JSON, sin texto adicional antes o después. No envuelvas en bloques de código.`;

  const promptSize = new TextEncoder().encode(prompt).length;
  if (log) log.promptSizeBytes = promptSize;
  console.log(`[ContentGenerator] Prompt size: ${promptSize} bytes`);

  const raw = await generateText(prompt, {
    retryOnEmpty: true,
    log: (entry) => {
      if (log) log.geminiLog = entry;
    },
  });

  if (!raw) {
    if (log) {
      log.geminiResponseLength = 0;
      log.usedFallback = "minimal";
      log.discardReason = "Gemini returned empty (after retry)";
    }
    console.warn("[ContentGenerator] Gemini returned empty, using minimal article fallback");
    return buildMinimalDailyArticle(prices, dateStr, dateSlug);
  }

  if (log) log.geminiResponseLength = raw.length;
  console.log(`[ContentGenerator] Gemini response length: ${raw.length} chars`);

  const parsed = parseStructuredResponse(raw);

  if (parsed) {
    if (log) {
      log.parseSuccess = true;
      log.usedFallback = "none";
    }
    const keywordSlug = slugify(parsed.palabras_clave_url);
    console.log(`[ContentGenerator] Parsed JSON successfully, slug: ${keywordSlug}-${dateSlug}`);
    return {
      slug: `${keywordSlug}-${dateSlug}`,
      title: parsed.titulo_seo,
      excerpt: parsed.meta_descripcion,
      content: appendSources(parsed.contenido.trim(), parsed.fuentes),
      metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
    };
  }

  if (log) {
    log.parseSuccess = false;
    log.usedFallback = "raw";
    log.discardReason = "JSON parse failed, using raw content";
  }
  console.warn("[ContentGenerator] JSON parse failed, using raw content as fallback");
  const fallbackSlug = `resumen-diario-metales-preciosos-${dateSlug}`;
  const fallbackTitle = `Resumen del mercado de metales — ${dateStr}`;
  const fallbackExcerpt = `Oro a $${prices.find((p) => p.symbol === "XAU")?.price.toFixed(0) ?? "N/A"}, Plata a $${prices.find((p) => p.symbol === "XAG")?.price.toFixed(2) ?? "N/A"}, Platino a $${prices.find((p) => p.symbol === "XPT")?.price.toFixed(0) ?? "N/A"}, Paladio a $${prices.find((p) => p.symbol === "XPD")?.price.toFixed(0) ?? "N/A"}, Cobre a $${prices.find((p) => p.symbol === "HG")?.price.toFixed(2) ?? "N/A"}/lb. Análisis del día.`;

  return {
    slug: fallbackSlug,
    title: fallbackTitle,
    excerpt: fallbackExcerpt,
    content: raw.trim(),
    metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
  };
}

function buildMinimalDailyArticle(
  prices: PriceData[],
  dateStr: string,
  dateSlug: string
): {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
} {
  const oro = prices.find((p) => p.symbol === "XAU");
  const plata = prices.find((p) => p.symbol === "XAG");
  const platino = prices.find((p) => p.symbol === "XPT");
  const paladio = prices.find((p) => p.symbol === "XPD");
  const cobre = prices.find((p) => p.symbol === "HG");

  const priceLines: string[] = [];
  if (oro) priceLines.push(`- **Oro**: $${oro.price.toFixed(2)}/oz (${oro.changePct >= 0 ? "+" : ""}${oro.changePct.toFixed(2)}% en 24h)`);
  if (plata) priceLines.push(`- **Plata**: $${plata.price.toFixed(2)}/oz (${plata.changePct >= 0 ? "+" : ""}${plata.changePct.toFixed(2)}% en 24h)`);
  if (platino) priceLines.push(`- **Platino**: $${platino.price.toFixed(2)}/oz (${platino.changePct >= 0 ? "+" : ""}${platino.changePct.toFixed(2)}% en 24h)`);
  if (paladio) priceLines.push(`- **Paladio**: $${paladio.price.toFixed(2)}/oz (${paladio.changePct >= 0 ? "+" : ""}${paladio.changePct.toFixed(2)}% en 24h)`);
  if (cobre) priceLines.push(`- **Cobre**: $${cobre.price.toFixed(2)}/lb (${cobre.changePct >= 0 ? "+" : ""}${cobre.changePct.toFixed(2)}% en 24h)`);
  const priceSection = priceLines.length > 0 ? priceLines.join("\n") : "Datos de precios no disponibles en este momento.";

  const oroAnalysis = oro
    ? `El oro cotiza a $${oro.price.toFixed(2)}/oz con una variación del ${oro.changePct >= 0 ? "+" : ""}${oro.changePct.toFixed(2)}% en las últimas 24 horas. Como activo refugio, el oro suele reaccionar a la incertidumbre geopolítica, las decisiones de los bancos centrales y las expectativas de inflación.`
    : "";

  const content = `## Resumen del día

Resumen del mercado de metales preciosos para ${dateStr}.

## Precios actuales

${priceSection}

## Análisis del mercado

${oroAnalysis || "El mercado de metales preciosos refleja la oferta y demanda global, las tensiones geopolíticas y las políticas monetarias. Oro, plata, platino y paladio son metales de inversión y uso industrial."}

## El metal del día: Oro

El oro es el metal precioso por excelencia. Se utiliza como reserva de valor, en joyería y en aplicaciones industriales (electrónica, odontología). Su precio suele subir en entornos de incertidumbre y cuando los tipos de interés reales bajan. Más información en nuestro [glosario de oro](/learn/glossary/oro).

## Fuentes

- [Reuters Commodities](https://www.reuters.com/business/commodities/)
- [Kitco News](https://www.kitco.com/news/)`;

  const slug = `resumen-diario-metales-preciosos-${dateSlug}`;
  const title = `Resumen del mercado de metales — ${dateStr}`;
  const excerpt = `Oro a $${oro?.price.toFixed(0) ?? "N/A"}, Plata a $${plata?.price.toFixed(2) ?? "N/A"}, Platino a $${platino?.price.toFixed(0) ?? "N/A"}, Paladio a $${paladio?.price.toFixed(0) ?? "N/A"}, Cobre a $${cobre?.price.toFixed(2) ?? "N/A"}/lb. Análisis del día.`;

  return { slug, title, excerpt, content, metals: ["XAU", "XAG", "XPT", "XPD", "HG"] };
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
  const glossaryContext = await getGlossaryTermsForPrompt();
  const glossaryInstructions = buildGlossaryLinkingInstructions(glossaryContext);

  const prompt = `Eres un analista experto en metales preciosos, macroeconomía y geopolítica que escribe en español.

ALERTA DE MERCADO: ${metalName} ${direction} un ${absChange}% hoy (${dateStr}).
Precio actual: $${price.toFixed(2)} USD/oz

NOTICIAS RECIENTES:
${formatNews(news)}

Escribe un artículo de 400-500 palabras explicando:
1. Qué ha pasado (el movimiento de precio)
2. Por qué: contexto geopolítico (conflictos, sanciones, tensiones comerciales), macroeconómico (decisiones de la Fed, datos de empleo, inflación, dólar) o de mercado (demanda industrial, compras de bancos centrales)
3. Qué significa para los inversores
4. Niveles clave a vigilar y perspectivas a corto plazo

FORMATO: párrafos normales, ## para secciones. Tono profesional, datos concretos.
NO incluyas título. NO uses primera persona.
${glossaryInstructions}

INSTRUCCIONES SEO Y FUENTES (MUY IMPORTANTE):
Debes devolver tu respuesta como un JSON válido con esta estructura exacta:

{
  "titulo_seo": "Un título optimizado para SEO (50-65 caracteres). Debe explicar qué ha pasado y por qué. Ejemplos: '${metalName} se dispara un ${absChange}% por sanciones a Rusia', '${metalName} cae tras subida de tipos de la Fed', 'Desplome del ${metalName.toLowerCase()}: inversores huyen a bonos del Tesoro'. Incluye la CAUSA del movimiento, no solo el dato.",
  "meta_descripcion": "Metadescripción para Google (140-155 caracteres). Precio actual, cambio porcentual y causa principal. Debe generar clics.",
  "palabras_clave_url": "3-6 palabras clave para la URL sin fecha. Ejemplo: '${metalName.toLowerCase()} ${direction} ${absChange} sanciones rusia' o '${metalName.toLowerCase()} caida tipos interes fed'. Solo palabras relevantes.",
  "contenido": "El artículo completo aquí (400-500 palabras con formato ## para secciones). NO incluyas la sección de fuentes aquí.",
  "fuentes": [{"titulo": "Título descriptivo de la fuente", "url": "URL completa de la noticia original"}]
}

IMPORTANTE sobre fuentes:
- Incluye en "fuentes" las noticias originales que hayas utilizado
- Usa las URLs proporcionadas en las noticias de arriba
- Mínimo 2 fuentes, máximo 5

Devuelve SOLO el JSON, sin texto adicional antes o después. No envuelvas en bloques de código.`;

  const raw = await generateText(prompt);
  if (!raw) return null;

  const dateSlug = today.toISOString().slice(0, 10);
  const parsed = parseStructuredResponse(raw);

  if (parsed) {
    const keywordSlug = slugify(parsed.palabras_clave_url);
    return {
      slug: `${keywordSlug}-${dateSlug}`,
      title: parsed.titulo_seo,
      excerpt: parsed.meta_descripcion,
      content: appendSources(parsed.contenido.trim(), parsed.fuentes),
      metals: [metal],
    };
  }

  const fallbackSlug = `${metalName.toLowerCase()}-${direction}-${absChange}-porciento-${dateSlug}`;
  const fallbackTitle = `${metalName} ${direction} un ${absChange}% — Análisis del movimiento`;
  const fallbackExcerpt = `${metalName} cotiza a $${price.toFixed(2)} tras ${direction === "sube" ? "una subida" : "una caída"} del ${absChange}% hoy. Analizamos las causas y perspectivas.`;

  return {
    slug: fallbackSlug,
    title: fallbackTitle,
    excerpt: fallbackExcerpt,
    content: raw.trim(),
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
  const glossaryContext = await getGlossaryTermsForPrompt();
  const glossaryInstructions = buildGlossaryLinkingInstructions(glossaryContext);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const weekRange = `${weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "long" })} — ${today.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`;

  const prompt = `Eres un analista experto en metales preciosos, macroeconomía y geopolítica que escribe en español.

Escribe un ANÁLISIS SEMANAL del mercado de metales preciosos.
Semana: ${weekRange}

PRECIOS ACTUALES:
${formatPrices(prices)}

NOTICIAS DE LA SEMANA:
${formatNews(news)}

INSTRUCCIONES PARA EL CONTENIDO:
- 700-900 palabras
- Estructura:
  1. Resumen ejecutivo de la semana (qué ha dominado)
  2. Análisis por metal con datos concretos y niveles de soporte/resistencia
  3. Contexto geopolítico: conflictos, sanciones, tensiones comerciales, aranceles, relaciones entre potencias
  4. Contexto macroeconómico: decisiones de bancos centrales (Fed, BCE, etc.), datos de empleo, inflación, evolución del dólar, rendimientos de bonos
  5. Perspectiva para la próxima semana: qué vigilar, eventos clave programados
- Conecta SIEMPRE los movimientos con causas reales del mundo
- Usa ## para títulos de sección
- Tono: profesional, analítico, basado en hechos
- NO incluyas título. NO uses primera persona.
${glossaryInstructions}

INSTRUCCIONES SEO Y FUENTES (MUY IMPORTANTE):
Debes devolver tu respuesta como un JSON válido con esta estructura exacta:

{
  "titulo_seo": "Un título optimizado para SEO (50-65 caracteres). Debe resumir el hecho más importante de la semana. Ejemplos: 'Semana alcista para el oro: máximos históricos por compras de China', 'La plata lidera las subidas semanales por demanda industrial', 'Oro y platino caen en semana marcada por la Fed'. NO uses títulos genéricos como 'Análisis semanal'. Destaca el evento o tendencia más relevante.",
  "meta_descripcion": "Metadescripción para Google (140-155 caracteres). Resumen con datos clave de la semana y el factor dominante. Debe invitar al clic.",
  "palabras_clave_url": "3-6 palabras clave para la URL sin fecha. Ejemplo: 'oro maximos historicos compras china' o 'plata sube demanda industrial semana'. Solo palabras relevantes.",
  "contenido": "El artículo completo aquí (700-900 palabras con formato ## para secciones). NO incluyas la sección de fuentes aquí.",
  "fuentes": [{"titulo": "Título descriptivo de la fuente", "url": "URL completa de la noticia original"}]
}

IMPORTANTE sobre fuentes:
- Incluye en "fuentes" las noticias originales que hayas utilizado
- Usa las URLs proporcionadas en las noticias de arriba
- Mínimo 3 fuentes, máximo 8

Devuelve SOLO el JSON, sin texto adicional antes o después. No envuelvas en bloques de código.`;

  const raw = await generateText(prompt);
  if (!raw) return null;

  const dateSlug = today.toISOString().slice(0, 10);
  const parsed = parseStructuredResponse(raw);

  if (parsed) {
    const keywordSlug = slugify(parsed.palabras_clave_url);
    return {
      slug: `${keywordSlug}-${dateSlug}`,
      title: parsed.titulo_seo,
      excerpt: parsed.meta_descripcion,
      content: appendSources(parsed.contenido.trim(), parsed.fuentes),
      metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
    };
  }

  const fallbackSlug = `analisis-semanal-metales-preciosos-${dateSlug}`;
  const fallbackTitle = `Análisis semanal — ${weekRange}`;
  const fallbackExcerpt = `Repaso completo de la semana en el mercado de metales. Oro, plata, platino, paladio y cobre: tendencias, niveles clave y perspectivas.`;

  return {
    slug: fallbackSlug,
    title: fallbackTitle,
    excerpt: fallbackExcerpt,
    content: raw.trim(),
    metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
  };
}

const MIN_CONTENT_WORDS: Record<string, number> = {
  daily: 300,
  weekly: 500,
  event: 200,
  educational: 200,
};

const GENERIC_TITLES = [
  "resumen del mercado de metales",
  "análisis del mercado",
  "resumen diario",
  "resumen semanal",
];

export interface ArticleQualityResult {
  passed: boolean;
  reasons: string[];
}

export function validateArticleQuality(
  article: { title: string; excerpt: string; content: string },
  category: string
): ArticleQualityResult {
  const reasons: string[] = [];
  const wordCount = article.content.split(/\s+/).filter(Boolean).length;
  const minWords = MIN_CONTENT_WORDS[category] ?? 200;

  if (wordCount < minWords) {
    reasons.push(`content too short: ${wordCount} words (min ${minWords})`);
  }

  if (!article.title || article.title.length < 20) {
    reasons.push(`title too short or missing: "${article.title?.slice(0, 30)}"`);
  }

  const titleLower = article.title?.toLowerCase() ?? "";
  if (GENERIC_TITLES.some((g) => titleLower.startsWith(g))) {
    reasons.push(`generic title rejected: "${article.title.slice(0, 60)}"`);
  }

  if (!article.excerpt || article.excerpt.length < 50) {
    reasons.push(`excerpt too short or missing: ${article.excerpt?.length ?? 0} chars (min 50)`);
  }

  return { passed: reasons.length === 0, reasons };
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
): Promise<number | null> {
  const db = getDb();
  if (!db) return null;

  const quality = validateArticleQuality(article, category);
  if (!quality.passed) {
    console.error(`[saveArticle] Quality check FAILED for "${article.slug}":`, quality.reasons);
    return null;
  }

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
      return existing[0].id;
    } else {
      const [inserted] = await db.insert(articles).values({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category,
        metals: article.metals,
        published: true,
        publishedAt: new Date(),
      }).returning({ id: articles.id });
      return inserted.id;
    }
  } catch (err) {
    console.error("Failed to save article:", err);
    return null;
  }
}

/* ==========================================================
   Article Translation
   ========================================================== */

const TRANSLATION_LOCALES = ["en", "zh", "ar", "tr", "de"] as const;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
};

interface TranslatedArticle {
  title: string;
  excerpt: string;
  content: string;
  slug_keywords?: string;
}

function parseTranslatedResponse(raw: string): TranslatedArticle | null {
  try {
    const closedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const unclosedMatch = !closedMatch ? raw.match(/```(?:json)?\s*([\s\S]*)/) : null;
    let jsonStr = (closedMatch?.[1] ?? unclosedMatch?.[1] ?? raw).trim();

    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) jsonStr = objMatch[0];

    const parsed = JSON.parse(jsonStr);
    if (parsed.title && parsed.content) {
      return {
        title: parsed.title,
        excerpt: parsed.excerpt ?? "",
        content: parsed.content,
        slug_keywords: parsed.slug_keywords ?? undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function translateArticleToLocale(
  title: string,
  excerpt: string,
  content: string,
  targetLocale: string
): Promise<TranslatedArticle | null> {
  if (!isConfigured()) return null;

  const langName = LANGUAGE_NAMES[targetLocale];
  if (!langName) return null;

  const prompt = `You are a professional translator specializing in financial and precious metals content.

Translate the following Spanish article about precious metals into ${langName}.

ORIGINAL TITLE (Spanish):
${title}

ORIGINAL EXCERPT (Spanish):
${excerpt}

ORIGINAL CONTENT (Spanish):
${content}

TRANSLATION RULES:
- Translate naturally into ${langName}, not word-by-word
- Keep financial/technical terms accurate (gold, silver, platinum, support/resistance levels, etc.)
- Preserve markdown formatting (## headings, **bold**, etc.)
- Keep numbers, prices, and percentages as-is
- Do NOT add or remove content, translate faithfully
- Do NOT include the original Spanish text
- Keep the same tone: professional, analytical, informative

Return ONLY a valid JSON with this exact structure:

{
  "title": "Translated title in ${langName}",
  "excerpt": "Translated excerpt in ${langName}",
  "content": "Translated full content in ${langName} with ## for section headings",
  "slug_keywords": "3-6 translated keywords in ${langName} for the URL slug, separated by spaces, lowercase, no accents, no date. Example for English: 'gold rises geopolitical tensions iran'"
}

Return ONLY the JSON, no additional text.`;

  const raw = await generateText(prompt);
  if (!raw) return null;

  return parseTranslatedResponse(raw);
}

export async function translateArticle(articleId: number): Promise<number> {
  const db = getDb();
  if (!db || !isConfigured()) return 0;

  let translated = 0;

  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!article) return 0;

    for (const locale of TRANSLATION_LOCALES) {
      try {
        const existing = await db
          .select({ id: articleTranslations.id })
          .from(articleTranslations)
          .where(
            and(
              eq(articleTranslations.articleId, articleId),
              eq(articleTranslations.locale, locale)
            )
          )
          .limit(1);

        if (existing.length > 0) continue;

        const result = await translateArticleToLocale(
          article.title,
          article.excerpt ?? "",
          article.content,
          locale
        );

        if (result) {
          const dateSlug = article.slug.match(/\d{4}-\d{2}-\d{2}$/)?.[0] ?? new Date().toISOString().slice(0, 10);
          const translatedSlug = result.slug_keywords
            ? `${slugify(result.slug_keywords)}-${dateSlug}`
            : article.slug;

          await db.insert(articleTranslations).values({
            articleId,
            locale,
            slug: translatedSlug,
            title: result.title,
            excerpt: result.excerpt,
            content: result.content,
          });
          translated++;
          console.log(`Translated article ${articleId} to ${locale}: slug=${translatedSlug}`);
        }
      } catch (err) {
        console.error(`Failed to translate article ${articleId} to ${locale}:`, err);
      }
    }
  } catch (err) {
    console.error(`Failed to translate article ${articleId}:`, err);
  }

  return translated;
}

export async function getArticleTranslation(
  articleId: number,
  locale: string
) {
  if (locale === "es") return null;

  const db = getDb();
  if (!db) return null;

  try {
    const [translation] = await db
      .select()
      .from(articleTranslations)
      .where(
        and(
          eq(articleTranslations.articleId, articleId),
          eq(articleTranslations.locale, locale)
        )
      )
      .limit(1);

    return translation ?? null;
  } catch {
    return null;
  }
}
