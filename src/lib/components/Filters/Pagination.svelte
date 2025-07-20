<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let currentPage: number;
  export let totalPages: number;

  const dispatch = createEventDispatcher();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft" && currentPage > 1) dispatch("previous");
    if (e.key === "ArrowRight" && currentPage < totalPages) dispatch("next");
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<nav
  class="mt-10 flex justify-center items-center gap-4"
  aria-label="Pagination Navigation"
>
  <button
    on:click={() => dispatch("previous")}
    disabled={currentPage <= 1}
    class="px-4 py-2 font-medium text-gray-800 bg-gray-200 rounded border border-gray-400 hover:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none"
  >
    Previous
  </button>
  <span class="font-mono text-gray-600 text-sm"
    >{currentPage} / {totalPages}</span
  >
  <button
    on:click={() => dispatch("next")}
    disabled={currentPage >= totalPages}
    class="px-4 py-2 font-medium text-gray-800 bg-gray-200 rounded border border-gray-400 hover:bg-gray-300 transition disabled:opacity-50 disabled:pointer-events-none"
  >
    Next
  </button>
</nav>
