import { generateText, isConfigured, type GeminiLog } from "./gemini";
import { getDb } from "@/lib/db";
import { articles, newsSources, metalPrices, glossaryTerms, articleTranslations } from "@/lib/db/schema";
import { desc, gte, eq, asc, and, inArray, like, not } from "drizzle-orm";
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

/** Returns today's morning daily article (non-cierre) if it exists. Used by evening to avoid repetition. */
async function getTodayMorningArticle(): Promise<{ title: string; excerpt: string | null } | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const dateSlug = new Date().toISOString().slice(0, 10);
    const [row] = await db
      .select({ title: articles.title, excerpt: articles.excerpt })
      .from(articles)
      .where(
        and(
          eq(articles.category, "daily"),
          like(articles.slug, `%-${dateSlug}`),
          not(like(articles.slug, "cierre-%"))
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(1);
    return row ? { title: row.title, excerpt: row.excerpt } : null;
  } catch {
    return null;
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
      .limit(30);
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
    .slice(0, 20)
    .map((n) => {
      const sentiment = n.sentiment ? ` [${n.sentiment}]` : "";
      const metals = n.metals?.length ? ` (${n.metals.join(", ")})` : "";
      return `- [${n.source}]${sentiment}${metals} ${n.title}: ${n.summary.slice(0, 400)} (URL: ${n.url})`;
    })
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
    return terms.map((t) => `- ${t.term} → slug: ${t.slug}`).join("\n");
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
Usa estos términos técnicos cuando sea apropiado. Incluye entre 3 y 5 enlaces a términos del glosario en el cuerpo del artículo usando formato markdown: [término visible](/learn/glossary/SLUG-EXACTO). Usa SIEMPRE el slug exacto que aparece después de "→ slug:" en la lista. No inventes slugs. No repitas el mismo enlace más de una vez.

TÉRMINOS DISPONIBLES (formato: nombre → slug: slug-exacto):
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

  const prompt = `Eres el analista principal de Metalorix, una plataforma de referencia en metales preciosos. Tu análisis es lo que hace que los usuarios vuelvan cada día. Escribe en español para inversores hispanohablantes.

Escribe el ANÁLISIS DIARIO del mercado para hoy, ${dateStr}.

TU DIFERENCIAL: No eres un servicio de noticias genérico. Eres un analista que CONECTA puntos que otros no ven. Tu análisis debe responder: "¿Qué está pasando REALMENTE y por qué debería importarme como inversor?"

DATOS DE PRECIOS ACTUALES:
${formatPrices(prices)}

NOTICIAS RELEVANTES DE LAS ÚLTIMAS 24H:
${formatNews(news)}

REGLAS DE CONTENIDO ANALÍTICO (OBLIGATORIAS):

1. PROFUNDIDAD, NO SUPERFICIE:
   - MAL: "El oro sube por tensiones geopolíticas"
   - BIEN: "El oro rompe los $4.800 tras el bloqueo marítimo en el estrecho de Ormuz. Irán interceptó dos petroleros el miércoles, lo que dispara el riesgo de interrupción del 21% del suministro mundial de crudo. Los fondos de cobertura han aumentado sus posiciones largas en oro un 12% esta semana según datos CFTC"
   - MAL: "La plata sube por demanda industrial"
   - BIEN: "La plata toca $76 impulsada por la expansión de capacidad solar en China: BYD acaba de anunciar 40 GW de nuevas instalaciones para 2026, lo que requiere ~1.200 toneladas de plata industrial. Esto suma presión a un mercado que ya lleva 3 años de déficit estructural según el Silver Institute"

2. DATOS CONCRETOS OBLIGATORIOS en cada sección:
   - Precios exactos con variación y comparativa (ej: "máximo de 3 semanas", "por debajo de la media de 50 sesiones")
   - Cifras de fuentes: toneladas, millones de dólares, porcentajes, fechas
   - Nombres propios: quién dijo qué, qué banco, qué gobierno, qué empresa
   - Niveles técnicos: soporte, resistencia, medias móviles relevantes

3. CONEXIONES ENTRE MERCADOS que el inversor minorista no ve:
   - Ratio oro/plata y qué indica cuando sube o baja
   - Relación DXY (dólar) con metales
   - Flujos de ETFs (GLD, SLV, PPLT) como indicador de sentimiento institucional
   - Spread entre futuros y spot como señal de tensión
   - Compras de bancos centrales (China, India, Turquía, Polonia) con cifras

4. ESTRUCTURA:
   - Párrafo de apertura: el dato/evento MÁS impactante del día, con cifras
   - ## Oro — análisis con datos, niveles, drivers
   - ## Plata — análisis con datos, correlaciones
   - ## Platino y Paladio — si hay algo relevante (si no, breve)
   - ## Contexto Macro y Geopolítico — cómo afectan los eventos del día
   - ## Qué Vigilar — eventos concretos de las próximas 24-48h con fechas

5. TONO: Informativo-analítico. Como un informe de morning briefing de un banco de inversión, pero accesible. No académico, no genérico, no repetitivo.

6. LONGITUD: 600-800 palabras. Sin relleno.

7. FORMATO: ## para secciones. Párrafos normales. Sin markdown excesivo.
   - NO incluyas título ni fecha al inicio
   - NO uses primera persona ni "como analista"
   - NO insertes enlaces externos (URLs http/https) en el cuerpo. Fuentes como texto plano.
   - Los ÚNICOS enlaces permitidos son internos al glosario: [término](/learn/glossary/slug)
${glossaryInstructions}

INSTRUCCIONES SEO Y FUENTES:
Devuelve JSON con esta estructura exacta:

{
  "titulo_seo": "Título 50-65 caracteres. DATO CONCRETO + CAUSA ESPECÍFICA. Ejemplos: 'Oro rompe $4.800: bloqueo de Ormuz dispara la demanda de refugio', 'Plata a $76 por expansión solar de BYD y déficit de mercado', 'Fed mantiene tipos: oro estable en $4.790 esperando datos de empleo'. NUNCA genéricos tipo 'Resumen del mercado' o 'Análisis diario'.",
  "meta_descripcion": "140-155 caracteres. Dato impactante + causa + utilidad. Ejemplo: 'Oro toca $4.800 (+1.2%) tras el bloqueo de Ormuz. Analizamos niveles clave, flujos de ETFs y qué vigilar mañana.'",
  "palabras_clave_url": "3-6 palabras para URL sin fecha. Ejemplo: 'oro rompe 4800 bloqueo ormuz' o 'plata sube deficit solar byd'",
  "contenido": "Artículo completo (600-800 palabras). SIN fuentes aquí.",
  "fuentes": [{"titulo": "Título descriptivo", "url": "URL completa"}]
}

Fuentes: mínimo 2, máximo 6. Usa las URLs de las noticias proporcionadas.
Devuelve SOLO el JSON.`;

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

/** Sunday evening: perspectivas fin de semana. More informative, less price-focused. Markets were closed. */
async function generateSundayEveningArticle(
  prices: PriceData[],
  news: NewsItem[],
  dateStr: string,
  dateSlug: string,
  glossaryInstructions: string,
  log?: DailyGenerationLog
): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
}> {
  const prompt = `Eres un analista experto en metales preciosos, macroeconomía y geopolítica que escribe en español para inversores hispanohablantes.

Es DOMINGO por la tarde, ${dateStr}. Los mercados han estado cerrados desde el viernes. Las fuentes de noticias suelen publicar poco en fin de semana.

Escribe un artículo de PERSPECTIVAS Y CONTEXTO para la semana que comienza mañana. NO es un resumen de sesión (no hubo sesión). Debe ser MÁS INFORMATIVO e INTERESANTE que un simple "oro sube/plata baja":
- Perspectivas para la semana: qué eventos clave hay (Fed, BCE, datos macro, cumbres)
- Contexto geopolítico: tensiones, sanciones, relaciones que puedan afectar a los metales
- Análisis educativo: por qué importa un dato, cómo interpretar indicadores
- Niveles de referencia: dónde cerró el viernes cada metal (para contexto)
- Qué vigilar: eventos concretos de la semana con fechas si es posible
- Si hay pocas noticias nuevas, escribe sobre tendencias, ratios, o temas de fondo que interesen a quien invierte

EVITA: repetir el mismo análisis que el sábado o el viernes. Si no hay novedades, ofrece valor con análisis, perspectivas o educación.

NIVELES DE CIERRE DEL VIERNES (referencia):
${formatPrices(prices)}

NOTICIAS DEL FIN DE SEMANA (si hay pocas, usa contexto general):
${formatNews(news)}

INSTRUCCIONES:
- 350-500 palabras. Conciso pero con valor.
- Estructura: ## para secciones (Perspectivas, Contexto, Qué vigilar, Niveles de referencia)
- Tono: informativo, útil, NO repetitivo
- NO incluyas título ni fecha al inicio
- CRÍTICO: NO insertes enlaces externos. Solo enlaces internos al glosario: [término](/learn/glossary/slug).
${glossaryInstructions}

Devuelve JSON:
{
  "titulo_seo": "Título (50-65 caracteres). Ejemplos: 'Qué vigilar esta semana: Fed, datos China y oro', 'Perspectivas metales: eventos clave del 24-28 marzo', 'Oro en $2.650: contexto y qué esperar esta semana'.",
  "meta_descripcion": "Meta (140-155 caracteres). Perspectivas + qué vigilar + valor para el lector.",
  "palabras_clave_url": "3-6 palabras. Ejemplo: 'perspectivas semana metales marzo' o 'qué vigilar oro fed'.",
  "contenido": "Artículo completo. NO incluyas fuentes en el cuerpo.",
  "fuentes": [{"titulo": "...", "url": "..."}]
}

Mínimo 2 fuentes, máximo 5. Devuelve SOLO el JSON.`;

  const raw = await generateText(prompt, { retryOnEmpty: true, log: (e) => { if (log) log.geminiLog = e; } });
  if (!raw) return buildMinimalEveningArticle(prices, dateStr, dateSlug);

  const parsed = parseStructuredResponse(raw);
  if (parsed) {
    if (log) log.parseSuccess = true;
    const keywordSlug = slugify(parsed.palabras_clave_url);
    return {
      slug: `cierre-${keywordSlug}-${dateSlug}`,
      title: parsed.titulo_seo,
      excerpt: parsed.meta_descripcion,
      content: appendSources(parsed.contenido.trim(), parsed.fuentes ?? []),
      metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
    };
  }

  return buildMinimalEveningArticle(prices, dateStr, dateSlug);
}

/** Evening summary: session close recap. Different from daily (morning). Slug prefixed with "cierre-" to avoid collision. */
export async function generateEveningSummary(log?: DailyGenerationLog): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
}> {
  const today = new Date();
  const dateStr = formatDate(today);
  const dateSlug = today.toISOString().slice(0, 10);
  const isSunday = today.getDay() === 0;

  const prices = await getPricesWithFallback();
  const news = await getRecentNews(isSunday ? 48 : 12);
  const morningArticle = isSunday ? null : await getTodayMorningArticle();

  if (log) {
    log.pricesCount = prices.length;
    log.newsCount = news.length;
  }
  console.log(`[ContentGenerator] generateEveningSummary: isSunday=${isSunday}, prices=${prices.length}, news=${news.length}, morningArticle=${!!morningArticle}`);

  if (!isConfigured()) {
    console.warn("[ContentGenerator] Gemini not configured, using minimal evening article");
    if (log) log.usedFallback = "minimal";
    return buildMinimalEveningArticle(prices, dateStr, dateSlug);
  }

  const glossaryContext = await getGlossaryTermsForPrompt();
  const glossaryInstructions = buildGlossaryLinkingInstructions(glossaryContext);

  if (isSunday) {
    return generateSundayEveningArticle(prices, news, dateStr, dateSlug, glossaryInstructions, log);
  }

  const morningContext = morningArticle
    ? `
CRÍTICO - EVITA REPETIR:
Ya se publicó un resumen MATINAL hoy con este enfoque:
- Título: "${morningArticle.title}"
- Resumen: ${morningArticle.excerpt ?? "(sin excerpt)"}

Tu artículo de CIERRE debe ser CLARAMENTE DISTINTO. NO repitas el mismo análisis ni las mismas frases.
- Enfócate en lo que ha pasado DESPUÉS del resumen matinal: movimientos intradía, datos macro publicados por la tarde, reacción del mercado a noticias que llegaron en la sesión.
- Si las noticias son las mismas que esta mañana y no hubo desarrollos nuevos, escribe un cierre más breve destacando los niveles de cierre y la evolución intradía. No reescribas el mismo contenido.
`
    : "";

  const prompt = `Eres el analista principal de Metalorix. Escribe el CIERRE DE SESIÓN del mercado de metales para hoy, ${dateStr}. Se publica tras el cierre de NY/Londres.
${morningContext}

DATOS DE PRECIOS AL CIERRE:
${formatPrices(prices)}

NOTICIAS DE LAS ÚLTIMAS 12H:
${formatNews(news)}

REGLAS DE CONTENIDO:

1. FOCO: Qué pasó DURANTE la sesión que el inversor necesita saber. No repitas el análisis matinal.

2. PROFUNDIDAD OBLIGATORIA:
   - Cada movimiento de precio debe tener una CAUSA CONCRETA con nombres, cifras, fechas
   - Si el oro cayó 0.5%, explica POR QUÉ exactamente: ¿dato de empleo? ¿declaración de qué miembro de la Fed? ¿ventas de ETF GLD? ¿fortaleza del DXY?
   - Incluye volumen, flujos de ETFs, posiciones CFTC si las noticias los mencionan
   - Niveles intradía: máximo/mínimo de sesión, donde cerró respecto a soportes/resistencias

3. ESTRUCTURA:
   - Párrafo resumen: lo más impactante de la sesión con cifra y causa
   - ## Cierre por Metal — niveles, variación intradía, causa
   - ## Motor de la Sesión — el evento o dato que marcó la jornada
   - ## Mañana — qué vigilar con hora/fecha si es posible (datos macro, comparecencias, vencimientos)

4. LONGITUD: 400-550 palabras. Conciso pero con sustancia. Si no hay novedades, 250-350 palabras focalizadas en evolución intradía.

5. TONO: Directo, útil, analítico. Como un cierre de Bloomberg, no un parte meteorológico.
   - NO incluyas título ni fecha al inicio
   - NO uses primera persona
   - NO insertes enlaces externos en el cuerpo. Solo glosario: [término](/learn/glossary/slug)
${glossaryInstructions}

Devuelve JSON:
{
  "titulo_seo": "50-65 chars. Precio cierre + causa. Ej: 'Oro cierra en $4.790 (-0.5%): dato de empleo supera expectativas', 'Plata pierde $76 al cierre tras ventas de ETF SLV'. NUNCA genéricos.",
  "meta_descripcion": "140-155 chars. Cierre + causa + qué vigilar mañana.",
  "palabras_clave_url": "3-6 palabras. Incluye 'cierre' para diferenciar del matinal.",
  "contenido": "Artículo completo. SIN fuentes aquí.",
  "fuentes": [{"titulo": "...", "url": "..."}]
}

Fuentes: 2-5. Devuelve SOLO JSON.`;

  const promptSize = new TextEncoder().encode(prompt).length;
  if (log) log.promptSizeBytes = promptSize;

  const raw = await generateText(prompt, {
    retryOnEmpty: true,
    log: (entry) => {
      if (log) log.geminiLog = entry;
    },
  });

  if (!raw) {
    if (log) log.usedFallback = "minimal";
    return buildMinimalEveningArticle(prices, dateStr, dateSlug);
  }

  const parsed = parseStructuredResponse(raw);

  if (parsed) {
    if (log) log.parseSuccess = true;
    const keywordSlug = slugify(parsed.palabras_clave_url);
    const slug = `cierre-${keywordSlug}-${dateSlug}`;
    console.log(`[ContentGenerator] Parsed evening JSON, slug: ${slug}`);
    return {
      slug,
      title: parsed.titulo_seo,
      excerpt: parsed.meta_descripcion,
      content: appendSources(parsed.contenido.trim(), parsed.fuentes),
      metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
    };
  }

  if (log) log.parseSuccess = false;
  const fallbackSlug = `cierre-sesion-metales-${dateSlug}`;
  const fallbackTitle = `Cierre de sesión — Metales preciosos ${dateStr}`;
  const oro = prices.find((p) => p.symbol === "XAU");
  const fallbackExcerpt = `Oro cierra a $${oro?.price.toFixed(0) ?? "N/A"}, Plata a $${prices.find((p) => p.symbol === "XAG")?.price.toFixed(2) ?? "N/A"}. Resumen de la sesión.`;

  return {
    slug: fallbackSlug,
    title: fallbackTitle,
    excerpt: fallbackExcerpt,
    content: raw.trim(),
    metals: ["XAU", "XAG", "XPT", "XPD", "HG"],
  };
}

