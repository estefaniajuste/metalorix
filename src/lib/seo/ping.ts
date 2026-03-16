const SITEMAP_URL = "https://metalorix.com/api/sitemap";

export async function pingSearchEngines(): Promise<{ pinged: string[]; failed: string[] }> {
  const pinged: string[] = [];
  const failed: string[] = [];

  const targets = [
    { name: "Google", url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
    { name: "Bing", url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
  ];

  for (const target of targets) {
    try {
      const res = await fetch(target.url, { method: "GET", signal: AbortSignal.timeout(10_000) });
      if (res.ok) {
        pinged.push(target.name);
      } else {
        failed.push(`${target.name} (${res.status})`);
      }
    } catch (err) {
      failed.push(`${target.name} (${err instanceof Error ? err.message : "unknown"})`);
    }
  }

  return { pinged, failed };
}

export async function pingIndexNow(urls: string[]): Promise<boolean> {
  if (!urls.length) return false;

  const key = process.env.INDEXNOW_KEY;
  if (!key) return false;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "metalorix.com",
        key,
        keyLocation: `https://metalorix.com/${key}.txt`,
        urlList: urls.slice(0, 10_000),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    return res.ok || res.status === 202;
  } catch {
    return false;
  }
}
