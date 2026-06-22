import { expect, test } from "./helpers";

test.use({ javaScriptEnabled: false });

test("lists every service with monograms and no filter", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-service]")).toHaveCount(5);
  await expect(page.locator("[data-service] .monogram")).toHaveCount(5);
  for (const monogram of await page.locator("[data-service] .monogram").all()) {
    await expect(monogram).toBeVisible();
  }
  await expect(page.locator("[data-service] img:visible")).toHaveCount(0);
  await expect(page.locator("[data-filter]")).toBeHidden();
});
