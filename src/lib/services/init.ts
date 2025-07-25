// src/lib/services/init.ts
import { exists, open, BaseDirectory } from "@tauri-apps/plugin-fs";
import { fetch as httpFetch } from "@tauri-apps/plugin-http";
import { getDatabaseHash, saveDatabaseHash } from "$lib/utils/settings";
import { settingsStore, authStore } from "$lib/utils/state";
import { closeDbConnection } from "$lib/services/database";

const DB_URL = "https://sys.shiosayi.org/db/public";
const HASH_URL = "https://sys.shiosayi.org/db/public.sha256";
const DB_FILENAME = "public.db";

// This function is now correct, assuming the CORS issue on the backend is fixed.
async function downloadAndWriteDb(remoteHash: string): Promise<void> {
  await closeDbConnection();

  console.log("> Downloading new database...");
  const response = await httpFetch(DB_URL, {
    method: "GET",
    responseType: "bytes" 
  });

  if (!response.ok) {
    // This part was being triggered by the CORS issue.
    console.error("Download failed. Status:", response.status, "Headers:", response.headers);
    throw new Error(`Failed to download database: Server responded with status ${response.status}`);
  }

  const dbBytes = new Uint8Array(response.data as number[]);

  const digest = await crypto.subtle.digest("SHA-256", dbBytes);
  const actualHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (actualHash !== remoteHash) {
    throw new Error("Database verification failed. Downloaded file is corrupt.");
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

// --- THIS IS THE NEW, MORE RESILIENT INITIALIZATION LOGIC ---
export async function initializeApp(): Promise<void> {
  // 1. Initialize non-database settings and authentication concurrently.
  await Promise.all([
    settingsStore.init(),
    authStore.initialize()
  ]);

  console.log("> Checking database status...");

  try {
    const dbExists = await exists(DB_FILENAME, { baseDir: BaseDirectory.AppData });

    // Fetch remote hash first. If this fails, we can potentially run offline.
    const hashResponse = await httpFetch(HASH_URL, { method: "GET" });
    if (!hashResponse.ok) throw new Error("Server not reachable to check for updates.");
    
    const hashText = await hashResponse.text();
    const remoteHash = hashText.split(" ")[0].trim();
    const localHash = await getDatabaseHash();

    console.log(`> Remote hash: ${remoteHash}`);
    console.log(`> Local hash:  ${localHash}`);

    // Condition to update: If the file doesn't exist OR the hashes don't match.
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
    
    // CRITICAL RESILIENCY LOGIC:
    // Only throw a fatal error if we absolutely cannot continue.
    const dbExists = await exists(DB_FILENAME, { baseDir: BaseDirectory.AppData });
    if (!dbExists) {
      // This is a fatal error: it's the first run AND we couldn't download the DB.
      throw new Error("Could not connect to server to download database for the first time.");
    } else {
      // It's not the first run, so we can survive.
      console.warn("! Running in offline mode with existing local database.");
    }
  }
}