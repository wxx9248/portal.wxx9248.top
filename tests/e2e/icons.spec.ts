import { expect, test } from "./helpers";

const icon = (name: string): string =>
  `[data-service]:has-text("${name}") [data-icon]`;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("falls back from the path's favicon to the host's", async ({ page }) => {
  // The stub has no favicon at /management/db/, only at the root
  const database = page.locator(icon("Database Admin"));
  await expect(database).toHaveAttribute("data-state", "loaded");
  await expect(database.locator("img")).toBeVisible();
  await expect(database.locator("img")).toHaveAttribute(
    "src",
    "https://alpha.example.test/favicon.ico"
  );
  await expect(database.locator(".monogram")).toBeHidden();
});

test("keeps the monogram when the image is not an image", async ({ page }) => {
  const chat = page.locator(icon("Chat Server Admin"));
  await expect(chat.locator("img")).toHaveCount(0);
  await expect(chat.locator(".monogram")).toBeVisible();
  await expect(chat).toHaveAttribute("data-state", "pending");
});

test("keeps the monogram when no favicon exists", async ({ page }) => {
  const gamma = page.locator(icon("文件共享"));
  await expect(gamma.locator("img")).toHaveCount(0);
  await expect(gamma.locator(".monogram")).toHaveText("文");
});
