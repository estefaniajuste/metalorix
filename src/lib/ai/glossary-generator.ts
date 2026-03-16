import { generateText, isConfigured } from "./gemini";
import { getDb } from "@/lib/db";
import { glossaryTerms } from "@/lib/db/schema";
import { eq, asc, isNull } from "drizzle-orm";
import { getCategoryIds } from "@/lib/data/glossary-categories";

interface TermSummary {
  slug: string;
  term: string;
  category: string | null;
}

async function getAllTermSummaries(): Promise<TermSummary[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        category: glossaryTerms.category,
      })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.published, true))
      .orderBy(asc(glossaryTerms.term));
  } catch {
    return [];
  }
}

function formatTermList(terms: TermSummary[]): string {
  return terms
    .map((t) => `- ${t.term} (slug: ${t.slug}, categoría: ${t.category ?? "sin categoría"})`)
    .join("\n");
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

/**
 * Expand an existing term with a full educational article.
 * Returns the expanded markdown content with inline links to other terms.
 */
export async function generateGlossaryContent(
  term: string,
  definition: string,
  category: string
): Promise<string | null> {
  if (!isConfigured()) return null;

  const existingTerms = await getAllTermSummaries();
  const termListStr = formatTermList(existingTerms);

  const prompt = `Eres un experto en metales preciosos y redactor educativo SEO en español.

TAREA: Escribe un artículo educativo completo sobre "${term}" para una sección de formación sobre metales preciosos.

DEFINICIÓN ACTUAL (úsala como base, no la repitas textualmente):
${definition}

CATEGORÍA: ${category}

INSTRUCCIONES DE CONTENIDO:
- 500-1000 palabras
- Estructura con ## para secciones principales y ### para subsecciones
- Empieza directamente con el contenido (NO repitas el título ni la definición)
- Incluye: explicación detallada, contexto histórico si aplica, relevancia para inversores, ejemplos prácticos
- Tono: profesional, educativo, accesible para inversores de nivel medio
- NO uses primera persona ni "como experto"
- NO incluyas título principal (h1), solo h2 y h3

TERMINOLOGÍA RELACIONADA:
Los siguientes términos existen en nuestra base de conocimiento. Menciónalos cuando sea relevante.

TÉRMINOS DISPONIBLES:
${termListStr}

Devuelve SOLO el contenido en markdown. Sin JSON, sin bloques de código, sin texto antes o después.`;

  return await generateText(prompt);
}

interface GeneratedTerm {
  term: string;
  slug: string;
  definition: string;
  content: string;
  category: string;
  relatedSlugs: string[];
}

/**
 * Generate completely new glossary terms with full content.
 */
export async function generateNewGlossaryTerms(
  count: number,
  category?: string
): Promise<GeneratedTerm[]> {
  if (!isConfigured()) return [];

  const existingTerms = await getAllTermSummaries();
  const existingNames = existingTerms.map((t) => t.term).join(", ");
  const termListStr = formatTermList(existingTerms);
  const categories = getCategoryIds();

  const categoryInstruction = category
    ? `Genera TODOS los términos en la categoría "${category}".`
    : `Distribuye los términos entre estas categorías: ${categories.join(", ")}`;

  const prompt = `Eres un experto en metales preciosos y redactor educativo SEO en español.

TAREA: Genera ${count} términos NUEVOS y ÚNICOS sobre metales preciosos para una enciclopedia educativa.

TÉRMINOS QUE YA EXISTEN (NO los repitas):
${existingNames}

${categoryInstruction}

Para CADA término genera:
1. "term": nombre del término
2. "slug": URL amigable en minúsculas sin acentos (ej: "soporte-resistencia")
3. "definition": definición concisa de 1-3 frases (40-80 palabras)
4. "content": artículo educativo completo de 500-800 palabras con formato markdown (## y ###). NO incluir el título.
5. "category": una de las categorías permitidas
6. "relatedSlugs": array de 1-3 slugs de términos relacionados (existentes o de los nuevos que generes)

CATEGORÍAS PERMITIDAS: ${categories.join(", ")}

TERMINOLOGÍA:
TÉRMINOS EXISTENTES PARA ENLAZAR:
${termListStr}

IDEAS DE TÉRMINOS INTERESANTES (elige los que quieras o inventa otros):
- Conceptos: contango, backwardation, costo de oportunidad, diversificación, correlación, volatilidad
- Mercados: Shanghai Gold Exchange, Tokyo Commodity Exchange, Zurich, Dubai Gold Souk
- Inversión: minería de oro vs inversión directa, monedas de inversión, cuenta de metal, plan de ahorro en oro
- Análisis: soporte/resistencia, RSI, MACD, medias móviles, análisis fundamental
- Macro: política monetaria, QE, tipos de interés, inflación, deflación, crisis financieras
- Minería: proceso de extracción, países productores, costes de producción, impacto ambiental
- Historia: patrón oro, Bretton Woods, Nixon shock, fiebre del oro
- Productos: Krugerrand, Maple Leaf, American Eagle, Filarmónica de Viena, Panda chino

Devuelve un JSON array válido. SOLO el array JSON, sin texto adicional ni bloques de código.

Ejemplo de formato:
[
  {
    "term": "Contango",
    "slug": "contango",
    "definition": "Situación de mercado donde...",
    "content": "## Qué es el contango\\n\\nEl contango es una situación...",
    "category": "mercados-bolsas",
    "relatedSlugs": ["precio-spot-vs-futures", "backwardation"]
  }
]`;

  const raw = await generateText(prompt);
  if (!raw) return [];

  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (t: Record<string, unknown>) =>
          t.term && t.slug && t.definition && t.content && t.category
      )
      .map((t: Record<string, unknown>) => ({
        term: String(t.term),
        slug: slugify(String(t.slug || t.term)),
        definition: String(t.definition),
        content: String(t.content),
        category: String(t.category),
        relatedSlugs: Array.isArray(t.relatedSlugs)
          ? t.relatedSlugs.map(String)
          : [],
      }));
  } catch (err) {
    console.error("Failed to parse generated glossary terms:", err);
    return [];
  }
}

