import { expect, expectNoHorizontalOverflow, test } from "./helpers";

test("unknown paths get the 404 page", async ({ page }) => {
  const response = await page.goto("/missing/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Not found");
  await expect(
    page.getByRole("link", { name: "Back to the portal" })
  ).toHaveAttribute("href", "/");
  await expectNoHorizontalOverflow(page);
});
