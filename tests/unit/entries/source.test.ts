import { type EntryInputs, resolveEntries } from "@/lib/entries/source";
import { describe, expect, it } from "vitest";

const list = (host: string): unknown => ({
  [host]: [{ name: "Service", path: "/" }]
});

const example = list("example.test");
const local = list("local.test");
const fromEnv = JSON.stringify(list("env.test"));

// Each source lists one host, so the host shows which source won
const chosenHost = (inputs: EntryInputs): string[] =>
  Object.keys(resolveEntries(inputs));

describe("resolveEntries", () => {
  it("prefers PORTAL_ENTRIES", () => {
    expect(chosenHost({ env: fromEnv, example, local })).toEqual(["env.test"]);
  });

  it("treats an empty or blank PORTAL_ENTRIES as unset", () => {
    for (const env of ["", "  \n", null]) {
      expect(chosenHost({ env, example, local })).toEqual(["local.test"]);
    }
  });

  it("falls back to the example without a local file", () => {
    expect(chosenHost({ env: null, example, local: null })).toEqual([
      "example.test"
    ]);
  });

  it("fails on PORTAL_ENTRIES that isn't JSON", () => {
    expect(() => resolveEntries({ env: "{not json", example, local })).toThrow(
      /^PORTAL_ENTRIES is not valid JSON/u
    );
  });

  it("fails on an invalid PORTAL_ENTRIES instead of falling back", () => {
    expect(() => resolveEntries({ env: "{}", example, local })).toThrow(
      /^PORTAL_ENTRIES:/u
    );
  });

  it("names the local file when it is invalid", () => {
    expect(() =>
      resolveEntries({ env: null, example, local: { "a.test": [] } })
    ).toThrow(/^src\/data\/entries\.local\.json:/u);
  });
});
