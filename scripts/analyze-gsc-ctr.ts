/**
 * Analyze GSC Pages export to find high-impression, low-CTR pages for SEO optimization.
 * Run: npx tsx scripts/analyze-gsc-ctr.ts [path/to/Páginas.csv]
 * Output: Pages with high impressions and 0 or low clicks, sorted by priority.
 * CSV expected columns (Spanish or English): Page/Página, Impressions/Impresiones, Clicks/Clics, CTR, Position/Posición
 */
import { readFileSync } from "fs";
import { resolve } from "path";

interface GscRow {
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

function parseCsv(filePath: string): GscRow[] {
  const raw = readFileSync(resolve(process.cwd(), filePath), "utf-8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const col = (name: string, alt?: string) => {
    const idx = lines[0].split(",").findIndex((c) => {
      const l = c.trim().toLowerCase();
      return l === name || l === alt || l.includes(name) || (alt && l.includes(alt));
    });
    return idx >= 0 ? idx : -1;
  };

  const pageIdx =
    lines[0].split(",").findIndex((c) => /^(page|página|url)$/i.test(c.trim())) ?? 0;
  const impIdx =
    lines[0].split(",").findIndex((c) => /^(impressions|impresiones)$/i.test(c.trim())) ?? 1;
  const clickIdx =
    lines[0].split(",").findIndex((c) => /^(clicks|clics)$/i.test(c.trim())) ?? 2;
  const ctrIdx = lines[0].split(",").findIndex((c) => /^ctr$/i.test(c.trim())) ?? 3;
  const posIdx =
    lines[0].split(",").findIndex((c) => /^(position|posición|position\.1)$/i.test(c.trim())) ?? 4;

  const rows: GscRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    const page = parts[pageIdx]?.trim() ?? "";
    const impressions = parseInt(parts[impIdx]?.replace(/[^\d.]/g, "") ?? "0", 10) || 0;
    const clicks = parseInt(parts[clickIdx]?.replace(/[^\d.]/g, "") ?? "0", 10) || 0;
    const ctr = parseFloat(parts[ctrIdx]?.replace(",", ".") ?? "0") || 0;
    const position = parseFloat(parts[posIdx]?.replace(",", ".") ?? "0") || 0;

    if (page && page.startsWith("http")) {
      rows.push({ page, impressions, clicks, ctr, position });
    }
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || (c === ";" && !inQuotes)) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

function extractSlug(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname;
    const match = path.match(/\/learn\/[^/]+\/([^/]+)/) || path.match(/\/([^/]+)\/?$/);
    return match ? match[1] : path;
  } catch {
    return url;
  }
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.log("Usage: npx tsx scripts/analyze-gsc-ctr.ts <path/to/Páginas.csv>");
    console.log("\nExport from GSC: Performance > Pages > Export > CSV");
    process.exit(1);
  }

  const rows = parseCsv(file);
  if (rows.length === 0) {
    console.error("No valid rows found. Check CSV format.");
    process.exit(1);
  }

  // Filter: Learn pages with impressions >= 50 and clicks < 5 (or CTR < 1%)
  const candidates = rows
    .filter((r) => {
      const isLearn = r.page.includes("/learn/");
      const hasImpressions = r.impressions >= 50;
      const lowCtr = r.clicks < 5 || r.ctr < 1;
      return isLearn && hasImpressions && lowCtr;
    })
    .map((r) => ({
      ...r,
      slug: extractSlug(r.page),
    }))
    .sort((a, b) => b.impressions - a.impressions);

  console.log("\n=== GSC CTR Optimization Candidates (Learn pages) ===\n");
  console.log("Pages with impressions ≥ 50 and clicks < 5 or CTR < 1%\n");

  for (const r of candidates.slice(0, 30)) {
    console.log(`Slug: ${r.slug}`);
    console.log(`  Impressions: ${r.impressions} | Clicks: ${r.clicks} | CTR: ${r.ctr}% | Pos: ${r.position}`);
    console.log(`  URL: ${r.page}\n`);
  }

  if (candidates.length > 30) {
    console.log(`... and ${candidates.length - 30} more. Total: ${candidates.length}`);
  }

  console.log("\nNext step: Add slugs to docs/SEO-UPDATES-EXAMPLE.json with new seoTitle/metaDescription,");
  console.log("then run: npx tsx scripts/update-learn-seo.ts docs/your-updates.json");
}

main();
