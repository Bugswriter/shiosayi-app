<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { authStore, filtersStore } from "$lib/utils/state";
  import { fetch as httpFetch } from "@tauri-apps/plugin-http";
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";

  // --- THIS IS THE FIX: Import the new database function ---
  import { countFilmsByGuardianId } from "$lib/services/database";

  // Interface for Film prop
  interface Film {
    id: number;
    title: string;
    year: number | null;
    plot: string | null;
    poster_url: string | null;
    region: string | null;
    guardian_id: string | null;
    status: "orphan" | "adopted";
    updated_at: string | null;
    guardian_name: string | null;
  }

  export let film: Film | null;

  // --- State for Component Logic ---
  let isFetchingMagnet = false;
  let magnetError: string | null = null;
  let magnetSuccess = false;
  let isAdopting = false;
  let adoptionError: string | null = null;
  let adoptionSuccess = false;

  // --- THIS IS THE FIX: New local state for the adoption count ---
  let currentAdoptionCount = 0;

  const tierLimits = {
    lover: 1,
    keeper: 5,
    savior: 10,
  };

  // --- THIS IS THE FIX: New reactive logic ---
  // This block runs whenever the modal opens or the auth state changes.
  // It fetches the adoption count from the local DB.
  $: if (film && $authStore.status === "authenticated" && $authStore.guardian) {
    countFilmsByGuardianId($authStore.guardian.id).then((count) => {
      currentAdoptionCount = count;
    });
  }

  // --- THIS IS THE FIX: The limit check now uses our local state ---
  $: isAdoptionLimitReached =
    $authStore.guardian &&
    currentAdoptionCount >= tierLimits[$authStore.guardian.tier];

  // --- All other functions (closeModal, getMagnetLink, etc.) remain the same ---
  function closeModal() {
    film = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  async function getMagnetLink() {
    const apiKey = $authStore.apiKey;
    if (!film || !apiKey) return;
    isFetchingMagnet = true;
    magnetError = null;
    try {
      const response = await httpFetch(
        `https://sys.shiosayi.org/magnet/${film.id}?TOKEN=${apiKey}`,
        { method: "GET" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch link.");
      await writeText(data.magnet);
      magnetSuccess = true;
      setTimeout(() => (magnetSuccess = false), 2000);
    } catch (error) {
      console.error("Magnet link error:", error);
      magnetError =
        error instanceof Error ? error.message : "An unknown error.";
      setTimeout(() => (magnetError = null), 3000);
    } finally {
      isFetchingMagnet = false;
    }
  }

  async function adoptFilm() {
    const apiKey = $authStore.apiKey;
    if (!film || !apiKey || isAdoptionLimitReached) return;

    isAdopting = true;
    adoptionError = null;
    adoptionSuccess = false;

    try {
      const response = await httpFetch(
        `https://sys.shiosayi.org/adopt/${film.id}?TOKEN=${apiKey}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Adoption failed.");

      adoptionSuccess = true;

      // --- THIS IS THE FIX: Manually increment our local count after successful adoption ---
      currentAdoptionCount++;

      // Update the main film grid in the background by triggering a filter change
      filtersStore.update((f) => ({ ...f }));

      // Close the modal after a short delay to show the success message
      setTimeout(() => closeModal(), 1500);
    } catch (error) {
      console.error("Adoption error:", error);
      adoptionError =
        error instanceof Error ? error.message : "An unknown error.";
      setTimeout(() => (adoptionError = null), 4000);
    } finally {
      isAdopting = false;
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
</script>

{#if film}
  <div
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    tabindex="0"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="relative w-full max-w-2xl bg-white dark:bg-zinc-800 rounded-xl shadow-2xl overflow-hidden"
      role="document"
      aria-labelledby="film-title"
    >
      <!-- The new, correctly styled close button from your reference -->
      <button
        on:click={closeModal}
        class="absolute top-3 right-3 z-10 p-1 text-zinc-400 rounded-full hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors"
        aria-label="Close modal"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- 
        The UNIQUE content for this modal. 
        This is the original grid layout for the image and text, which is preserved.
      -->
      <div class="grid sm:grid-cols-3">
        <div class="sm:col-span-1 bg-zinc-100 dark:bg-zinc-900">
          <img
            src={film.poster_url ||
              "https://placehold.co/400x600/1f2937/9ca3af?text=No+Poster"}
            alt="Poster for {film.title}"
            class="w-full h-full object-cover"
            on:error={(e) => {
              const img = e.target as HTMLImageElement;
              img.src =
                "https://placehold.co/400x600/1f2937/9ca3af?text=No+Poster";
            }}
          />
        </div>

        <div class="sm:col-span-2 p-6 sm:p-8 flex flex-col">
          <h2
            id="film-title"
            class="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1"
          >
            {film.title}
          </h2>
          <div
            class="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex items-center flex-wrap"
          >
            {#if film.year}<span>{film.year}</span>{/if}
            {#if film.region}{#if film.year}<span class="mx-2">•</span
                >{/if}<span>{film.region}</span>{/if}
          </div>
          <p
            class="text-zinc-800 dark:text-zinc-300 mb-6 flex-grow min-h-[6rem]"
          >
            {film.plot || "No plot summary available."}
          </p>

          <div
            class="text-xs border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-auto flex justify-between items-start"
          >
            <div class="text-zinc-600 dark:text-zinc-400">
              <p>
                Status: <span
                  class="font-medium capitalize text-zinc-800 dark:text-zinc-200"
                  >{film.status}</span
                >
              </p>
              {#if film.guardian_name}
                <p>
                  Guardian: <span
                    class="font-medium text-zinc-800 dark:text-zinc-200"
                    >{film.guardian_name}</span
                  >
                </p>
              {/if}
            </div>

            {#if $authStore.status === "authenticated"}
              <div class="flex flex-col items-end">
                {#if film.status === "orphan"}
                  <button
                    on:click={adoptFilm}
                    disabled={isAdopting || isAdoptionLimitReached}
                    class="inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-semibold rounded-md transition-colors bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:pointer-events-none"
                    title={isAdoptionLimitReached && $authStore.guardian
                      ? `You have reached your tier limit of ${tierLimits[$authStore.guardian.tier]} films.`
                      : "Adopt this film"}
                  >
                    {#if isAdopting}
                      <div
                        class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      ></div>
                    {:else if adoptionSuccess}
                      <span in:fly={{ y: -5, duration: 200 }}>Adopted!</span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                        /><path
                          d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.02-.02 2.92-2.92"
                        /></svg
                      >
                      <span>Adopt Film</span>
                    {/if}
                  </button>
                  {#if adoptionError}
                    <p
                      class="font-sans text-xs text-red-500 mt-1 text-right"
                      transition:fly={{ y: 5, duration: 200 }}
                    >
                      {adoptionError}
                    </p>
                  {/if}
                {:else}
                  <button
                    on:click={getMagnetLink}
                    disabled={isFetchingMagnet || magnetSuccess}
                    class="inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-semibold rounded-md transition-colors bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {#if isFetchingMagnet}
                      <div
                        class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      ></div>
                    {:else if magnetSuccess}
                      <span in:fly={{ y: -5, duration: 200 }}>Copied!</span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="m6 15-4-4 6.5-6.5" /><path
                          d="m21 21-4-4"
                        /><path d="m15 6 3.4-3.4" /><path
                          d="M18 9a3 3 0 0 0-3-3"
                        /><path d="M9 18a3 3 0 0 0-3-3" /><path
                          d="M18 15a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6v2a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6Z"
                        /></svg
                      >
                      <span>Get Magnet</span>
                    {/if}
                  </button>
                  {#if magnetError}
                    <p
                      class="text-xs text-red-500 mt-1 text-right"
                      transition:fly={{ y: 5, duration: 200 }}
                    >
                      {magnetError}
                    </p>
                  {/if}
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
