const GRAPH_API = process.env.INSTAGRAM_API_BASE_URL || "https://graph.instagram.com/v21.0";

const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const IG_IMAGE_SECRET = process.env.INSTAGRAM_IMAGE_SECRET;

let accessToken = process.env.INSTAGRAM_ACCESS_TOKEN ?? "";

export interface PublishResult {
  ok: boolean;
  postId?: string;
  error?: string;
  permalink?: string;
}

/**
 * Publish a single photo to Instagram via the Graph API.
 * Two-step process: create media container → publish it.
 * `imageUrl` must be publicly accessible (Instagram fetches it server-side).
 */
export async function publishPhoto(
  imageUrl: string,
  caption: string,
): Promise<PublishResult> {
  if (!IG_USER_ID || !accessToken) {
    return { ok: false, error: "INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN not configured" };
  }

  try {
    // Step 1: Create media container (form-encoded required by Instagram Login API)
    const containerParams = new URLSearchParams();
    containerParams.set("image_url", imageUrl);
    containerParams.set("caption", caption);
    containerParams.set("access_token", accessToken);

    const containerRes = await fetch(`${GRAPH_API}/${IG_USER_ID}/media`, {
      method: "POST",
      body: containerParams,
      signal: AbortSignal.timeout(30_000),
    });

    const containerData = await containerRes.json();

    if (!containerRes.ok || containerData.error) {
      const msg = containerData.error?.message ?? `HTTP ${containerRes.status}`;
      console.error("[Instagram] Container creation failed:", msg);
      return { ok: false, error: `Container: ${msg}` };
    }

    const containerId = containerData.id as string;
    if (!containerId) {
      return { ok: false, error: "No container ID returned" };
    }

    // Step 2: Wait for container to be ready (Instagram processes the image)
    await waitForContainer(containerId);

    // Step 3: Publish the container
    const publishParams = new URLSearchParams();
    publishParams.set("creation_id", containerId);
    publishParams.set("access_token", accessToken);

    const publishRes = await fetch(`${GRAPH_API}/${IG_USER_ID}/media_publish`, {
      method: "POST",
      body: publishParams,
      signal: AbortSignal.timeout(30_000),
    });

    const publishData = await publishRes.json();

    if (!publishRes.ok || publishData.error) {
      const msg = publishData.error?.message ?? `HTTP ${publishRes.status}`;
      console.error("[Instagram] Publish failed:", msg);
      return { ok: false, error: `Publish: ${msg}` };
    }

    const postId = publishData.id as string;

    // Optionally fetch permalink
    let permalink: string | undefined;
    try {
      const infoRes = await fetch(
        `${GRAPH_API}/${postId}?fields=permalink&access_token=${accessToken}`,
        { signal: AbortSignal.timeout(5_000) },
      );
      if (infoRes.ok) {
        const info = await infoRes.json();
        permalink = info.permalink;
      }
    } catch {
      // Non-critical
    }

    console.log(`[Instagram] Published post ${postId}`, permalink ?? "");
    return { ok: true, postId, permalink };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Instagram] publishPhoto error:", msg);
    return { ok: false, error: msg };
  }
}

async function waitForContainer(containerId: string, maxAttempts = 10): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3_000));
    try {
      const res = await fetch(
        `${GRAPH_API}/${containerId}?fields=status_code&access_token=${accessToken}`,
        { signal: AbortSignal.timeout(5_000) },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.status_code === "FINISHED") return;
        if (data.status_code === "ERROR") {
          throw new Error(`Container processing failed: ${JSON.stringify(data)}`);
        }
      }
    } catch (err) {
      if (i === maxAttempts - 1) throw err;
    }
  }
}

/**
 * Refresh the long-lived token before it expires (valid 60 days).
 * Call this proactively (e.g. every 50 days).
 * Returns the new token or null on failure.
 * NOTE: The new token must be persisted externally (GitHub Secret / env).
 */
export async function refreshToken(): Promise<string | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`,
      { signal: AbortSignal.timeout(10_000) },
    );

    if (!res.ok) {
      console.error("[Instagram] Token refresh failed:", res.status);
      return null;
    }

    const data = await res.json();
    const newToken = data.access_token as string | undefined;
    if (newToken) {
      accessToken = newToken;
      console.log("[Instagram] Token refreshed, expires in", data.expires_in, "seconds");
      return newToken;
    }
    return null;
  } catch (err) {
    console.error("[Instagram] Token refresh error:", err);
    return null;
  }
}

/**
 * Build a signed image URL for the Instagram image endpoint.
 * The token prevents public abuse of the image generator.
 */
export function buildImageUrl(
  baseUrl: string,
  type: string,
  extra?: Record<string, string>,
): string {
  const params = new URLSearchParams({ type, ...extra });

  if (IG_IMAGE_SECRET) {
    const ts = Math.floor(Date.now() / 1000).toString();
    params.set("ts", ts);
    params.set("sig", simpleHash(`${type}:${ts}:${IG_IMAGE_SECRET}`));
  }

  return `${baseUrl}/api/instagram/image?${params.toString()}`;
}

/**
 * Verify image request signature.
 * Returns true if valid or if no secret is configured (dev mode).
 */
export function verifyImageSignature(
  type: string,
  ts: string | null,
  sig: string | null,
): boolean {
  if (!IG_IMAGE_SECRET) return true;
  if (!ts || !sig) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - parseInt(ts, 10));
  if (age > 600) return false; // 10 min window

  return sig === simpleHash(`${type}:${ts}:${IG_IMAGE_SECRET}`);
}

function simpleHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

export function isConfigured(): boolean {
  return !!(IG_USER_ID && accessToken);
}
