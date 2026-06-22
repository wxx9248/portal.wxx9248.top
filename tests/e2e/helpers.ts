import { type Page, test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

export { expect };

// The tests' own service list, passed to the build as PORTAL_ENTRIES
export const fixtureEntriesPath = "tests/fixtures/entries.json";

// Real device widths, deliberately independent of the CSS breakpoints
export const viewports = {
  desktop: { height: 800, width: 1280 },
  phone: { height: 844, width: 390 }
} as const;

const iconPng = readFileSync("tests/fixtures/icon.png");

// What the stubbed service hosts answer; anything not listed is a 404
const stubs: Record<string, { body: Buffer; contentType: string }> = {
  "https://alpha.example.test/favicon.ico": {
    body: iconPng,
    contentType: "image/png"
  },
  // A login page answering for an image, as a proxy in front of a service might
  "https://cdn.example.test/chat.png": {
    body: Buffer.from("<html>login</html>"),
    contentType: "text/html"
  }
};

const notFound = { body: Buffer.from(""), contentType: "text/plain" };
const okStatus = 200;
const notFoundStatus = 404;

/*
 * Every page gets stubbed service hosts, so the tests never leave the
 * machine and the favicon fallback is deterministic. It uses the Chromium
 * DevTools protocol directly because page.route() never sees requests for
 * URLs ending in /favicon.ico.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://*" }] });
    cdp.on("Fetch.requestPaused", ({ request, requestId }) => {
      const stub = stubs[request.url];
      const { body, contentType } = stub ?? notFound;
      cdp
        .send("Fetch.fulfillRequest", {
          body: body.toString("base64"),
          requestId,
          responseCode: stub ? okStatus : notFoundStatus,
          responseHeaders: [{ name: "Content-Type", value: contentType }]
        })
        // The page may have closed while the request was paused
        .catch(() => null);
    });
    await use(page);
  }
});

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(0);
}

export async function expectAccessible(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target.join(" "))
  }));
  expect(summary).toEqual([]);
}

// Collects the page's Content Security Policy violations from now on
export function collectCspViolations(page: Page): () => string[] {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) {
      violations.push(message.text());
    }
  });
  return () => violations;
}

// Collects uncaught errors thrown by the page's scripts
export function collectPageErrors(page: Page): () => string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  return () => errors;
}
