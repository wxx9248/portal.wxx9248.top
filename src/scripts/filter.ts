/*
 * Filters the service tiles as the visitor types. "/" focuses the filter and
 * Escape clears it. Matching uses the same function as the page's search text.
 */
import { matches, normalizeQuery } from "@/lib/search/match";
import { t, tCount } from "@/i18n/t";

const input = document.querySelector<HTMLInputElement>("[data-filter-input]");
const count = document.querySelector<HTMLElement>("[data-filter-count]");
const empty = document.querySelector<HTMLElement>("[data-filter-empty]");
const panels = [...document.querySelectorAll<HTMLElement>("[data-host-panel]")];
const tiles = [...document.querySelectorAll<HTMLElement>("[data-service]")];

const isVisible = (element: HTMLElement): boolean => !element.hidden;

function updatePanel(panel: HTMLElement, query: string): void {
  const panelTiles = [...panel.querySelectorAll<HTMLElement>("[data-service]")];
  const shown = panelTiles.filter(isVisible).length;
  panel.hidden = !panelTiles.some(isVisible);
  const label = panel.querySelector<HTMLElement>("[data-host-count]");
  if (label) {
    label.textContent =
      query === ""
        ? String(panelTiles.length)
        : t("panel.filtered", { count: panelTiles.length, shown });
  }
}

function update(): void {
  const rawQuery = input?.value ?? "";
  const query = normalizeQuery(rawQuery);
  for (const tile of tiles) {
    tile.hidden = !matches(tile.dataset.search ?? "", query);
  }
  for (const panel of panels) {
    updatePanel(panel, query);
  }
  const shown = tiles.filter(isVisible).length;
  if (count) {
    count.textContent = tCount("count.matching", tiles.length, { shown });
  }
  if (empty) {
    empty.hidden = tiles.some(isVisible);
    empty.textContent = t("filter.empty", { query: rawQuery.trim() });
  }
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select") !== null)
  );
}

function onShortcut(event: KeyboardEvent): void {
  const modified = event.altKey || event.ctrlKey || event.metaKey;
  if (event.key === "/" && !modified && !isEditable(event.target)) {
    event.preventDefault();
    input?.focus();
  }
}

function onInputKey(event: KeyboardEvent): void {
  if (event.key === "Escape" && input) {
    event.preventDefault();
    input.value = "";
    update();
    input.blur();
  }
}

input?.addEventListener("input", update);
input?.addEventListener("keydown", onInputKey);
document.addEventListener("keydown", onShortcut);
// The browser may restore a typed query on reload or back navigation
update();
