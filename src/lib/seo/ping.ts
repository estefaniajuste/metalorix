const SITEMAP_URL = "https://metalorix.com/sitemap.xml";

const PING_URLS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
];

export async function pingSearchEngines(): Promise<{ pinged: string[]; failed: string[] }> {
  const pinged: string[] = [];
  const failed: string[] = [];

  for (const url of PING_URLS) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        const engine = url.includes("google") ? "google" : "bing";
        pinged.push(engine);
      } else {
        failed.push(url);
      }
    } catch {
      failed.push(url);
    }
  }

  return { pinged, failed };
}

export async function pingIndexNow(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return false;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "metalorix.com",
        urlList: urls,
      }),
    });
    return res.ok || res.status === 202;
  } catch {
    return false;
  }
}
