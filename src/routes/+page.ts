// src/routes/+page.ts
import { getFilms, getRegionsWithFilmCount, type GetFilmsOptions, type Film } from '$lib/services/database';

// Note: We are not using `PageData` as an explicit return type to avoid circular references.
// SvelteKit's type inference handles this automatically.

export async function load({ url, depends, parent }) {
  await parent();
  depends('app:films');

  try {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '20');
    const searchTerm = url.searchParams.get('q') ?? undefined;
    const region = url.searchParams.get('region') ?? undefined;
    const statusParam = url.searchParams.get('status');
    const status: Film['status'] = statusParam === 'adopted' ? 'adopted' : 'orphan';

    const filters: GetFilmsOptions = { page, limit, searchTerm, region, status };

    const [paginatedResult, regions] = await Promise.all([
      getFilms(filters),
      getRegionsWithFilmCount()
    ]);

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
    console.error('Failed to load page data:', e);
    
    // --- THIS IS THE FIX ---
    // This `filters` object now perfectly matches the `GetFilmsOptions` type,
    // resolving both of the TypeScript errors you encountered.
    const errorFilters: GetFilmsOptions = {
        page: 1,
        limit: 20,
        status: 'orphan',
        searchTerm: undefined,
        region: undefined
    };

    return {
      films: [],
      totalFilms: 0,
      filters: errorFilters, // Use the correctly typed object
      regions: [],
      pagination: { page: 1, totalPages: 1 },
      error: 'Could not connect to the database. Please check your connection and try again.'
    };
  }
}