# Portal

A launcher for self-hosted services across the homelab — a grid of clickable
links, grouped by host, with a frosted-glass "network deck" aesthetic over a
soft animated aurora background.

Built with Vue 3 + Vite + TypeScript + Tailwind CSS v4.

## Features

- **Grouped by host** — each machine gets its own section with a live service
  count.
- **Auto icons** — each tile pulls the service's favicon, with a generated
  monogram tile as a fallback (or an explicit `image` override).
- **Search** — filter services by name, host, or path as you type.
- **Light / dark** — theme toggle that follows the system preference by default
  and remembers your choice.
- **Motion, gently** — drifting aurora, staggered card reveals, and a glow that
  tracks your cursor; all disabled under `prefers-reduced-motion`.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # type-check + production build → dist/
pnpm preview      # serve the build locally
```

## Service list

Services are a host → array map (see
[`src/data/entries.example.json`](src/data/entries.example.json)):

```json
{
  "host.example.com": [
    { "name": "Service Name", "path": "/path/", "image": "optional-logo-url" }
  ]
}
```

To use your own list, copy the example to a gitignored local file and edit it —
it's a plain, readable JSON file and the app picks it up automatically:

```bash
cp src/data/entries.example.json src/data/entries.local.json
# edit src/data/entries.local.json, then `pnpm dev`
```

By default (no local file) the app shows the example data, so the public repo
always builds and runs.

If you need the list as an environment variable elsewhere, generate the one-line
value from your local file:

```bash
pnpm entries:env      # prints the value for VITE_PORTAL_ENTRIES
```
