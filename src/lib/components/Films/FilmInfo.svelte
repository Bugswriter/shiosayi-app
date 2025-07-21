<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  interface Film {
    id: number;
    title: string;
    year: number | null;
    plot: string | null;
    poster_url: string | null;
    region: string | null;
    guardian_id: string | null;
    status: "orphan" | "adopted" | "abandoned";
    updated_at: string | null;
    guardian_name: string | null;
  }

  export let film: Film | null;
  function closeModal() {
    film = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
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
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
    on:click={closeModal}
    aria-hidden="true"
  />

  <div
    class="fixed top-1/2 left-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="film-title"
  >
    <div class="relative">
      <button
        on:click={closeModal}
        class="absolute top-3 right-3 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close film details"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="grid sm:grid-cols-3">
        <div class="sm:col-span-1 bg-gray-900">
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

        <!-- Film Information -->
        <div class="sm:col-span-2 p-6 sm:p-8 flex flex-col">
          <h2
            id="film-title"
            class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1"
          >
            {film.title}
          </h2>

          <div
            class="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center flex-wrap"
          >
            {#if film.year}
              <span>{film.year}</span>
            {/if}
            {#if film.region}
              {#if film.year}<span class="mx-2">•</span>{/if}
              <span>{film.region}</span>
            {/if}
          </div>

          <p
            class="text-gray-700 dark:text-gray-300 mb-6 flex-grow min-h-[6rem]"
          >
            {film.plot || "No plot summary available."}
          </p>

          <div
            class="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto"
          >
            <p>
              Status: <span
                class="font-medium capitalize text-gray-500 dark:text-gray-400"
                >{film.status}</span
              >
            </p>
            {#if film.guardian_name}
              <p>
                Guardian: <span
                  class="font-medium text-gray-500 dark:text-gray-400"
                  >{film.guardian_name}</span
                >
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
