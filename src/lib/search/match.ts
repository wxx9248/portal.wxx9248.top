/*
 * Service filtering, shared by the page (which writes each tile's search
 * text) and the browser script (which matches the query against it).
 */

// Separates the parts so a query can't match across two of them
const partSeparator = "\n";

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function toSearchText(parts: readonly string[]): string {
  return parts.map((part) => part.toLowerCase()).join(partSeparator);
}

export function matches(searchText: string, query: string): boolean {
  const normalized = normalizeQuery(query);
  return normalized === "" || searchText.includes(normalized);
}
