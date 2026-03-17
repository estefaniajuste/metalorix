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
): Promise<{ token: string } | { error: string }> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return { token: cachedToken.token };
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

    const body = await res.text();
    if (!res.ok) {
      return { error: `Token auth ${res.status}: ${body.slice(0, 500)}` };
    }

    const data = JSON.parse(body);
    cachedToken = {
      token: data.access_token,
      expires: Date.now() + (data.expires_in - 60) * 1000,
    };
    return { token: data.access_token };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitUrlToGoogle(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
): Promise<SubmitResult> {
  const key = getServiceAccountKey();
  if (!key) return { ok: false, error: "GOOGLE_INDEXING_KEY not configured" };

  const tokenResult = await getAccessToken(key);
  if ("error" in tokenResult) {
    return { ok: false, error: `Token: ${tokenResult.error}` };
  }

  try {
    const res = await fetch(INDEXING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResult.token}`,
      },
      body: JSON.stringify({ url, type }),
      signal: AbortSignal.timeout(10_000),
    });

    const body = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        error: `Indexing API ${res.status}: ${body.slice(0, 600)}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function submitUrlsToGoogle(
  urls: string[],
  maxPerBatch = 200,
): Promise<{ submitted: string[]; failed: string[]; firstError?: string }> {
  const key = getServiceAccountKey();
  if (!key) return { submitted: [], failed: urls, firstError: "Key not configured" };

  const submitted: string[] = [];
  const failed: string[] = [];
  let firstError: string | undefined;
  const batch = urls.slice(0, maxPerBatch);

  for (const url of batch) {
    const result = await submitUrlToGoogle(url);
    if (result.ok) {
      submitted.push(url);
    } else {
      failed.push(url);
      if (!firstError) firstError = result.error;
    }
    if (batch.indexOf(url) < batch.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { submitted, failed, firstError };
}

export function isIndexingApiConfigured(): boolean {
  return getServiceAccountKey() !== null;
}

/** Returns safe diagnostic info for debugging (no secrets exposed). */
export function getIndexingApiDiagnostics(): {
  configured: boolean;
  hasEnvVar: boolean;
  envVarLength: number;
  parseError?: string;
} {
  const raw = process.env.GOOGLE_INDEXING_KEY;
  const hasEnvVar = !!raw && raw.length > 0;
  const envVarLength = raw?.length ?? 0;

  if (!hasEnvVar) {
    return { configured: false, hasEnvVar: false, envVarLength: 0, parseError: "GOOGLE_INDEXING_KEY not set or empty" };
  }

  try {
    const decoded = Buffer.from(raw!, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (parsed.client_email && parsed.private_key) {
      return { configured: true, hasEnvVar: true, envVarLength, parseError: undefined };
    }
    return { configured: false, hasEnvVar: true, envVarLength, parseError: "JSON missing client_email or private_key" };
  } catch (e1) {
    try {
      const parsed = JSON.parse(raw!);
      if (parsed.client_email && parsed.private_key) {
        return { configured: true, hasEnvVar: true, envVarLength, parseError: undefined };
      }
      return { configured: false, hasEnvVar: true, envVarLength, parseError: "JSON missing client_email or private_key" };
    } catch (e2) {
      const err = e2 instanceof Error ? e2.message : String(e2);
      return { configured: false, hasEnvVar: true, envVarLength, parseError: `Parse failed: ${err.slice(0, 80)}` };
    }
  }
}
