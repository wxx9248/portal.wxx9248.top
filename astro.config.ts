import { defineConfig } from "astro/config";
import { site } from "./src/config/site";

export default defineConfig({
  compressHTML: true,
  // No Markdown here, and Shiki's inline styles would need CSP exceptions
  markdown: { syntaxHighlight: false },
  /*
   * A Content-Security-Policy <meta> with the hashes of every script and
   * style Astro emits. frame-ancestors only works as a header, so it's in
   * public/_headers. Images may come from any https host: each service's
   * favicon is loaded from the service itself.
   */
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https: data:",
        "base-uri 'none'",
        "form-action 'none'",
        "object-src 'none'"
      ]
    }
  },
  site: site.url,
  trailingSlash: "always",
  vite: {
    css: {
      lightningcss: { drafts: { customMedia: true } },
      transformer: "lightningcss"
    }
  }
});
