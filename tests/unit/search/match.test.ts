import { describe, expect, it } from "vitest";
import { matches, normalizeQuery, toSearchText } from "@/lib/search/match";

const torrents = toSearchText([
  "Torrents",
  "/management/torrents/",
  "alpha.example.com"
]);

describe("normalizeQuery", () => {
  it("trims and lowercases", () => {
    expect(normalizeQuery("  TorR \n")).toBe("torr");
  });
});

describe("toSearchText", () => {
  it("lowercases each part and keeps them apart", () => {
    expect(toSearchText(["Ab", "Cd"])).toBe("ab\ncd");
  });
});

describe("matches", () => {
  it("matches everything when the query is empty or blank", () => {
    expect(matches(torrents, "")).toBe(true);
    expect(matches(torrents, "   ")).toBe(true);
  });

  it("ignores case", () => {
    expect(matches(torrents, "TORR")).toBe(true);
  });

  it("matches the path and the host", () => {
    expect(matches(torrents, "/management/tor")).toBe(true);
    expect(matches(torrents, "alpha.example")).toBe(true);
  });

  it("rejects text that isn't there", () => {
    expect(matches(torrents, "chat")).toBe(false);
  });

  it("treats regular expression characters literally", () => {
    expect(matches(torrents, "(")).toBe(false);
    expect(matches(torrents, ".*")).toBe(false);
    expect(matches(toSearchText(["Q&A (beta)"]), "(beta")).toBe(true);
  });

  it("doesn't match across the boundary between parts", () => {
    expect(matches(torrents, "torrents/management")).toBe(false);
  });
});
