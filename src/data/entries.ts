import type { PortalEntries } from "@/data/types";
import exampleEntries from "@/data/entries.example.json";

// Optional, gitignored local override. Edit src/data/entries.local.json to show
// your own services in dev; it's picked up automatically when present.
const localModules = import.meta.glob<{ default: PortalEntries }>(
  "./entries.local.json",
  { eager: true }
);

function fromEnv(): PortalEntries | null {
  const raw = import.meta.env.VITE_PORTAL_ENTRIES;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PortalEntries;
  } catch (error) {
    console.warn(
      "VITE_PORTAL_ENTRIES is not valid JSON; ignoring it.",
      error
    );
    return null;
  }
}

function fromLocalFile(): PortalEntries | null {
  return localModules["./entries.local.json"]?.default ?? null;
}

/**
 * Resolution order: the VITE_PORTAL_ENTRIES env var (used in production) wins,
 * then the gitignored local JSON file (dev convenience), then the committed
 * example data so the public repo always builds and runs.
 */
const entries: PortalEntries =
  fromEnv() ?? fromLocalFile() ?? (exampleEntries as PortalEntries);

export default entries;
