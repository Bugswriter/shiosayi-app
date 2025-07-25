// src/lib/services/init.ts
import { exists, open, BaseDirectory } from "@tauri-apps/plugin-fs";
import { fetch as httpFetch } from "@tauri-apps/plugin-http";
import { getDatabaseHash, saveDatabaseHash } from "$lib/utils/settings";
import { settingsStore, authStore } from "$lib/utils/state";
import { closeDbConnection } from "$lib/services/database";

const DB_URL = "https://sys.shiosayi.org/db/public";
const HASH_URL = "https://sys.shiosayi.org/db/public.sha256";
const DB_FILENAME = "public.db";



async function downloadAndWriteDb(remoteHash: string): Promise<void> {
  await closeDbConnection();

  const response = await httpFetch(DB_URL, {
    method: "GET",
    // Explicitly tell the plugin to return the body as raw bytes.
    // This ensures consistent behavior across platforms.
    responseType: "bytes" 
  });

  if (!response.ok) {
    throw new Error(`Failed to download database: ${response.status}`);
  }

  // --- THE FIX ---
  // The raw byte data is in the `data` property.
  // We ensure it's a Uint8Array, which is the standard format.
  const dbBytes = new Uint8Array(response.data as number[]);

  // The rest of the function works perfectly with a Uint8Array.
  const digest = await crypto.subtle.digest("SHA-256", dbBytes);
  const actualHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (actualHash !== remoteHash) {
    throw new Error("Database verification failed. Downloaded file is corrupt.");
  }

  console.log("> Trying to write database to disk", DB_FILENAME);
  const file = await open(DB_FILENAME, {
    write: true,
    create: true,
    truncate: true,
    baseDir: BaseDirectory.AppData,
  });

  await file.write(dbBytes);
  await file.close();
  console.log("> Database written successfully.");
}

export async function initializeApp(): Promise<void> {
  // 1. Initialize settings (theme) and authentication concurrently
  await Promise.all([
    settingsStore.init(),
    authStore.initialize() // This now handles all auth logic on startup
  ]);

  // 2. Initialize the database (check for updates)
  console.log("> Checking database status...");
  const dbExists = await exists(DB_FILENAME, { baseDir: BaseDirectory.AppData });
  let remoteHash: string | null = null;

  try {
    const hashResponse = await httpFetch(HASH_URL, { method: "GET" });
    if (!hashResponse.ok) throw new Error("Server not reachable");
    const hashText = await hashResponse.text();
    remoteHash = hashText.split(" ")[0].trim();
  } catch (e) {
    if (!dbExists) {
      throw new Error("Could not connect to the server to download the database.");
    }
    console.warn("Server unreachable. Running in offline mode.");
    return;
  }

  const localHash = await getDatabaseHash();

  if (remoteHash && (!dbExists || localHash !== remoteHash)) {
    console.log("Database update required. Downloading...");
    await downloadAndWriteDb(remoteHash);
    await saveDatabaseHash(remoteHash);
  } else {
    console.log("Local database is up to date.");
  }
}