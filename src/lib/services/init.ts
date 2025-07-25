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
  // This is critical to ensure we can overwrite the file.
  await closeDbConnection();

  console.log("> Downloading new database...");
  const response = await httpFetch(DB_URL, { method: "GET" });

  // This single check is sufficient.
  if (!response.ok) {
    throw new Error(`Failed to download database: Server responded with status ${response.status}`);
  }

  // Get the raw bytes from the response.
  const dbBytes = await response.bytes();

  // Verify the hash of the downloaded content.
  const digest = await crypto.subtle.digest("SHA-256", dbBytes);
  const actualHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (actualHash !== remoteHash) {
    throw new Error("Database verification failed. Downloaded file is corrupt or hash mismatch.");
  }

  console.log("> Writing database to disk...");
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
  // Start initializing user-specific settings and auth state in parallel.
  await Promise.all([
    settingsStore.init(),
    authStore.initialize()
  ]);

  console.log("> Checking database status...");

  try {
    const dbExists = await exists(DB_FILENAME, { baseDir: BaseDirectory.AppData });
    
    // --- FIX: Use the consistent `httpFetch` pattern here. ---
    // This replaces the incorrect `getClient` and `client.get` logic.
    const hashResponse = await httpFetch(HASH_URL, { method: "GET" });

    if (!hashResponse.ok) {
      throw new Error("Server not reachable to check for updates.");
    }
    
    // --- FIX: For the `fetch` API, we get the body with the `.text()` method. ---
    const hashText = await hashResponse.text();
    const remoteHash = hashText.split(" ")[0].trim();
    const localHash = await getDatabaseHash();

    console.log(`> Remote hash: ${remoteHash}`);
    console.log(`> Local hash:  ${localHash}`);

    if (!dbExists || localHash !== remoteHash) {
      console.log("! Database update required.");
      await downloadAndWriteDb(remoteHash);
      await saveDatabaseHash(remoteHash);
      console.log("! Database update complete.");
    } else {
      console.log("> Local database is up-to-date.");
    }

  } catch (error) {
    console.error("! Failed to initialize/update database:", error);
    
    // Fallback: If an error occurs but a DB file already exists, we can run offline.
    const dbExists = await exists(DB_FILENAME, { baseDir: BaseDirectory.AppData });
    if (!dbExists) {
      // If there's no local DB at all, the app can't start.
      throw new Error("Could not connect to server to download database for the first time.");
    } else {
      console.warn("! Running in offline mode with existing local database.");
    }
  }
}