function buildMinimalEveningArticle(
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
  const daily = buildMinimalDailyArticle(prices, dateStr, dateSlug);
  return {
    ...daily,
    slug: `cierre-sesion-metales-${dateSlug}`,
    title: `Cierre de sesión — Metales preciosos ${dateStr}`,
  };
}

const HIGH_IMPACT_PATTERNS = [
  /\b(central bank|banco central|banque centrale).{0,40}(buy|bought|purchase|compra|gold|oro|reserve)/i,
  /\b(repatri|traslad|transport).{0,30}(gold|oro|reserv)/i,
  /\b(sanction|embargo|tariff|arancel).{0,30}(metal|gold|silver|oro|plata|import|export)/i,
  /\b(BRICS|de-dollar|dedollar|new currency|moneda).{0,30}(gold|oro|back|respald)/i,
  /\b(mine|mina).{0,20}(clos|shut|halt|suspend|cerr|parali)/i,
  /\b(strike|huelga).{0,20}(min|metal|gold|silver|platinum|copper)/i,
  /\b(record|récord|historic|máximo|all[- ]time high|new high).{0,30}(gold|silver|platinum|palladium|copper|oro|plata)/i,
  /\b(rate cut|rate hike|tipos? de interés|interest rate).{0,20}(fed|ecb|bce|boj|pboc)/i,
  /\b(war|guerra|invasion|invasi|attack|missile|nuclear).{0,30}(iran|russia|china|taiwan|korea|israel|ukraine)/i,
  /\b(default|quiebra|bankruptcy|crisis)\b.{0,20}(sovereign|bank|credit|deuda|debt)/i,
  /\b(etf|GLD|SLV|PPLT).{0,20}(record|billion|inflow|outflow|récord|mil millones)/i,
  /\b(basel|regulation|regulaci).{0,20}(gold|tier|metal|bank)/i,
];

