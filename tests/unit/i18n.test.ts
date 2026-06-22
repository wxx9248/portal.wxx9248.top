import { describe, expect, it } from "vitest";
import { t, tCount } from "@/i18n/t";
import { strings } from "@/i18n/en";

describe("t", () => {
  it("fills placeholders", () => {
    expect(t("filter.empty", { query: "x" })).toBe("No services match “x”.");
  });

  it("throws when a placeholder has no value", () => {
    expect(() => t("filter.empty")).toThrow(/query/u);
  });
});

describe("tCount", () => {
  it("picks the singular and plural forms", () => {
    expect(tCount("count.services", 1)).toBe("1 service");
    expect(tCount("count.services", 3)).toBe("3 services");
    expect(tCount("count.hosts", 1)).toBe("1 host");
  });

  it("fills other placeholders too", () => {
    expect(tCount("count.matching", 7, { shown: 6 })).toBe("6 of 7 services");
    expect(tCount("count.matching", 1, { shown: 0 })).toBe("0 of 1 service");
  });
});

describe("strings", () => {
  it("gives every singular form a plural form", () => {
    const keys = Object.keys(strings);
    const singulars = keys.filter((key) => key.endsWith(".one"));
    expect(singulars.length).toBeGreaterThan(0);
    for (const key of singulars) {
      expect(keys).toContain(key.replace(/\.one$/u, ".other"));
    }
  });
});
