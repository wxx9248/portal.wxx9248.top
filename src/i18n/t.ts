import { type Params, fill } from "@/i18n/fill";
import { strings } from "@/i18n/en";

type StringKey = keyof typeof strings;

// "count.hosts" for the pair "count.hosts.one" and "count.hosts.other"
type CountKey = StringKey extends infer Key
  ? Key extends `${infer Base}.one`
    ? Base
    : never
  : never;

const pluralRules = new Intl.PluralRules("en");

export function t(key: StringKey, params?: Params): string {
  return fill(strings[key], params);
}

// The plural form for the count, with {count} filled in
export function tCount(key: CountKey, count: number, params?: Params): string {
  const form = pluralRules.select(count) === "one" ? "one" : "other";
  return t(`${key}.${form}`, { ...params, count });
}
