/*
 * The service list's shape. It imports nothing through the @/ alias, so
 * scripts/entries-env.ts can run it in Node directly.
 */
import { z } from "astro/zod";

// A lowercase hostname, optionally with a port, such as "nas.lan:8443"
const hostPattern = /^[a-z0-9-]+(?:\.[a-z0-9-]+)*(?::\d{1,5})?$/u;

const minimumHosts = 1;

const serviceSchema = z.strictObject({
  image: z
    .url({
      error: "image must be an https:// URL",
      protocol: /^https$/u
    })
    .optional(),
  name: z.string().refine((name) => name.trim() !== "", {
    error: "name must not be blank"
  }),
  path: z.string().startsWith("/", { error: 'path must start with "/"' })
});

/*
 * Hosts are checked here rather than by the record's key schema, whose
 * failures zod reports only as "Invalid key in record"
 */
const entriesSchema = z
  .record(
    z.string(),
    z.array(serviceSchema).nonempty({ error: "each host needs a service" })
  )
  .refine((entries) => Object.keys(entries).length >= minimumHosts, {
    error: "the list needs at least one host"
  })
  .superRefine((entries, context) => {
    for (const host of Object.keys(entries)) {
      if (!hostPattern.test(host)) {
        context.addIssue({
          code: "custom",
          message: "hosts must be lowercase hostnames, optionally with a :port",
          path: [host]
        });
      }
    }
  });

export type Entries = z.infer<typeof entriesSchema>;

// Validates a parsed list; the error starts with the source's name
export function parseEntries(raw: unknown, source: string): Entries {
  const result = entriesSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`${source}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
