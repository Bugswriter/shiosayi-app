import { writable } from "svelte/store";
import type { GetFilmsOptions } from "$lib/services/database";
import {
  loadSettings,
  saveTheme,
  saveApiKey,
  type AppSettings,
  type Theme,
} from "./settings";

// ... (Global App State and Film Filters State are unchanged)
export type AppState = "initializing" | "ready" | "error";
export const appState = writable<AppState>("initializing");
export const appError = writable<string | null>(null);

const initialFilters: GetFilmsOptions = {
  page: 1,
  limit: 8,
  statuses: ["orphan"],
};

function createFiltersStore() {
  const { subscribe, set, update } = writable<GetFilmsOptions>({ ...initialFilters });
  return { subscribe, set, update, reset: () => set({ ...initialFilters }) };
}
export const filtersStore = createFiltersStore();

// ===================================================================
// --- Persistent Settings State (LOGIC UPDATED HERE) ---
// ===================================================================

/**
 * Applies the theme by setting the `data-theme` attribute on the root <html> element.
 * This is the only function that needs to change.
 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Determine the effective theme. If 'system', check the OS preference.
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Set the data-theme attribute for dark mode, or remove it for light mode.
  if (isDark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}

// The store itself remains structurally the same. It correctly calls our new applyTheme function.
function createSettingsStore() {
  const { subscribe, set, update } = writable<Omit<AppSettings, 'databaseHash'>>({
    apiKey: null,
    theme: "system",
  });

  return {
    subscribe,
    init: async () => {
      const initialSettings = await loadSettings();
      const { databaseHash, ...uiSettings } = initialSettings;
      set(uiSettings);
      applyTheme(uiSettings.theme);

      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        update((settings) => {
          if (settings.theme === "system") {
            applyTheme("system");
          }
          return settings;
        });
      });
    },
    setApiKey: (key: string | null) => {
      saveApiKey(key);
      update((settings) => ({ ...settings, apiKey: key }));
    },
    setTheme: (theme: Theme) => {
      saveTheme(theme);
      applyTheme(theme);
      update((settings) => ({ ...settings, theme: theme }));
    },
  };
}
export const settingsStore = createSettingsStore();