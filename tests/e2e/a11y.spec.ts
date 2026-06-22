import { expect, expectAccessible, test } from "./helpers";

test("the portal passes axe", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-icon][data-state='loaded']")).toHaveCount(3);
  await expectAccessible(page);
});

test("the portal passes axe while filtering", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-filter-input]").fill("zzz");
  await expectAccessible(page);
});

test("the 404 page passes axe", async ({ page }) => {
  await page.goto("/missing/");
  await expectAccessible(page);
});
