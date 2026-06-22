# portal.wxx9248.top

A launcher for self-hosted services across the homelab.

## Requirements

- Node.js — the version in `devEngines` in [`package.json`](package.json)
- pnpm — the version in `packageManager` in [`package.json`](package.json)

## Commands

| Command            | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `pnpm install`     | Install dependencies                                                |
| `pnpm dev`         | Start the dev server                                                |
| `pnpm build`       | Lint, type check and build to `dist/`. Fails if any step fails      |
| `pnpm preview`     | Serve `dist/` as Cloudflare will (`wrangler dev`)                   |
| `pnpm test`        | Unit tests (Vitest), then browser tests (Playwright)                |
| `pnpm lint:fix`    | Fix what ESLint can fix                                             |
| `pnpm format`      | Format everything with Prettier                                     |
| `pnpm entries:env` | Print `src/data/entries.local.json` as one line, for PORTAL_ENTRIES |

## Service list

Services are grouped by host:

```json
{
  "host.example.com": [
    { "name": "Service", "path": "/service/", "image": "https://…/logo.png" }
  ]
}
```

`path` starts with `/`; `image` is optional and replaces the service's favicon.

The build takes the first of these that exists:

1. The `PORTAL_ENTRIES` environment variable, holding the list as JSON. On
   Cloudflare, set it under the Worker's build variables, not its runtime
   variables: it is read when the site is built.
2. `src/data/entries.local.json`, which git ignores. Copy
   [`src/data/entries.example.json`](src/data/entries.example.json) to start.
3. The example list, so the repository always builds.

A list that isn't valid fails the build with the reason, instead of falling
back to the next one.
