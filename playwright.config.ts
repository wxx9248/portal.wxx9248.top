import { fixtureEntriesPath, viewports } from "./tests/e2e/helpers";
import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";

const port = 8788;
const outDir = "dist-test";
const colorSchemes = ["light", "dark"] as const;

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  projects: Object.entries(viewports).flatMap(([name, viewport]) =>
    colorSchemes.map((colorScheme) => ({
      name: `${name}-${colorScheme}`,
      use: { colorScheme, viewport }
    }))
  ),
  reporter: [["list"], ["html", { open: "never" }]],
  testDir: "tests/e2e",
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    // Builds the fixture list into its own directory, then serves it as Cloudflare will
    command: `pnpm exec astro build --outDir ${outDir} && pnpm preview --port ${port} --assets ${outDir}`,
    env: {
      PORTAL_ENTRIES: readFileSync(fixtureEntriesPath, "utf8"),
      WRANGLER_SEND_METRICS: "false"
    },
    port,
    reuseExistingServer: !process.env.CI
  }
});