export function detectHighImpactNews(
  news: { title: string; summary: string; url: string; source: string }[]
): { title: string; summary: string; url: string; source: string; matchedPatterns: string[] }[] {
  const hits: typeof news & { matchedPatterns: string[] }[] = [];
  for (const item of news) {
    const text = `${item.title} ${item.summary}`;
    const matched: string[] = [];
    for (const p of HIGH_IMPACT_PATTERNS) {
      if (p.test(text)) matched.push(p.source.slice(0, 60));
    }
    if (matched.length >= 1) {
      hits.push({ ...item, matchedPatterns: matched });
    }
  }
  return hits.sort((a, b) => b.matchedPatterns.length - a.matchedPatterns.length);
}

export async function generateNewsEventArticle(
  topNews: { title: string; summary: string; url: string; source: string }[],
  allNews: NewsItem[],
  prices: PriceData[]
): Promise<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metals: string[];
} | null> {
  if (!isConfigured()) return null;

  const today = new Date();
  const dateStr = formatDate(today);
  const dateSlug = today.toISOString().slice(0, 10);
  const glossaryContext = await getGlossaryTermsForPrompt();
  const glossaryInstructions = buildGlossaryLinkingInstructions(glossaryContext);

  const newsContext = topNews
    .map((n) => `- [${n.source}] ${n.title}: ${n.summary.slice(0, 500)} (URL: ${n.url})`)
    .join("\n");

  const prompt = `Eres el analista principal de Metalorix. Una o varias noticias de ALTO IMPACTO acaban de llegar. Escribe un ARTÍCULO DE ÚLTIMA HORA.

FECHA: ${dateStr}

NOTICIAS DE ALTO IMPACTO:
${newsContext}

CONTEXTO DE PRECIOS:
${formatPrices(prices)}

OTRAS NOTICIAS RECIENTES:
${formatNews(allNews.slice(0, 10))}

REGLAS:

1. ESTE NO ES un artículo de precio. Es un artículo sobre un EVENTO IMPORTANTE del mundo de los metales preciosos. Ejemplos:
   - Francia repatría su oro de EE.UU. — qué significa para la geopolítica del oro
   - China compra 50 toneladas de oro en un mes — implicaciones para el mercado
   - Nueva regulación de Basilea III reclasifica el oro como activo Tier 1
   - Huelga masiva en minas sudafricanas paraliza producción de platino
   - BRICS anuncia nuevo sistema de pagos respaldado por oro

2. PROFUNDIDAD OBLIGATORIA:
   - Contexto histórico: ¿cuándo fue la última vez que ocurrió algo similar?
   - Implicaciones para el mercado: ¿cómo afecta a precios, oferta, demanda?
   - Dimensión geopolítica: ¿qué dice esto sobre las relaciones entre países?
   - Perspectiva del inversor: ¿qué debe hacer quien tiene oro/plata?

3. ESTRUCTURA:
   - Párrafo de apertura impactante con el dato clave
   - ## Qué Ha Ocurrido — los hechos con detalle
   - ## Por Qué Es Importante — contexto e implicaciones
   - ## Impacto en el Mercado — cómo afecta a precios y posicionamiento
   - ## Qué Vigilar — próximos pasos, reacciones esperadas

4. 500-700 palabras. Tono: urgente pero analítico. No sensacionalista.
   - NO incluyas título ni fecha al inicio
   - NO uses primera persona
   - NO enlaces externos. Solo glosario: [término](/learn/glossary/slug)
${glossaryInstructions}

Devuelve JSON:
{
  "titulo_seo": "50-65 chars. EVENTO + IMPACTO. Ej: 'Francia repatría su oro de EE.UU.: qué significa para Europa', 'China compra récord de 50t de oro en marzo 2026'. NUNCA genérico.",
  "meta_descripcion": "140-155 chars.",
  "palabras_clave_url": "3-6 palabras sin fecha.",
  "contenido": "Artículo completo. SIN fuentes aquí.",
  "fuentes": [{"titulo": "...", "url": "..."}]
}

Fuentes: 2-5. Devuelve SOLO JSON.`;

  const raw = await generateText(prompt);
  if (!raw) return null;

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

  return null;
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

  const prompt = `Eres el analista principal de Metalorix. ALERTA: ${metalName} ${direction} un ${absChange}% hoy (${dateStr}). Movimiento excepcional.
Precio actual: $${price.toFixed(2)} USD/oz

NOTICIAS RECIENTES:
${formatNews(news)}

REGLAS DE CONTENIDO (OBLIGATORIAS):

1. EXPLICA LA CAUSA REAL con detalle:
   - Qué evento específico disparó el movimiento (nombre, fecha, cifra)
   - Quién lo provocó (qué gobierno, banco central, empresa, dato)
   - Cómo se transmitió al mercado (vía dólar, vía tipos reales, vía demanda física, vía ETFs)

2. CONTEXTO QUE OTROS NO DAN:
   - ¿Es este nivel un máximo/mínimo de cuánto tiempo?
   - ¿Cuándo fue la última vez que ${metalName.toLowerCase()} se movió así y qué pasó después?
   - ¿Qué están haciendo los grandes (CFTC net longs, flujos de GLD/SLV, compras de bancos centrales)?
   - ¿Cómo se compara con otros metales? ¿El movimiento es aislado o coordinado?

3. IMPLICACIONES PRÁCTICAS para el inversor:
   - Niveles clave: soporte, resistencia, medias móviles a vigilar
   - Escenarios: qué pasa si continúa, qué pasa si revierte
   - Próximos catalizadores (datos, eventos, vencimientos)

4. ESTRUCTURA:
   - Párrafo de apertura: qué pasó, cifra, causa en 2-3 frases impactantes
   - ## Qué Ha Provocado el Movimiento
   - ## Niveles Técnicos y Perspectiva
   - ## Qué Vigilar Ahora

5. 450-600 palabras. Sin relleno. Cada frase aporta valor.
   - NO incluyas título. NO uses primera persona.
   - NO enlaces externos en el cuerpo. Solo glosario: [término](/learn/glossary/slug)
${glossaryInstructions}

Devuelve JSON:
{
  "titulo_seo": "50-65 chars. ${metalName} + movimiento + causa específica. NUNCA genérico.",
  "meta_descripcion": "140-155 chars. Precio + variación + causa + qué hacer.",
  "palabras_clave_url": "3-6 palabras relevantes sin fecha.",
  "contenido": "Artículo completo. SIN fuentes aquí.",
  "fuentes": [{"titulo": "...", "url": "..."}]
}

Fuentes: 2-5. Devuelve SOLO JSON.`;

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

  const prompt = `Eres el analista principal de Metalorix. Escribe el INFORME SEMANAL del mercado de metales preciosos.
Semana: ${weekRange}

PRECIOS ACTUALES (cierre semanal):
${formatPrices(prices)}

NOTICIAS DE LA SEMANA:
${formatNews(news)}

REGLAS DE CONTENIDO (OBLIGATORIAS):

1. VISIÓN ESTRATÉGICA, NO RESUMEN DE TITULARES:
   - El semanal debe dar perspectiva que el día a día no puede: tendencias, cambios estructurales, rotaciones
   - Identifica el TEMA DOMINANTE de la semana (no solo precios): ¿fue la Fed? ¿China? ¿geopolítica? ¿demanda industrial?
   - Compara: ¿la semana fue consistente con la tendencia mensual o hubo ruptura?

2. DATOS CONCRETOS en cada sección:
   - Variación semanal por metal (%) y comparativa con semana anterior
   - Ratio oro/plata actual y tendencia
   - Flujos de ETFs si las noticias los mencionan
   - Compras de bancos centrales (quién, cuánto, contexto)
   - Niveles técnicos: soportes, resistencias, medias de 50 y 200 sesiones
   - Datos macro clave publicados esta semana con cifras

3. ESTRUCTURA:
   - ## Resumen Ejecutivo — qué dominó la semana, en 3-4 frases con datos
   - ## Oro — análisis con niveles, drivers, flujos
   - ## Plata — correlación con oro, demanda industrial, ratio
   - ## Platino y Paladio — si relevante
   - ## Macro y Geopolítica — eventos de la semana que movieron mercados
   - ## Próxima Semana — eventos clave con FECHAS (reuniones Fed/BCE, datos macro, vencimientos, discursos)

4. 800-1000 palabras. Cada párrafo debe aportar un dato, insight o conexión nueva.

5. TONO: Informe estratégico de calidad institucional, accesible para inversores minoristas.
   - NO incluyas título. NO uses primera persona.
   - NO enlaces externos en el cuerpo. Solo glosario: [término](/learn/glossary/slug)
${glossaryInstructions}

Devuelve JSON:
{
  "titulo_seo": "50-65 chars. Resultado semanal con dato concreto. Ej: 'Oro +3% en la semana: China compra 50t y la Fed pausa tipos'. NUNCA genérico.",
  "meta_descripcion": "140-155 chars. Variaciones semanales + tema dominante + próxima semana.",
  "palabras_clave_url": "3-6 palabras sin fecha.",
  "contenido": "Informe completo (800-1000 palabras). SIN fuentes aquí.",
  "fuentes": [{"titulo": "...", "url": "..."}]
}

Fuentes: 3-8. Devuelve SOLO JSON.`;

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

const TRANSLATION_LOCALES = ["en", "zh", "ar", "tr", "de", "hi"] as const;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ar: "Arabic",
  tr: "Turkish",
  de: "German",
  hi: "Hindi",
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

  // Slug must match content language (i18n rule). For zh/ar/hi use English (Latin chars). For en/de/tr use target language.
  const slugInstruction =
    targetLocale === "zh" || targetLocale === "ar" || targetLocale === "hi"
      ? "3-6 keywords in ENGLISH (Latin alphabet only) for the URL slug, separated by spaces, lowercase, no accents, no special characters, no date. Example: 'gold rises geopolitical tensions iran'. Use English because non-Latin scripts are not suitable for URLs."
      : `3-6 keywords in ${langName} for the URL slug, separated by spaces, lowercase, Latin alphabet only, no accents, no special characters, no date. Example for English: 'gold rises geopolitical tensions iran'. Example for German: 'edelmetalle rueckgang iran inflation'. Example for Turkish: 'altin gumus dusus iran gerilim'. CRITICAL: The slug MUST be in ${langName}, matching the page content language.`;

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
- CRITICAL: Do NOT add any external hyperlinks (http/https URLs) inline in the article body. If the original has inline links like [text](https://...), convert them to plain text (just the text, no link). External links should ONLY appear in the Sources/Fuentes section at the end.
- Preserve internal glossary links like [term](/learn/glossary/slug) as-is — do NOT remove those

Return ONLY a valid JSON with this exact structure:

{
  "title": "Translated title in ${langName} (50-65 chars). Keep concrete data (prices, %), cause, and CTR appeal. Do NOT make it generic.",
  "excerpt": "Translated excerpt in ${langName} (140-155 chars). Keep numbers and the hook that invites clicks.",
  "content": "Translated full content in ${langName} with ## for section headings",
  "slug_keywords": "${slugInstruction}"
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
          const keywordSlug = result.slug_keywords ? slugify(result.slug_keywords) : "";
          let translatedSlug: string;
          if (keywordSlug) {
            translatedSlug = `${keywordSlug}-${dateSlug}`;
          } else {
            // Non-Latin locales: use English translation slug if available
            const [enTrans] = await db
              .select({ slug: articleTranslations.slug })
              .from(articleTranslations)
              .where(
                and(
                  eq(articleTranslations.articleId, articleId),
                  eq(articleTranslations.locale, "en")
                )
              )
              .limit(1);
            translatedSlug = enTrans?.slug || article.slug;
            console.log(`[translate] ${locale}: non-Latin keywords, using ${enTrans?.slug ? "EN" : "base"} slug: ${translatedSlug}`);
          }

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

/** Spanish keywords that indicate wrong-language slug in en/de/tr */
const SPANISH_SLUG_PATTERNS = /\b(metales|preciosos|tensiones|sube|baja|caida|conflicto|oro|plata|platino|paladio|inflacion|mercado|precio|noticias|resumen|semanal|diario)\b/;

function getKeywordPart(slug: string): string {
  return slug.replace(/-\d{4}-\d{2}-\d{2}$/, "").toLowerCase();
}

/** Fix article_translations where en/de/tr use Spanish slug instead of localized. */
export async function fixArticleTranslationSlugs(): Promise<number> {
  const db = getDb();
  if (!db || !isConfigured()) return 0;

  let updated = 0;
  try {
    const allRows = await db
      .select({
        id: articleTranslations.id,
        articleId: articleTranslations.articleId,
        locale: articleTranslations.locale,
        title: articleTranslations.title,
        slug: articleTranslations.slug,
      })
      .from(articleTranslations)
      .where(inArray(articleTranslations.locale, ["en", "de", "tr"]));

    const baseSlugMap = new Map(
      (await db.select({ id: articles.id, slug: articles.slug }).from(articles)).map((a) => [
        a.id,
        a.slug,
      ])
    );

    const TARGET_LOCALES = ["en", "de", "tr"] as const;
    const LANG_NAMES: Record<string, string> = { en: "English", de: "German", tr: "Turkish" };

    for (const row of allRows) {
      if (!TARGET_LOCALES.includes(row.locale as any)) continue;
      if (!row.slug || !row.title) continue;

      const baseSlug = baseSlugMap.get(row.articleId) ?? "";
      const baseKw = getKeywordPart(baseSlug);
      const trKw = getKeywordPart(row.slug);

      const usesBaseSlug = trKw === baseKw;
      const hasSpanishPattern = SPANISH_SLUG_PATTERNS.test(row.slug);
      if (!usesBaseSlug && !hasSpanishPattern) continue;

      const langName = LANG_NAMES[row.locale];
      if (!langName) continue;

      const prompt = `Given this ${langName} article title about precious metals, return 3-6 keywords for a URL slug.
Title: "${row.title}"
Return ONLY valid JSON: {"slug_keywords": "keyword1 keyword2 keyword3"}
Keywords: lowercase, ${langName}, no date, no accents, hyphen-safe.`;

      try {
        const raw = await generateText(prompt);
        if (!raw) continue;
        const m = raw.match(/\{\s*"slug_keywords"\s*:\s*"([^"]+)"\s*\}/);
        const keywords = m?.[1]?.trim();
        if (!keywords) continue;

        const keywordSlug = slugify(keywords);
        if (!keywordSlug) continue;

        const dateMatch = baseSlug.match(/\d{4}-\d{2}-\d{2}$/);
        const dateSlug = dateMatch ? dateMatch[0] : new Date().toISOString().slice(0, 10);
        const newSlug = `${keywordSlug}-${dateSlug}`;

        await db
          .update(articleTranslations)
          .set({ slug: newSlug })
          .where(eq(articleTranslations.id, row.id));

        updated++;
        console.log(`[FixSlug] ${row.locale} article ${row.articleId}: ${row.slug} -> ${newSlug}`);
      } catch (err) {
        console.error(`[FixSlug] Failed for ${row.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[FixSlug] Error:", err);
  }
  return updated;
}

export async function backfillTranslationSlugs(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  let updated = 0;
  try {
    const rows = await db
      .select({
        id: articleTranslations.id,
        articleId: articleTranslations.articleId,
        locale: articleTranslations.locale,
        title: articleTranslations.title,
        slug: articleTranslations.slug,
      })
      .from(articleTranslations);

    const baseArticles = await db
      .select({ id: articles.id, slug: articles.slug })
      .from(articles);
    const baseSlugMap = new Map(baseArticles.map((a) => [a.id, a.slug]));

    // Build map of English slugs per article for non-Latin locale fallback
    const enSlugMap = new Map<number, string>();
    for (const row of rows) {
      if (row.locale === "en" && row.slug) enSlugMap.set(row.articleId, row.slug);
    }

    for (const row of rows) {
      const isBrokenSlug = !row.slug || /^-?\d{4}-\d{2}-\d{2}$/.test(row.slug);
      if (row.slug && !isBrokenSlug) continue;
      const baseSlug = baseSlugMap.get(row.articleId) ?? "";
      const dateMatch = baseSlug.match(/\d{4}-\d{2}-\d{2}$/);
      const dateSlug = dateMatch ? dateMatch[0] : new Date().toISOString().slice(0, 10);
      const titleSlug = slugify(row.title);

      let newSlug: string;
      if (titleSlug) {
        newSlug = `${titleSlug}-${dateSlug}`;
      } else {
        // Non-Latin locales (zh, ar): use English slug if available, else base slug
        const enSlug = enSlugMap.get(row.articleId);
        newSlug = enSlug || baseSlug;
        console.log(`[Backfill] ${row.id} (${row.locale}): non-Latin title, using ${enSlug ? "EN" : "base"} slug: ${newSlug}`);
      }

      await db
        .update(articleTranslations)
        .set({ slug: newSlug })
        .where(eq(articleTranslations.id, row.id));
      updated++;
      console.log(`[Backfill] article_translation ${row.id} (${row.locale}): ${newSlug}`);
    }
  } catch (err) {
    console.error("[Backfill] Error:", err);
  }
  return updated;
}
