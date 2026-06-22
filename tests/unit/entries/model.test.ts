import { describe, expect, it } from "vitest";
import { buildPortal } from "@/lib/entries/model";
import { toSearchText } from "@/lib/search/match";

const portal = buildPortal({
  "alpha.example.com": [
    { name: "Database Admin", path: "/management/db/" },
    { name: "Root", path: "/" },
    { name: "Admin", path: "/admin" }
  ],
  "beta.example.com": [
    {
      image: "https://cdn.example.com/chat.png",
      name: "文件共享",
      path: "/chat/"
    }
  ]
});

const [alpha, beta] = portal.groups;
const [database, root, admin] = alpha.services;
const [chat] = beta.services;

describe("buildPortal", () => {
  it("keeps hosts and services in order", () => {
    expect(portal.groups.map((group) => group.host)).toEqual([
      "alpha.example.com",
      "beta.example.com"
    ]);
    expect(alpha.services.map((service) => service.name)).toEqual([
      "Database Admin",
      "Root",
      "Admin"
    ]);
  });

  it("builds each service's URL from its host and path", () => {
    expect(database.url).toBe("https://alpha.example.com/management/db/");
    expect(root.url).toBe("https://alpha.example.com/");
  });

  it("tries the favicon at the path, then at the root", () => {
    expect(database.iconCandidates).toEqual([
      "https://alpha.example.com/management/db/favicon.ico",
      "https://alpha.example.com/favicon.ico"
    ]);
    expect(root.iconCandidates).toEqual([
      "https://alpha.example.com/favicon.ico"
    ]);
  });

  it("looks for the favicon beside a path without a trailing slash", () => {
    expect(admin.url).toBe("https://alpha.example.com/admin");
    expect(admin.iconCandidates).toEqual([
      "https://alpha.example.com/favicon.ico"
    ]);
  });

  it("uses only the given image when there is one", () => {
    expect(chat.iconCandidates).toEqual(["https://cdn.example.com/chat.png"]);
  });

  it("takes the first character of the name as the monogram", () => {
    expect(database.monogram).toBe("D");
    expect(chat.monogram).toBe("文");
    const emoji = buildPortal({ "a.test": [{ name: "😀 Fun", path: "/" }] });
    expect(emoji.groups[0].services[0].monogram).toBe("😀");
    const lower = buildPortal({ "a.test": [{ name: "  qa", path: "/" }] });
    expect(lower.groups[0].services[0].monogram).toBe("Q");
  });

  it("gives every service a unique id", () => {
    expect([database.id, root.id, admin.id, chat.id]).toEqual([
      "service-0-0",
      "service-0-1",
      "service-0-2",
      "service-1-0"
    ]);
  });

  it("gives every host a unique anchor id", () => {
    expect([alpha.id, beta.id]).toEqual(["host-0", "host-1"]);
  });

  it("searches the name, path and host", () => {
    expect(database.searchText).toBe(
      toSearchText(["Database Admin", "/management/db/", "alpha.example.com"])
    );
  });

  it("counts hosts and services", () => {
    expect(portal.hostCount).toBe(2);
    expect(portal.serviceCount).toBe(4);
  });
});
