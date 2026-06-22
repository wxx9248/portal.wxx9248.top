import type { Entries } from "@/lib/entries/schema";
import { toSearchText } from "@/lib/search/match";

export interface Service {
  // Unique on the page, such as "service-0-1"
  id: string;
  // Icon URLs to try in order; the monogram shows if they all fail
  iconCandidates: string[];
  monogram: string;
  name: string;
  path: string;
  searchText: string;
  url: string;
}

export interface HostGroup {
  host: string;
  // The panel's anchor, unique on the page, such as "host-0"
  id: string;
  services: Service[];
}

export interface Portal {
  groups: HostGroup[];
  hostCount: number;
  serviceCount: number;
}

const faviconFile = "favicon.ico";

/*
 * The favicon beside the service (resolved like a relative link, so "/admin"
 * looks in "/"), then the one at the host's root
 */
function iconCandidates(url: string, image?: string): string[] {
  if (image) {
    return [image];
  }
  const beside = new URL(faviconFile, url).href;
  const atRoot = new URL(`/${faviconFile}`, url).href;
  return beside === atRoot ? [atRoot] : [beside, atRoot];
}

// The first character (not UTF-16 unit) of the name, uppercased
function monogram(name: string): string {
  const [first = ""] = name.trim();
  return first.toUpperCase();
}

export function buildPortal(entries: Entries): Portal {
  const groups = Object.entries(entries).map(([host, services], hostIndex) => ({
    host,
    id: `host-${hostIndex}`,
    services: services.map(({ image, name, path }, serviceIndex) => {
      const url = `https://${host}${path}`;
      return {
        iconCandidates: iconCandidates(url, image),
        id: `service-${hostIndex}-${serviceIndex}`,
        monogram: monogram(name),
        name,
        path,
        searchText: toSearchText([name, path, host]),
        url
      };
    })
  }));
  return {
    groups,
    hostCount: groups.length,
    serviceCount: groups.flatMap((group) => group.services).length
  };
}
