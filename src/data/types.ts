/** A single self-hosted service exposed on a host. */
export interface ServiceEntry {
  /** Display name, e.g. "qBittorrent". */
  name: string;
  /** Path on the host, e.g. "/management/qbittorrent/". */
  path: string;
  /** Optional logo URL that overrides the auto-fetched favicon. */
  image?: string;
}

/** Services keyed by hostname, e.g. "host.example.com". */
export type PortalEntries = Record<string, ServiceEntry[]>;
