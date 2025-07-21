<!-- src/lib/components/Guardian/GuardianInfo.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { guardianStore } from "$lib/utils/state";
  import GuardianCard from "./GuardianCard.svelte";

  export let isOpen: boolean;

  const tierLimits = {
    lover: 1,
    keeper: 5,
    savior: 10,
  };

  const guardian = guardianStore; // Directly use the store

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

{#if isOpen && $guardian}
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
    on:click={closeModal}
    aria-hidden="true"
  />

  <div
    class="fixed top-1/2 left-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="guardian-title"
  >
    <div class="relative p-6 sm:p-8">
      <button
        on:click={closeModal}
        class="absolute top-3 right-3 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
            class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
          >
            {$guardian.name}
          </h2>
          <p
            class="text-sm text-pink-600 dark:text-pink-400 font-medium capitalize"
          >
            {$guardian.tier} Tier
          </p>
        </div>

        <div class="text-sm">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Adopted Films:</span>
            {$guardian.films.length} / {tierLimits[$guardian.tier]}
          </p>
          <p class="text-gray-500 dark:text-gray-400">{$guardian.email}</p>
        </div>

        <div class="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2">
          {#if $guardian.films.length > 0}
            {#each $guardian.films as film (film.id)}
              <GuardianCard {film} />
            {/each}
          {:else}
            <p class="text-center text-gray-500 dark:text-gray-400 py-4">
              You have not adopted any films yet.
            </p>
          {/if}
        </div>

        <button
          on:click={() => guardianStore.logout()}
          class="w-full mt-2 h-10 px-4 font-semibold text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/50 rounded-md hover:bg-pink-200 dark:hover:bg-pink-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
{/if}
