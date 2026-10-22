export {};

const THEME_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";
type Theme = typeof LIGHT | typeof DARK;

declare global {
  interface Window {
    __theme?: { value: Theme };
  }
}

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === LIGHT || stored === DARK) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// Reuse the value already set by the inline FOUC-prevention script if available.
let themeValue: Theme = window.__theme?.value ?? getPreferredTheme();

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  window.__theme = { value: themeValue };
  reflect();
}

function reflect(): void {
  document.firstElementChild?.setAttribute("data-theme", themeValue);
  const themeButton = document.querySelector<HTMLButtonElement>("#theme-btn");
  const nextTheme = themeValue === LIGHT ? DARK : LIGHT;
  themeButton?.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeButton?.setAttribute("title", `Switch to ${nextTheme} mode`);
  themeButton?.setAttribute("aria-pressed", String(themeValue === DARK));

  // Fill <meta name="theme-color"> with the computed background colour so
  // Android's browser chrome matches the page background.
  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

reflect();
document.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("#theme-btn")) {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  }
});

// Re-run after View Transitions navigation.
document.addEventListener("astro:after-swap", reflect);

// Carry the theme-color value across View Transitions to prevent the
// Android navigation bar from flashing during page transitions.
document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});

// Sync with OS-level dark/light preference changes.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === LIGHT || stored === DARK) return;
    themeValue = matches ? DARK : LIGHT;
    window.__theme = { value: themeValue };
    reflect();
  });
