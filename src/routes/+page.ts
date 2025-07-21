import { getFilms, getRegionsWithFilmCount, type GetFilmsOptions, type Film } from '$lib/services/database';
import type { PageData } from './$types';

export async function load({ url, depends, parent }): Promise<PageData> {
  await parent();

  depends('app:films');

  try {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '20');
    const searchTerm = url.searchParams.get('q') ?? undefined;
    const region = url.searchParams.get('region') ?? undefined;
    
    const validStatuses: Film['status'][] = ['orphan', 'adopted', 'abandoned'];
    const statusesParam = url.searchParams.get('statuses');
    
    const statuses = statusesParam
      ? statusesParam.split(',').filter((s): s is Film['status'] => 
          validStatuses.includes(s as Film['status'])
        )
      : ['orphan'];

    if (statuses.length === 0) {
      statuses.push('orphan');
    }

    const filters: GetFilmsOptions = { page, limit, searchTerm, region, statuses };

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