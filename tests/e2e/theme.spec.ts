import { expect, test } from "./helpers";

const colorScheme = (): string =>
  getComputedStyle(document.documentElement).colorScheme;

// Each project sets the system theme; the toggle switches to the other one
const themes = (system: string | null | undefined): [string, string] =>
  system === "dark" ? ["dark", "light"] : ["light", "dark"];

test("follows the system theme until the toggle is used", async ({
  page
}, testInfo) => {
  const [system] = themes(testInfo.project.use.colorScheme);
  await page.goto("/");
  expect(await page.evaluate(colorScheme)).toBe(system);
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
});

test("the toggle switches the theme and the choice survives a reload", async ({
  page
}, testInfo) => {
  const [, other] = themes(testInfo.project.use.colorScheme);
  await page.goto("/");
  await page.getByRole("button", { name: "Switch theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", other);
  expect(await page.evaluate(colorScheme)).toBe(other);

  // The inline script in <head> must set it before the body is parsed
  await page.addInitScript(() => {
    const seen = window as unknown as { themeAtBody?: string };
    new MutationObserver((_records, observer) => {
      if (document.body) {
        seen.themeAtBody = document.documentElement.dataset.theme;
        observer.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", other);
  expect(
    await page.evaluate(
      () => (window as unknown as { themeAtBody?: string }).themeAtBody
    )
  ).toBe(other);
});
