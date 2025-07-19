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

export async function getPaginatedFilms(page: number, limit: number): Promise<PaginatedFilmsResult> {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const films: Film[] = await db.select(`${baseSelectQuery} ORDER BY films.title ASC LIMIT $1 OFFSET $2`, [limit, offset]);
  const result: { count: number }[] = await db.select('SELECT COUNT(*) as count FROM films');
  const totalFilms = result[0]?.count ?? 0;

  return { films, totalFilms };
}

export async function searchFilms(searchTerm: string, page: number, limit: number): Promise<PaginatedFilmsResult> {
  const db = await getDb();
  const offset = (page - 1) * limit;
  const likeTerm = `%${searchTerm}%`;

  const films: Film[] = await db.select(`${baseSelectQuery} WHERE films.title LIKE $1 ORDER BY films.title ASC LIMIT $2 OFFSET $3`, [likeTerm, limit, offset]);
  const result: { count: number }[] = await db.select(`SELECT COUNT(*) as count FROM films WHERE title LIKE $1`, [likeTerm]);
  const totalFilms = result[0]?.count ?? 0;

  return { films, totalFilms };
}