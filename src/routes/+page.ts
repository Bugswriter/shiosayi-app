import type { PageLoad } from './$types';
import { getPaginatedFilms, searchFilms } from '$lib/database';

export const load: PageLoad = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const searchTerm = url.searchParams.get('q') || '';
    const limit = 10;
    
    let result;
    if (searchTerm) {
      result = await searchFilms(searchTerm, page, limit);
    } else {
      result = await getPaginatedFilms(page, limit);
    }

    return {
      films: result.films,
      searchTerm,
      pagination: {
        page,
        limit,
        totalFilms: result.totalFilms,
        totalPages: Math.ceil(result.totalFilms / limit),
      },
      error: null,
    };
  } catch (e: any) {
    return {
      films: [],
      searchTerm: '',
      pagination: { page: 1, limit: 10, totalFilms: 0, totalPages: 1 },
      error: e.message || 'An unknown error occurred.',
    };
  }
};