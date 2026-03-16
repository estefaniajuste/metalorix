const CHAR_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a", å: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ñ: "n", ç: "c", ş: "s", ğ: "g", ı: "i",
  ß: "ss", æ: "ae", ø: "o",
};

/**
 * Generate a URL-safe slug from a title in any Latin-script language.
 * Handles Turkish, German, Spanish, Portuguese special characters.
 * For non-Latin scripts (zh, ar), falls back to removing non-ASCII
 * and keeping any existing Latin characters.
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .split("")
    .map((ch) => CHAR_MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 280);
}