/**
 * Save a generated term to the database.
 */
export async function saveGlossaryTerm(
  term: GeneratedTerm
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    await db
      .insert(glossaryTerms)
      .values({
        slug: term.slug,
        term: term.term,
        locale: "es",
        definition: term.definition,
        content: term.content,
        category: term.category,
        relatedSlugs: term.relatedSlugs,
        published: true,
      })
      .onConflictDoNothing();
    return true;
  } catch (err) {
    console.error(`Failed to save glossary term "${term.term}":`, err);
    return false;
  }
}

/**
 * Expand existing terms that have no content yet.
 */
export async function expandTermsWithoutContent(
  count: number
): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  let expanded = 0;

  try {
    const termsToExpand = await db
      .select()
      .from(glossaryTerms)
      .where(isNull(glossaryTerms.content))
      .limit(count);

    for (const term of termsToExpand) {
      const content = await generateGlossaryContent(
        term.term,
        term.definition,
        term.category ?? "conceptos-basicos"
      );

      if (content) {
        await db
          .update(glossaryTerms)
          .set({ content, updatedAt: new Date() })
          .where(eq(glossaryTerms.id, term.id));
        expanded++;
      }
    }
  } catch (err) {
    console.error("Failed to expand glossary terms:", err);
  }

  return expanded;
}

/**
 * Post-process content to inject links to glossary terms.
 * Scans text for mentions of known terms and wraps them in markdown links.
 * Max 1 link per term per text block.
 */
export async function injectGlossaryLinks(
  content: string
): Promise<string> {
  const terms = await getAllTermSummaries();
  if (terms.length === 0) return content;

  // Sort by term length descending to match longer terms first
  const sortedTerms = [...terms].sort(
    (a, b) => b.term.length - a.term.length
  );

  let result = content;
  const linked = new Set<string>();

  for (const term of sortedTerms) {
    if (linked.has(term.slug)) continue;

    // Skip if the term is already linked in the content
    if (result.includes(`[${term.term}]`)) continue;

    // Case-insensitive match, whole word boundary, not inside existing markdown links
    const escapedTerm = term.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(?<![\\[/])\\b(${escapedTerm})\\b(?![\\]\\(])`,
      "i"
    );
    const match = result.match(regex);

    if (match && match.index !== undefined) {
      const before = result.slice(0, match.index);
      const after = result.slice(match.index + match[0].length);
      result = `${before}[${match[0]}](/learn/glossary/${term.slug})${after}`;
      linked.add(term.slug);
    }
  }

  return result;
}

/**
 * Get the count of published glossary terms.
 */
export async function getGlossaryTermCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const result = await db
      .select({ slug: glossaryTerms.slug })
      .from(glossaryTerms)
      .where(eq(glossaryTerms.published, true));
    return result.length;
  } catch {
    return 0;
  }
}
