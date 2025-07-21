import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { GetFilmsOptions } from '$lib/services/database';

// --- Initial State Definition ---

/**
 * The default state of the filters when the application loads or when reset.
 * By default, it shows films with the 'orphan' status.
 */
const initialFilters: GetFilmsOptions = {
  page: 1,
  limit: 20,
  statuses: ['orphan'],
  searchTerm: undefined,
  region: undefined,
};

// --- Main Writable Store ---

/**
 * A factory function to create the main filters store.
 * This holds the complete, current state of all film filters.
 */
function createFiltersStore() {
  const { subscribe, set, update } = writable<GetFilmsOptions>({ ...initialFilters });

  return {
    subscribe,
    set,
    update,
    /**
     * Resets the filters back to their initial default state.
     */
    reset: () => set({ ...initialFilters })
  };
}

/**
 * The main writable store for managing film filters.
 * All filter UI components should interact with this store to update the filter state.
 */
export const filtersStore: Writable<GetFilmsOptions> & { reset: () => void } = createFiltersStore();


// --- Derived Stores for UI and API Logic ---

export const isShowAllState: Readable<boolean> = derived(
  filtersStore, 
  ($filters) => {
    const hasSearch = !!$filters.searchTerm;
    const hasRegion = !!$filters.region;
    const hasStatusFilter = $filters.statuses && $filters.statuses.length > 0;

    // It's a "show all" state only if all of these are false.
    return !hasSearch && !hasRegion && !hasStatusFilter;
  }
);

export const activeFiltersForApi: Readable<Omit<GetFilmsOptions, 'page' | 'limit'>> = derived(
  filtersStore, 
  ($filters) => {
    const active: Omit<GetFilmsOptions, 'page' | 'limit'> = {};
  
    if ($filters.searchTerm) {
      active.searchTerm = $filters.searchTerm;
    }
    
    // Only include the 'statuses' key in the API call if at least one status is selected.
    if ($filters.statuses && $filters.statuses.length > 0) {
      active.statuses = $filters.statuses;
    }
    
    if ($filters.region) {
      active.region = $filters.region;
    }
    
    return active;
  }
);