// Reads the pretty, gitignored src/data/entries.local.json and prints the
// single-line value for the VITE_PORTAL_ENTRIES environment variable, so you
// can edit a readable file and paste the result into your host's env settings.
//
//   pnpm entries:env

import { readFileSync } from "node:fs";

const file = new URL("../src/data/entries.local.json", import.meta.url);

let parsed;
try {
  parsed = JSON.parse(readFileSync(file, "utf8"));
} catch (error) {
  if (error.code === "ENOENT") {
    console.error(
      "src/data/entries.local.json not found.\n" +
        "Copy src/data/entries.example.json to src/data/entries.local.json and edit it."
    );
  } else {
    console.error("src/data/entries.local.json is not valid JSON:", error.message);
  }
  process.exit(1);
}

process.stdout.write(JSON.stringify(parsed) + "\n");
