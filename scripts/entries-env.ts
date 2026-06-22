/*
 * Prints the gitignored src/data/entries.local.json as the one-line value of
 * PORTAL_ENTRIES, after checking it, to paste into the Workers Builds
 * build variables.
 *
 *   pnpm entries:env
 */
import { parseEntries } from "../src/lib/entries/schema.ts";
import { readFileSync } from "node:fs";

const source = "src/data/entries.local.json";
const file = new URL(`../${source}`, import.meta.url);
const failure = 1;

function isMissing(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function readText(): string {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    throw new Error(
      isMissing(error)
        ? `${source} not found. Copy src/data/entries.example.json to it and edit it.`
        : `${source} can't be read: ${String(error)}`,
      { cause: error }
    );
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${source} is not valid JSON: ${String(error)}`, {
      cause: error
    });
  }
}

try {
  const entries = parseEntries(parseJson(readText()), source);
  process.stdout.write(`${JSON.stringify(entries)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = failure;
}
