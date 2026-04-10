import { NextRequest, NextResponse } from "next/server";
import { getCachedImage } from "@/lib/social/image-cache";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = getCachedImage(id);
  if (!data) {
    return NextResponse.json({ error: "Image not found or expired" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": data.byteLength.toString(),
      "Cache-Control": "public, max-age=600",
    },
  });
}
