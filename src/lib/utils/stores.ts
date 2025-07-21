import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { GetFilmsOptions } from '$lib/services/database';

// ====================================================================
// --- Film Filters Store (Your existing code - NO CHANGES HERE) ---
// ====================================================================

const initialFilters: GetFilmsOptions = {
  page: 1,
  limit: 20,
  statuses: ['orphan'],
  searchTerm: undefined,
  region: undefined,
};

function createFiltersStore() {
  const { subscribe, set, update } = writable<GetFilmsOptions>({ ...initialFilters });

  return {
    subscribe,
    set,
    update,
    reset: () => set({ ...initialFilters })
  };
}

export const filtersStore: Writable<GetFilmsOptions> & { reset: () => void } = createFiltersStore();

export const isShowAllState: Readable<boolean> = derived(
  filtersStore, 
  ($filters) => {
    const hasSearch = !!$filters.searchTerm;
    const hasRegion = !!$filters.region;
    const hasStatusFilter = $filters.statuses && $filters.statuses.length > 0;
    return !hasSearch && !hasRegion && !hasStatusFilter;
  }
);

export const activeFiltersForApi: Readable<Omit<GetFilmsOptions, 'page' | 'limit'>> = derived(
  filtersStore, 
  ($filters) => {
    const active: Omit<GetFilmsOptions, 'page' | 'limit'> = {};
    if ($filters.searchTerm) active.searchTerm = $filters.searchTerm;
    if ($filters.statuses && $filters.statuses.length > 0) active.statuses = $filters.statuses;
    if ($filters.region) active.region = $filters.region;
    return active;
  }
);

// ===================================================================
// --- Settings Store (NEW CODE ADDED HERE) ---
// ===================================================================

// --- Types and Interfaces for Settings ---
export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  apiKey: string | null;
  theme: Theme;
}

// --- Helper function to apply the theme to the <html> element ---
function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return; // Guard for server-side rendering
  const root = document.documentElement;

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// --- The Main Settings Store ---
function createSettingsStore() {
  // Get initial values from localStorage, or use defaults
  const initialTheme = (typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : 'system') || 'system';
  const initialApiKey = (typeof window !== 'undefined' ? localStorage.getItem('apiKey') : null);

  const { subscribe, update } = writable<Settings>({
    apiKey: initialApiKey,
    theme: initialTheme
  });

  return {
    subscribe,
    // Method to set the API key and save it to localStorage
    setApiKey: (key: string) => {
      localStorage.setItem('apiKey', key);
      update(settings => ({ ...settings, apiKey: key }));
    },
    // Method to set the theme, save it, and apply it
    setTheme: (theme: Theme) => {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
      update(settings => ({ ...settings, theme: theme }));
    },
    // Initialize the theme on app load
    init: () => {
      // Re-read from storage in case it was changed in another tab
      const currentTheme = (localStorage.getItem('theme') as Theme) || 'system';
      applyTheme(currentTheme);
    }
  };
}

export const settingsStore = createSettingsStore();