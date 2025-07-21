import { LazyStore } from "@tauri-apps/plugin-store";

export type Theme = "system" | "light" | "dark";

export interface AppSettings {
  apiKey: string | null;
  theme: Theme;
  databaseHash: string | null;
}

const store = new LazyStore("settings.json");

export async function loadSettings(): Promise<AppSettings> {
  const defaults: AppSettings = { apiKey: null, theme: "system", databaseHash: null };
  const apiKey = (await store.get<string | null>("apiKey")) ?? defaults.apiKey;
  const theme = (await store.get<Theme>("theme")) ?? defaults.theme;
  const databaseHash = (await store.get<string | null>("databaseHash")) ?? defaults.databaseHash;
  return { apiKey, theme, databaseHash };
}

export async function saveApiKey(key: string | null): Promise<void> {
  await store.set("apiKey", key);
  await store.save();
}

export async function saveTheme(theme: Theme): Promise<void> {
  await store.set("theme", theme);
  await store.save();
}

export async function getDatabaseHash(): Promise<string | null> {
  const hash = await store.get<string | null>("databaseHash");
  return hash ?? null;
}

export async function saveDatabaseHash(hash: string | null): Promise<void> {
  await store.set("databaseHash", hash);
  await store.save();
}