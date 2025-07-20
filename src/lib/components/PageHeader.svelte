<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<header class="text-center py-5 bg-gray-100 border-b border-gray-300 shadow-sm">
  <h1
    class="text-5xl md:text-5xl font-bold tracking-tight text-gray-800 font-serif drop-shadow-sm"
  >
    Rare Films
  </h1>

  <button
    on:click={() => dispatch("searchClick")}
    class="mt-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
  >
    Press
    <kbd
      class="ml-1 px-2 py-1 text-xs font-semibold border border-gray-400 rounded bg-gray-200 shadow-inner"
    >
      Ctrl K
    </kbd>
    to search
  </button>
</header>
