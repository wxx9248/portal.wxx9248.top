import { ref, watchEffect } from "vue";

type Theme = "dark" | "light";

const STORAGE_KEY = "portal-theme";

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  return prefersLight ? "light" : "dark";
}

const theme = ref<Theme>(initialTheme());

// Reflect the current theme onto <html> and persist the choice.
watchEffect(() => {
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem(STORAGE_KEY, theme.value);
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  return { theme, toggle };
}
