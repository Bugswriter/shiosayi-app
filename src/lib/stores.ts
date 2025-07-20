// src/lib/stores.ts

import { writable } from 'svelte/store';
import type { GetFilmsOptions } from '$lib/database';

const initialFilters: GetFilmsOptions = {
  page: 1,
  limit: 20,
  statuses: ['orphan']
};

export const filtersStore = writable<GetFilmsOptions>(initialFilters);