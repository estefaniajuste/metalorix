// Search-engine pings disabled while URLs are unstable to avoid indexing broken paths.

export async function pingSearchEngines(): Promise<{ pinged: string[]; failed: string[] }> {
  return { pinged: [], failed: [] };
}

export async function pingIndexNow(_urls: string[]): Promise<boolean> {
  return false;
}
