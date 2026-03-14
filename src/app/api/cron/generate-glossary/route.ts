import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { glossaryTerms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isConfigured } from "@/lib/ai/gemini";
import {
  generateNewGlossaryTerms,
  saveGlossaryTerm,
  expandTermsWithoutContent,
  injectGlossaryLinks,
  getGlossaryTermCount,
} from "@/lib/ai/glossary-generator";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Gemini API not configured" },
      { status: 503 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "generate";
  const count = Math.min(parseInt(url.searchParams.get("count") || "5"), 20);
  const category = url.searchParams.get("category") || undefined;

  const results: string[] = [];

  if (action === "generate") {
    const totalTerms = await getGlossaryTermCount();
    if (totalTerms >= 1000) {
      return NextResponse.json({
        ok: true,
        message: "Target of 1000 terms reached",
        totalTerms,
      });
    }

    const newTerms = await generateNewGlossaryTerms(count, category);
    for (const term of newTerms) {
      const ok = await saveGlossaryTerm(term);
      if (ok) results.push(`created: ${term.term} (${term.slug})`);
    }
  }

  if (action === "expand") {
    const expanded = await expandTermsWithoutContent(count);
    results.push(`expanded: ${expanded} terms`);
  }

  if (action === "relink") {
    try {
      const allTerms = await db
        .select({ id: glossaryTerms.id, content: glossaryTerms.content })
        .from(glossaryTerms)
        .where(eq(glossaryTerms.published, true));

      let relinked = 0;
      for (const term of allTerms) {
        if (!term.content) continue;
        const updated = await injectGlossaryLinks(term.content);
        if (updated !== term.content) {
          await db
            .update(glossaryTerms)
            .set({ content: updated, updatedAt: new Date() })
            .where(eq(glossaryTerms.id, term.id));
          relinked++;
        }
      }
      results.push(`relinked: ${relinked} terms updated`);
    } catch (err) {
      console.error("Relink failed:", err);
      results.push("relink: failed");
    }
  }

  const totalTerms = await getGlossaryTermCount();

  return NextResponse.json({
    ok: true,
    action,
    results,
    totalTerms,
    timestamp: new Date().toISOString(),
  });
}
