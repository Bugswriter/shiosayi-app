// src/routes/+page.ts
import { getFilms, getRegionsWithFilmCount, type GetFilmsOptions, type Film } from '$lib/services/database';
import type { PageData } from './$types';

export async function load({ url, depends }): Promise<PageData> {
  // It's good practice to declare a dependency on the URL
  // so SvelteKit knows to re-run this function when the URL changes.
  depends('app:films');

  try {
    // --- Filters from URL (no changes here) ---
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '20');
    const searchTerm = url.searchParams.get('q') ?? undefined;
    const region = url.searchParams.get('region') ?? undefined; // Read region from URL
    const statusesParam = url.searchParams.get('statuses');
    const statuses = statusesParam
      ? (statusesParam.split(',') as Film['status'][])
      : ['orphan'];

    const filters: GetFilmsOptions = { page, limit, searchTerm, region, statuses };

    // --- Data Fetching ---
    // Use Promise.all to fetch films and regions concurrently for better performance
    const [paginatedResult, regions] = await Promise.all([
      getFilms(filters),
      getRegionsWithFilmCount() // <-- FETCH THE REGIONS HERE
    ]);

    // --- Return Data ---
    return {
      films: paginatedResult.films,
      totalFilms: paginatedResult.totalFilms,
      filters,
      regions, // <-- PASS REGIONS TO THE PAGE
      pagination: {
        page: filters.page,
        totalPages: Math.ceil(paginatedResult.totalFilms / filters.limit)
      },
      error: null
    };
  } catch (e) {
    console.error('Failed to load page data:', e);
    // Return a default shape on error
    return {
      films: [],
      totalFilms: 0,
      filters: { page: 1, limit: 20, statuses: ['orphan'] },
      regions: [],
      pagination: { page: 1, totalPages: 1 },
      error: 'Could not connect to the database.'
    };
  }
}