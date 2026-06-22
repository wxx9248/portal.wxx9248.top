import { collectPageErrors, expect, test } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const input = "[data-filter-input]";
const visibleTiles = "[data-service]:visible";

test("narrows the tiles, panels and counts as you type", async ({ page }) => {
  await page.locator(input).fill("torr");
  await expect(page.locator(visibleTiles)).toHaveCount(1);
  await expect(page.locator("[data-host-panel]:visible")).toHaveCount(1);
  await expect(page.locator("[data-host-count]").first()).toHaveText("1/3");
  await expect(page.locator("[data-filter-count]")).toHaveText(
    "1 of 5 services"
  );
});

test("matches hosts and paths, ignoring case", async ({ page }) => {
  await page.locator(input).fill("BETA.example");
  await expect(page.locator(visibleTiles)).toHaveCount(1);
  await page.locator(input).fill("/management/");
  await expect(page.locator(visibleTiles)).toHaveCount(3);
});

test("says so when nothing matches", async ({ page }) => {
  const empty = page.locator("[data-filter-empty]");
  await expect(empty).toBeHidden();
  await page.locator(input).fill("zzz");
  await expect(page.locator(visibleTiles)).toHaveCount(0);
  await expect(empty).toHaveText("No services match “zzz”.");
});

test("treats regular expression characters as text", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.locator(input).fill("(");
  await expect(page.locator(visibleTiles)).toHaveCount(0);
  await page.locator(input).fill("<Board");
  await expect(page.locator(visibleTiles)).toHaveCount(1);
  expect(errors()).toEqual([]);
});

test("Escape clears the filter and leaves it", async ({ page }) => {
  await page.locator(input).fill("torr");
  await page.locator(input).press("Escape");
  await expect(page.locator(input)).toHaveValue("");
  await expect(page.locator(input)).not.toBeFocused();
  await expect(page.locator(visibleTiles)).toHaveCount(5);
  await expect(page.locator("[data-host-count]").first()).toHaveText("3");
});

test("/ jumps to the filter, and types a slash once there", async ({
  page
}) => {
  await page.locator("body").press("/");
  await expect(page.locator(input)).toBeFocused();
  await expect(page.locator(input)).toHaveValue("");
  await page.keyboard.type("/qa");
  await expect(page.locator(input)).toHaveValue("/qa");
  await expect(page.locator(visibleTiles)).toHaveCount(1);
});
