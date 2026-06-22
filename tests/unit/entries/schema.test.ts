import { describe, expect, it } from "vitest";
import example from "@/data/entries.example.json";
import { parseEntries } from "@/lib/entries/schema";

const source = "test source";

const withService = (service: Record<string, unknown>): unknown => ({
  "alpha.example.com": [{ name: "Database Admin", path: "/db/", ...service }]
});

describe("parseEntries", () => {
  it("accepts the example list unchanged", () => {
    expect(parseEntries(example, source)).toEqual(example);
  });

  it("rejects a list with no hosts", () => {
    expect(() => parseEntries({}, source)).toThrow(/at least one host/u);
  });

  it("rejects a host with no services", () => {
    expect(() => parseEntries({ "alpha.example.com": [] }, source)).toThrow(
      /alpha\.example\.com/u
    );
  });

  it("rejects a path without its slashes, naming the host and field", () => {
    const parse = (): unknown =>
      parseEntries(withService({ path: "management/db" }), source);
    expect(parse).toThrow(/alpha\.example\.com/u);
    expect(parse).toThrow(/path/u);
  });

  it("accepts a path without a trailing slash", () => {
    expect(() =>
      parseEntries(withService({ path: "/admin" }), source)
    ).not.toThrow();
  });

  it("rejects an empty name", () => {
    expect(() => parseEntries(withService({ name: "  " }), source)).toThrow(
      /name/u
    );
  });

  it("accepts only https images", () => {
    expect(() =>
      parseEntries(withService({ image: "http://x.test/a.png" }), source)
    ).toThrow(/image/u);
    expect(() =>
      parseEntries(withService({ image: "https://x.test/a.png" }), source)
    ).not.toThrow();
  });

  it("rejects unknown fields", () => {
    expect(() => parseEntries(withService({ icon: "x" }), source)).toThrow(
      /icon/u
    );
  });

  it("accepts lowercase hostnames, with or without a port", () => {
    const service = [{ name: "NAS", path: "/" }];
    expect(() =>
      parseEntries({ "nas.lan:8443": service }, source)
    ).not.toThrow();
    expect(() =>
      parseEntries({ "Alpha.Example.com": service }, source)
    ).toThrow(/Alpha\.Example\.com/u);
    expect(() => parseEntries({ "bad host": service }, source)).toThrow();
  });

  it("explains why a host is rejected", () => {
    expect(() =>
      parseEntries({ "Alpha.Example.com": [{ name: "A", path: "/" }] }, source)
    ).toThrow(/lowercase hostname/u);
  });

  it("names the source first in its error", () => {
    expect(() => parseEntries({}, source)).toThrow(/^test source:/u);
  });
});
