import { type Entries, parseEntries } from "@/lib/entries/schema";

export interface EntryInputs {
  // The PORTAL_ENTRIES variable, or null when it isn't set
  env: string | null;
  example: unknown;
  // The parsed local file, or null when there is none
  local: unknown;
}

function parseEnv(env: string): Entries {
  return parseEntries(parseJson(env), "PORTAL_ENTRIES");
}

function parseJson(env: string): unknown {
  try {
    return JSON.parse(env);
  } catch (error) {
    throw new Error(`PORTAL_ENTRIES is not valid JSON: ${String(error)}`, {
      cause: error
    });
  }
}

/*
 * The first source that is set wins: PORTAL_ENTRIES (a blank value counts as
 * unset), then the local file, then the example. A source that is set but
 * invalid fails, rather than falling back to the next one.
 */
export function resolveEntries(inputs: EntryInputs): Entries {
  const env = inputs.env?.trim() ?? "";
  if (env !== "") {
    return parseEnv(env);
  }
  if (inputs.local !== null) {
    return parseEntries(inputs.local, "src/data/entries.local.json");
  }
  return parseEntries(inputs.example, "src/data/entries.example.json");
}
