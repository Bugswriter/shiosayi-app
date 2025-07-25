<!-- src/lib/components/Guardian/GuardianInfo.svelte -->
<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { authStore } from "$lib/utils/state";
  import { getFilmsByGuardianId } from "$lib/services/database";
  import type { Film } from "$lib/services/database";

  export let isOpen: boolean;

  const tierLimits = {
    lover: 1,
    keeper: 5,
    savior: 10,
  };

  // --- NEW: Local state for adopted films ---
  let isLoadingFilms = true;
  let adoptedFilms: Film[] = [];

  // --- NEW: Reactive logic to fetch films when the modal opens ---
  $: if (isOpen && $authStore.guardian?.id) {
    isLoadingFilms = true;
    getFilmsByGuardianId($authStore.guardian.id).then((films) => {
      adoptedFilms = films;
      isLoadingFilms = false;
    });
  }

  function closeModal() {
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  onMount(() => window.addEventListener("keydown", handleKeydown));
  onDestroy(() => window.removeEventListener("keydown", handleKeydown));
</script>

{#if isOpen && $authStore.guardian}
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
    on:click={closeModal}
    aria-hidden="true"
  ></div>

  <div
    class="fixed top-1/2 left-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="guardian-title"
  >
    <div class="relative p-6 sm:p-8">
      <button
        on:click={closeModal}
        class="absolute top-3 right-3 p-1 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Close guardian details"
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

      <div class="flex flex-col gap-6">
        <div>
          <h2
            id="guardian-title"
            class="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            {$authStore.guardian.name}
          </h2>
          <p
            class="text-sm text-pink-600 dark:text-pink-500 font-medium capitalize"
          >
            {$authStore.guardian.tier} Tier
          </p>
        </div>

        <!-- THE FIX: Use `adoptedFilms.length` -->
        <div class="text-sm">
          <p class="text-zinc-800 dark:text-zinc-300">
            <span class="font-semibold">Adopted Films:</span>
            {adoptedFilms.length} / {tierLimits[$authStore.guardian.tier]}
          </p>
          <p class="text-zinc-500 dark:text-zinc-400">
            {$authStore.guardian.email}
          </p>
        </div>

        <div
          class="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2 border-t border-b border-zinc-200 dark:border-zinc-700 py-4"
        >
          {#if isLoadingFilms}
            <p class="text-center text-zinc-500 dark:text-zinc-400">
              Loading your films...
            </p>
          {:else if adoptedFilms.length > 0}
            <!-- THE FIX: Use `adoptedFilms` for the loop -->
            <ul class="space-y-2">
              {#each adoptedFilms as film (film.id)}
                <li class="text-sm text-zinc-800 dark:text-zinc-300">
                  <span class="font-medium">{film.title}</span>
                  {#if film.year}
                    <span class="text-zinc-500 dark:text-zinc-400"
                      >({film.year})</span
                    >
                  {/if}
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-center text-zinc-500 dark:text-zinc-400">
              You have not adopted any films yet.
            </p>
          {/if}
        </div>

        <button
          on:click={() => authStore.logout()}
          class="w-full mt-2 h-10 px-4 font-semibold text-pink-700 bg-pink-100 hover:bg-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:hover:bg-pink-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
{/if}
