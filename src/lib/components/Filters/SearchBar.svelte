<script lang="ts">
  import { createEventDispatcher, onDestroy, tick } from "svelte";

  /**
   * This is now a two-way bindable prop.
   * Changing it here will change it in the parent.
   */
  export let isOpen = false;

  let searchTerm = "";
  const dispatch = createEventDispatcher();

  function handleSubmit() {
    if (searchTerm.trim()) {
      dispatch("submit", { searchTerm: searchTerm.trim() });
    }
  }

  // --- THIS IS THE FIX ---
  // We now directly modify the 'isOpen' prop.
  // The 'bind:isOpen' in the parent will automatically catch this change.
  function close() {
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      // This now calls the corrected close() function.
      close();
    }
  }

  function autofocus(node: HTMLInputElement) {
    tick().then(() => {
      node.focus();
    });
  }

  $: {
    if (typeof document !== "undefined") {
      if (isOpen) {
        document.addEventListener("keydown", handleKeydown);
      } else {
        document.removeEventListener("keydown", handleKeydown);
      }
    }
  }

  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", handleKeydown);
    }
  });
</script>

{#if isOpen}
  <div
    role="button"
    tabindex="0"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 bg-black/60 backdrop-blur-sm"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search films"
      class="w-full max-w-xl bg-white dark:bg-zinc-800 rounded-xl shadow-2xl overflow-hidden"
    >
      <form on:submit|preventDefault={handleSubmit}>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="search"
            bind:value={searchTerm}
            use:autofocus
            placeholder="Search films by title..."
            class="w-full border-0 bg-transparent py-4 pl-12 pr-12 text-lg text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />

          <button
            type="button"
            on:click={close}
            aria-label="Close"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </form>

      <div
        class="border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-3 text-center"
      >
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Press <kbd
            class="px-1.5 py-0.5 text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-900/40 border border-zinc-300 dark:border-zinc-700 rounded-md"
            >Enter</kbd
          > to search
        </p>
      </div>
    </div>
  </div>
{/if}
