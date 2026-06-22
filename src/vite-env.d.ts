/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** JSON-encoded PortalEntries injected at build time. See src/data/entries.ts. */
  readonly VITE_PORTAL_ENTRIES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
