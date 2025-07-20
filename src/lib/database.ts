import Database from '@tauri-apps/plugin-sql';
import { appDataDir, join } from '@tauri-apps/api/path';

export interface Film {
  id: number;
  title: string;
  year: number | null;
  plot: string | null;
  poster_url: string | null;
  region: string | null;
  guardian_id: string | null;
  status: 'orphan' | 'adopted' | 'abandoned';
  updated_at: string | null;
  guardian_name: string | null;
}

interface PaginatedFilmsResult {
  films: Film[];
  totalFilms: number;
}

let db: Database | null = null;

async function getDb(): Promise<Database> {
  if (db) return db;
  const dataDir = await appDataDir();
  const dbPath = await join(dataDir, 'public.db');
  db = await Database.load(`sqlite:${dbPath}`);
  return db;
}

const baseSelectQuery = `
  SELECT films.*, guardians.name as guardian_name
  FROM films LEFT JOIN guardians ON films.guardian_id = guardians.id
`;

// ===== Get Films (Universal) ===== //

export interface GetFilmsOptions {
  page: number;
  limit: number;
  searchTerm?: string;
  statuses?: ('orphan' | 'adopted' | 'abandoned')[];
  region?: string;
}

export async function getFilms(options: GetFilmsOptions): Promise<PaginatedFilmsResult> {
  const { page, limit, searchTerm, statuses, region } = options;

  const db = await getDb();
  const offset = (page - 1) * limit;

  const whereClauses: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (searchTerm) {
    whereClauses.push(`films.title LIKE $${paramIndex++}`);
    params.push(`%${searchTerm}%`);
  }

  if (statuses && statuses.length > 0) {
    const placeholders = statuses.map(() => `$${paramIndex++}`).join(', ');
    whereClauses.push(`films.status IN (${placeholders})`);
    params.push(...statuses);
  }

  if (region) {
    whereClauses.push(`films.region = $${paramIndex++}`);
    params.push(region);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const filmsQuery = `
    ${baseSelectQuery}
    ${whereString}
    ORDER BY films.title ASC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  const filmsParams = [...params, limit, offset];

  // The COUNT query needs the same WHERE clause to get an accurate total for the filtered results.
  const countQuery = `SELECT COUNT(*) as count FROM films ${whereString}`;
  const countParams = [...params];

  const films: Film[] = await db.select(filmsQuery, filmsParams);
  const result: { count: number }[] = await db.select(countQuery, countParams);
  const totalFilms = result[0]?.count ?? 0;

  return { films, totalFilms };
}

// ===== Get Regions (with Film Count) ===== //

export interface RegionWithCount {
  region: string;
  film_count: number;
}

export async function getRegionsWithFilmCount(): Promise<RegionWithCount[]> {
  const db = await getDb();
  const query = `
    SELECT
      region,
      COUNT(*) AS film_count
    FROM
      films
    WHERE
      region IS NOT NULL AND region != ''
    GROUP BY
      region
    ORDER BY
      region ASC
  `;
  const results: RegionWithCount[] = await db.select(query);
  return results;
}