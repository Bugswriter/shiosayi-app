// src/routes/+page.ts
import { getFilms, getRegionsWithFilmCount, type GetFilmsOptions, type Film } from '$lib/services/database';
import type { PageData } from './$types';

export async function load({ url, depends, parent }) {
  // This ensures layout data (like auth state) is loaded first.
  await parent();

  // This tells SvelteKit to re-run this load function whenever 'app:films' is invalidated.
  depends('app:films');

  try {
    // --- Parse URL parameters with safe defaults ---
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '20');
    const searchTerm = url.searchParams.get('q') ?? undefined;
    const region = url.searchParams.get('region') ?? undefined;

    // --- CORRECTED: Logic for handling a single status parameter ---
    const statusParam = url.searchParams.get('status');
    
    // Set status to 'adopted' only if the param is exactly that, otherwise default to 'orphan'.
    // This handles missing params, incorrect values, and the 'orphan' case cleanly.
    const status: Film['status'] = statusParam === 'adopted' ? 'adopted' : 'orphan';

    // Assemble the filters object to pass to the database function.
    const filters: GetFilmsOptions = { page, limit, searchTerm, region, status };

    // Fetch the film data and region list in parallel for efficiency.
    const [paginatedResult, regions] = await Promise.all([
      getFilms(filters),
      getRegionsWithFilmCount()
    ]);

    // Return the successfully loaded data to the page component.
    return {
      films: paginatedResult.films,
      totalFilms: paginatedResult.totalFilms,
      filters,
      regions,
      pagination: {
        page: filters.page,
        totalPages: Math.ceil(paginatedResult.totalFilms / filters.limit)
      },
      error: null
    };
  } catch (e) {
    // This block runs if the database connection or queries fail.
    console.error('Failed to load page data:', e);
    
    // Return a safe, empty state to prevent the page from crashing.
    return {
      films: [],
      totalFilms: 0,
      // CORRECTED: The fallback filter object now uses the single 'status' property.
      filters: { page: 1, limit: 20, status: 'orphan' },
      regions: [],
      pagination: { page: 1, totalPages: 1 },
      error: 'Could not connect to the database. Please check your connection and try again.'
    };
  }
}