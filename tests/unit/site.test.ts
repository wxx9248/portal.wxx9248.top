import { describe, expect, it } from "vitest";
import { site } from "@/config/site";

describe("site", () => {
  it("serves its URL from its host", () => {
    expect(site.url).toBe(`https://${site.host}/`);
  });
});
