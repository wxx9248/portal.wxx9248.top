import type { Entries } from "@/lib/entries/schema";
import example from "@/data/entries.example.json";
import { resolveEntries } from "@/lib/entries/source";

// The gitignored local list, when there is one
const localFiles = import.meta.glob<unknown>("/src/data/entries.local.json", {
  eager: true,
  import: "default"
});

// The service list for this build; throws if the chosen source is invalid
export function loadEntries(): Entries {
  const [local = null] = Object.values(localFiles);
  return resolveEntries({
    env: process.env.PORTAL_ENTRIES ?? null,
    example,
    local
  });
}
