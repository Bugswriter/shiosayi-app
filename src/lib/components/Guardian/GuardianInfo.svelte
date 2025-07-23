<!-- src/lib/components/Guardian/GuardianInfo.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { authStore } from "$lib/utils/state";
  import GuardianCard from "./GuardianCard.svelte";

  export let isOpen: boolean;

  const tierLimits = {
    lover: 1,
    keeper: 5,
    savior: 10,
  };

  // No need for a separate 'guardian' variable, we'll use authStore directly.

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

<!--
  THE FIX:
  We check for `isOpen` AND if the `guardian` property inside the authStore is not null.
  This prevents the component from trying to render with no data.
-->
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
          <!-- THE FIX: We access `$authStore.guardian.name` and `.tier` -->
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

        <div class="text-sm">
          <!-- THE FIX: We access `$authStore.guardian.films` and `.email` -->
          <p class="text-zinc-800 dark:text-zinc-300">
            <span class="font-semibold">Adopted Films:</span>
            {$authStore.guardian.films.length} / {tierLimits[
              $authStore.guardian.tier
            ]}
          </p>
          <p class="text-zinc-500 dark:text-zinc-400">
            {$authStore.guardian.email}
          </p>
        </div>

        <div class="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2">
          <!-- THE FIX: We access `$authStore.guardian.films` -->
          {#if $authStore.guardian.films.length > 0}
            {#each $authStore.guardian.films as film (film.id)}
              <GuardianCard {film} />
            {/each}
          {:else}
            <p class="text-center text-zinc-500 dark:text-zinc-400 py-4">
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
