import type { PageLoad } from './$types';
import { getPaginatedFilms } from '$lib/database';

export const load: PageLoad = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 5;

    const { films, totalFilms } = await getPaginatedFilms(page, limit);

    return {
      films,
      pagination: {
        page,
        limit,
        totalFilms,
        totalPages: Math.ceil(totalFilms / limit),
      },
      error: null,
    };
  } catch (e: any) {
    return {
      films: [],
      pagination: { page: 1, limit: 5, totalFilms: 0, totalPages: 1 },
      error: e.message || 'An unknown error occurred.',
    };
  }
};