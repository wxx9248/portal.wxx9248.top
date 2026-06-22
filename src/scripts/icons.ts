/*
 * Tries each icon candidate in turn and shows the first that decodes; the
 * monogram stays when none does. decode() also settles for images that
 * finished (or failed) before this script ran, and rejects non-images, such
 * as a login page answering for /favicon.ico.
 */
function parseCandidates(img: HTMLImageElement): string[] {
  const parsed: unknown = JSON.parse(img.dataset.candidates ?? "[]");
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

async function settle(img: HTMLImageElement, icon: HTMLElement): Promise<void> {
  for (const candidate of parseCandidates(img)) {
    if (img.getAttribute("src") !== candidate) {
      img.src = candidate;
    }
    try {
      await img.decode();
      icon.dataset.state = "loaded";
      return;
    } catch {
      // Try the next candidate
    }
  }
  img.remove();
}

for (const icon of document.querySelectorAll<HTMLElement>("[data-icon]")) {
  const img = icon.querySelector("img");
  if (img) {
    settle(img, icon).catch(() => img.remove());
  }
}
