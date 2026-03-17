import { NextRequest, NextResponse } from "next/server";
import { isIndexingApiConfigured, getIndexingApiDiagnostics } from "@/lib/seo/indexing-api";

/**
 * GET /api/seo/status
 * Returns SEO-related config status (no secrets). Use to verify indexing API is configured.
 * ?debug=1 adds diagnostic info for troubleshooting.
 */
export async function GET(request: NextRequest) {
  const debug = request.nextUrl.searchParams.get("debug") === "1";

  const base = {
    indexingApiConfigured: isIndexingApiConfigured(),
    indexNowConfigured: !!process.env.INDEXNOW_KEY,
  };

  if (debug) {
    const diag = getIndexingApiDiagnostics();
    return NextResponse.json({ ...base, indexingDiagnostics: diag });
  }

  return NextResponse.json(base);
}
