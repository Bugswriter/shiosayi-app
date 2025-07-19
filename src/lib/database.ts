import Database from '@tauri-apps/plugin-sql';
import { appDataDir, join } from '@tauri-apps/api/path';

export interface Film {
  id: number;
  title: string;
  year: number;
}

let db: Database | null = null;

async function getDb(): Promise<Database> {
  if (db) {
    return db;
  }

  const dataDir = await appDataDir();
  const dbPath = await join(dataDir, 'public.db');
  db = await Database.load(`sqlite:${dbPath}`);
  
  return db;
}

interface PaginatedFilmsResult {
  films: Film[];
  totalFilms: number;
}

export async function getPaginatedFilms(page: number, limit: number): Promise<PaginatedFilmsResult> {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const films: Film[] = await db.select(
    'SELECT * FROM films ORDER BY title ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const result: { count: number }[] = await db.select('SELECT COUNT(*) as count FROM films');
  const totalFilms = result[0]?.count ?? 0;

  return { films, totalFilms };
}