import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
// Wrangler's own parser, so the test reads the file exactly as deploys do
import { experimental_readRawConfig as readRawConfig } from "wrangler";
import { site } from "@/config/site";

const { rawConfig: config } = readRawConfig({
  config: "wrangler.jsonc"
});
const read = (path: string): string => readFileSync(path, "utf8");

describe("wrangler.jsonc", () => {
  it("serves static assets only, with no Worker code", () => {
    expect(config).not.toHaveProperty("main");
    expect(config.assets).toEqual({
      directory: "./dist",
      // eslint-disable-next-line camelcase -- wrangler's key
      not_found_handling: "404-page"
    });
  });

  it("has the previews block that wrangler preview needs", () => {
    expect(config.previews).toEqual({});
  });

  it("serves the site's host as a custom domain only", () => {
    expect(config.routes).toEqual([
      // eslint-disable-next-line camelcase -- wrangler's key
      { custom_domain: true, pattern: site.host }
    ]);
    expect(config.workers_dev).toBe(false);
  });
});

describe("public/_headers", () => {
  const headers = read("public/_headers");

  it("applies to every path", () => {
    expect(headers.startsWith("/*\n")).toBe(true);
  });

  it.each([
    "X-Content-Type-Options: nosniff",
    "Referrer-Policy: no-referrer",
    "Content-Security-Policy: frame-ancestors 'none'",
    "X-Robots-Tag: noindex, nofollow",
    "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  ])("sends %s", (header) => {
    expect(headers).toContain(`  ${header}\n`);
  });
});

describe("public/robots.txt", () => {
  it("asks every crawler to stay out", () => {
    expect(read("public/robots.txt")).toBe("User-agent: *\nDisallow: /\n");
  });
});
