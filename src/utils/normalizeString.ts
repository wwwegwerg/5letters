export function normalizeString(str: string): string {
  return str.normalize("NFC").replace(/ё/gi, "е").replace(/Ë/g, "Е"); // латинская Ë
}
