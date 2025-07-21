<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;

  export let onPrevious: () => void;
  export let onNext: () => void;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft" && currentPage > 1) onPrevious?.();
    if (e.key === "ArrowRight" && currentPage < totalPages) onNext?.();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<nav
  class="mt-10 flex justify-center items-center gap-3"
  aria-label="Pagination Navigation"
>
  <!-- Previous Button -->
  <button
    on:click={() => dispatch("previous")}
    disabled={currentPage <= 1}
    aria-label="Go to previous page"
    class="h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-colors hover:border-pink-500 hover:text-pink-600 dark:hover:border-pink-500 dark:hover:text-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>

  <!-- Page Info -->
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
    Page {currentPage} of {totalPages}
  </span>

  <!-- Next Button -->
  <button
    on:click={() => dispatch("next")}
    disabled={currentPage >= totalPages}
    aria-label="Go to next page"
    class="h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-colors hover:border-pink-500 hover:text-pink-600 dark:hover:border-pink-500 dark:hover:text-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</nav>
