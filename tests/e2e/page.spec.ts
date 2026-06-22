import {
  collectCspViolations,
  expect,
  expectNoHorizontalOverflow,
  test
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("the prompt runs tree and the heading is its root", async ({ page }) => {
  await expect(page.locator(".prompt-line")).toContainText("tree ~/services");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("portal/");
});

test("the hero's tree lists every host with its service count", async ({
  page
}) => {
  const tree = page.getByRole("navigation", { name: "Hosts" });
  const lines = tree.getByRole("link");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toHaveAccessibleName(
    "alpha.example.test 3 services"
  );
  await expect(lines.nth(1)).toHaveAccessibleName(
    "beta.example.test 1 service"
  );
  await expect(lines.nth(2)).toHaveAccessibleName(
    "gamma.example.test 1 service"
  );
  // What the eye sees: the host, then the bare count
  await expect(tree.locator("[data-tree-host]")).toHaveText([
    "alpha.example.test",
    "beta.example.test",
    "gamma.example.test"
  ]);
  await expect(tree.locator("[data-tree-count] [aria-hidden]")).toHaveText([
    "3",
    "1",
    "1"
  ]);
});

test("a line of the tree jumps to its host's panel", async ({ page }) => {
  const tree = page.getByRole("navigation", { name: "Hosts" });
  await tree.getByRole("link", { name: /^gamma\.example\.test/u }).click();
  await expect(page).toHaveURL(/#host-2$/u);
  const panel = page.getByRole("region", { name: "gamma.example.test" });
  await expect(panel).toBeInViewport({ ratio: 1 });
});

test("a long hostname in the tree is cut short, not wrapped", async ({
  page
}) => {
  const line = page
    .getByRole("navigation", { name: "Hosts" })
    .getByRole("link")
    .first();
  const before = await line.boundingBox();
  await line
    .locator("[data-tree-host]")
    .evaluate(
      (host) => (host.textContent = `${"very-long-name.".repeat(12)}test`)
    );
  expect((await line.boundingBox())?.height).toBe(before?.height);
  await expect(line.locator("[data-tree-count]")).toBeInViewport();
  await expectNoHorizontalOverflow(page);
});

test("groups the services into one titled panel per host", async ({ page }) => {
  const panels = page.locator("[data-host-panel]");
  await expect(panels).toHaveCount(3);
  await expect(panels.locator("h2")).toHaveText([
    "alpha.example.test · 3",
    "beta.example.test · 1",
    "gamma.example.test · 1"
  ]);
  await expect(
    page.getByRole("region", { name: "alpha.example.test" })
  ).toBeVisible();
});

test("each tile links to its service in a new tab", async ({ page }) => {
  const link = page.getByRole("link", { name: /^Database Admin/u });
  await expect(link).toHaveAttribute(
    "href",
    "https://alpha.example.test/management/db/"
  );
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/u);
  await expect(link).toHaveAttribute("rel", /noreferrer/u);
  await expect(page.getByRole("link", { name: /^文件共享/u })).toHaveAttribute(
    "href",
    "https://gamma.example.test/"
  );
});

test("shows names as text, whatever characters they have", async ({ page }) => {
  await expect(page.getByText("Q&A <Board>", { exact: true })).toBeVisible();
  const gamma = page.locator("[data-service]").filter({ hasText: "文件共享" });
  await expect(gamma.locator(".monogram")).toHaveText("文");
});

test("the status bar counts hosts and services", async ({ page }) => {
  await expect(page.locator(".status-bar")).toContainText(
    "3 hosts · 5 services"
  );
});

test("fits the viewport and breaks no security policy", async ({ page }) => {
  const violations = collectCspViolations(page);
  await page.reload();
  await expectNoHorizontalOverflow(page);
  await expect(page.locator("html")).toHaveClass(/js/u);
  expect(violations()).toEqual([]);
});
