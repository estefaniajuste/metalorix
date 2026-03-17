import { NextResponse } from "next/server";
import { isIndexingApiConfigured } from "@/lib/seo/indexing-api";

/**
 * GET /api/seo/status
 * Returns SEO-related config status (no secrets). Use to verify indexing API is configured.
 */
export async function GET() {
  return NextResponse.json({
    indexingApiConfigured: isIndexingApiConfigured(),
  });
}
