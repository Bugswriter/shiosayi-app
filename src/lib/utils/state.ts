// src/lib/utils/state.ts
import { writable } from "svelte/store";
import type { GetFilmsOptions } from "$lib/services/database";
import { loadSettings, saveTheme, saveApiKey, type AppSettings, type Theme } from "./settings";
import { fetch as httpFetch } from "@tauri-apps/plugin-http";

// --- Guardian and Auth Types ---
export interface GuardianFilm {
  id: number;
  title: string;
  year: number | null;
  plot: string | null;
  poster_url: string | null;
  region: string | null;
}

export interface Guardian {
  name: string;
  email: string;
  tier: "lover" | "keeper" | "savior";
  films: GuardianFilm[];
}

// --- App State (Unchanged) ---
export type AppState = "initializing" | "ready" | "error";
export const appState = writable<AppState>("initializing");
export const appError = writable<string | null>(null);

// --- Filters Store (Unchanged) ---
const initialFilters: GetFilmsOptions = { page: 1, limit: 8, statuses: ["orphan"] };
function createFiltersStore() {
  const { subscribe, set, update } = writable<GetFilmsOptions>({ ...initialFilters });
  return { subscribe, set, update, reset: () => set({ ...initialFilters }) };
}
export const filtersStore = createFiltersStore();

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}

function createSettingsStore() {
    const { subscribe, set, update } = writable<Omit<AppSettings, 'databaseHash'>>({ apiKey: null, theme: "system" });
    return {
        subscribe,
        init: async () => {
            const initialSettings = await loadSettings();
            const { databaseHash, ...uiSettings } = initialSettings;
            set(uiSettings);
            applyTheme(uiSettings.theme);
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
                update((settings) => {
                    if (settings.theme === "system") applyTheme("system");
                    return settings;
                });
            });
            return initialSettings;
        },
        setApiKey: (key: string | null) => {
            // This is just a helper, the real save happens in the guardianStore
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


// ===================================================================
// --- CORRECTED Guardian State Store ---
// ===================================================================

function createGuardianStore() {
  const { subscribe, set } = writable<Guardian | null>(null);

  return {
    subscribe,
    authenticate: async (apiKey: string): Promise<boolean> => {
      if (!apiKey) {
        set(null);
        return false;
      }

      try {
        // THE FIX IS HERE: No 'responseType' in the options
        const response = await httpFetch(`https://sys.shiosayi.org/auth?token=${apiKey}`, {
          method: 'GET'
        });

        if (!response.ok) {
          console.error("Authentication failed:", response.status);
          set(null);
          return false;
        }

        // AND HERE: We parse the JSON from the response body
        const guardianData = await response.json() as Guardian;

        set(guardianData);
        await saveApiKey(apiKey); // Persist the key only on success
        console.log(`Guardian '${guardianData.name}' authenticated successfully.`);
        return true;

      } catch (error) {
        console.error("Error during authentication:", error);
        set(null);
        return false;
      }
    },
    logout: async () => {
      set(null);
      await saveApiKey(null);
      console.log("Guardian logged out.");
    }
  };
}

export const guardianStore = createGuardianStore();