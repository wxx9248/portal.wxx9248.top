/*
 * The inline <head> script, rendered by the layout only, so the browser
 * bundle of theme.ts doesn't carry this string: it marks that scripts run
 * (html.js) and applies the stored theme before first paint
 */
import { initTheme, themeStorageKey } from "@/scripts/theme";

export const headScript = `document.documentElement.classList.add("js");(${initTheme.toString()})(${JSON.stringify(themeStorageKey)});`;
