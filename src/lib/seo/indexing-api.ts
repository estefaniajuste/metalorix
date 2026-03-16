import crypto from "crypto";

const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/indexing";

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

let cachedToken: { token: string; expires: number } | null = null;

function getServiceAccountKey(): ServiceAccountKey | null {
  const raw = process.env.GOOGLE_INDEXING_KEY;
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (parsed.client_email && parsed.private_key) return parsed;
    return null;
  } catch {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.client_email && parsed.private_key) return parsed;
      return null;
    } catch {
      return null;
    }
  }
}

function createJwt(key: ServiceAccountKey): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${payload}`)
    .sign(key.private_key, "base64url");

  return `${header}.${payload}.${signature}`;
}

async function getAccessToken(
  key: ServiceAccountKey,
): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  try {
    const jwt = createJwt(key);
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }).toString(),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expires: Date.now() + (data.expires_in - 60) * 1000,
    };
    return data.access_token;
  } catch {
    return null;
  }
}

export async function submitUrlToGoogle(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
): Promise<boolean> {
  const key = getServiceAccountKey();
  if (!key) return false;

  const token = await getAccessToken(key);
  if (!token) return false;

  try {
    const res = await fetch(INDEXING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitUrlsToGoogle(
  urls: string[],
  maxPerBatch = 200,
): Promise<{ submitted: string[]; failed: string[] }> {
  const key = getServiceAccountKey();
  if (!key) return { submitted: [], failed: urls };

  const submitted: string[] = [];
  const failed: string[] = [];
  const batch = urls.slice(0, maxPerBatch);

  for (const url of batch) {
    const ok = await submitUrlToGoogle(url);
    if (ok) {
      submitted.push(url);
    } else {
      failed.push(url);
    }
    if (batch.indexOf(url) < batch.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { submitted, failed };
}

export function isIndexingApiConfigured(): boolean {
  return getServiceAccountKey() !== null;
}
