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
  id: string; // <-- This line is essential
  name: string;
  email: string;
  tier: "lover" | "keeper" | "savior";
}

// ===================================================================
// --- NEW: A Robust, Centralized Authentication Store ---
// ===================================================================
export interface AuthState {
  status: "pending" | "authenticated" | "unauthenticated";
  guardian: Guardian | null;
  apiKey: string | null;
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>({
    status: "pending", // Start in a pending state
    guardian: null,
    apiKey: null,
  });

  return {
    subscribe,
    /**
     * This function is called once when the app starts.
     * It loads the key from disk and tries to authenticate.
     */
    async initialize() {
      const settings = await loadSettings();
      if (settings.apiKey) {
        // A key exists, so let's try to authenticate with it.
        await this.authenticate(settings.apiKey);
      } else {
        // No key found, user is unauthenticated.
        set({ status: "unauthenticated", guardian: null, apiKey: null });
      }
    },
    
    /**
     * Authenticates a user with the given API key.
     * This is used by the login page and the initialize function.
     */
    async authenticate(apiKey: string): Promise<boolean> {
      if (!apiKey) {
        set({ status: "unauthenticated", guardian: null, apiKey: null });
        return false;
      }

      try {
        const response = await httpFetch(`https://sys.shiosayi.org/auth?token=${apiKey}`, {
          method: 'GET'
        });

        if (!response.ok) {
          console.error("Authentication failed:", response.status);
          await saveApiKey(null); // Clear invalid key from storage
          set({ status: "unauthenticated", guardian: null, apiKey: null });
          return false;
        }

        const guardianData = await response.json() as Guardian;
        await saveApiKey(apiKey); // Persist the valid key

        // SUCCESS: Set the state to authenticated with all user data
        set({ status: "authenticated", guardian: guardianData, apiKey: apiKey });
        console.log(`Guardian '${guardianData.name}' authenticated successfully.`);
        return true;

      } catch (error) {
        console.error("Error during authentication:", error);
        // On network error, etc., we consider the user unauthenticated for this session
        set({ status: "unauthenticated", guardian: null, apiKey: null });
        return false;
      }
    },

    /**
     * Logs the user out and clears all related state.
     */
    async logout() {
      await saveApiKey(null);
      set({ status: "unauthenticated", guardian: null, apiKey: null });
      console.log("Guardian logged out.");
    }
  };
}

export const authStore = createAuthStore();


// --- Other stores remain as they were ---
export type AppState = "initializing" | "ready" | "error";
export const appState = writable<AppState>("initializing");
export const appError = writable<string | null>(null);

const initialFilters: GetFilmsOptions = { page: 1, limit: 20, status: "orphan" };
function createFiltersStore() {
  const { subscribe, set, update } = writable<GetFilmsOptions>({ ...initialFilters });
  return { subscribe, set, update, reset: () => set({ ...initialFilters }) };
}
export const filtersStore = createFiltersStore();

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.setAttribute("data-theme", isDark ? "dark" : "light");
}

function createSettingsStore() {
    const { subscribe, set, update } = writable<Omit<AppSettings, 'databaseHash' | 'apiKey'>>({ theme: "system" });
    return {
        subscribe,
        init: async () => {
            const initialSettings = await loadSettings();
            set({ theme: initialSettings.theme });
            applyTheme(initialSettings.theme);
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
                update((settings) => {
                    if (settings.theme === "system") applyTheme("system");
                    return settings;
                });
            });
            // Return the full settings object for the DB initializer
            return initialSettings;
        },
        setTheme: (theme: Theme) => {
            saveTheme(theme);
            applyTheme(theme);
            update((settings) => ({ ...settings, theme: theme }));
        },
    };
}
export const settingsStore = createSettingsStore();