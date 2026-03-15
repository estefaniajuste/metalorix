import { NextResponse } from "next/server";
import { generateBatch, seedTaxonomy, seedTags } from "@/lib/learn/generate";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.LEARN_API_KEY || process.env.CRON_SECRET;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "seed") {
      const taxResult = await seedTaxonomy();
      const tagCount = await seedTags();
      return NextResponse.json({
        success: true,
        taxonomy: taxResult,
        tags: tagCount,
      });
    }

    if (action === "generate") {
      const result = await generateBatch({
        batchId: body.batchId || `api-${Date.now()}`,
        slugs: body.slugs,
        clusterSlug: body.cluster,
        difficulty: body.difficulty,
        locale: "en",
        dryRun: body.dryRun || false,
      });
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'seed' or 'generate'." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Learn API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
