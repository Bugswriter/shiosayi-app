<!-- src/lib/components/FilterBar.svelte -->
<script lang="ts">
  const filters = ["Orphan", "Adopted", "Abandoned"];
  let activeFilter: string = "Orphan";
</script>

<div
  class="px-3 py-1.5 bg-gradient-to-b from-gray-200 to-gray-100 border-t border-b border-gray-300 shadow-sm"
>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      {#each filters as filter (filter)}
        <button
          on:click={() => (activeFilter = filter)}
          class="px-4 py-1 text-sm rounded-md font-semibold transition-all duration-150"
          class:bg-white={activeFilter === filter}
          class:text-gray-800={activeFilter === filter}
          class:border-gray-400={activeFilter === filter}
          class:border-opacity-70={activeFilter === filter}
          class:border-transparent={activeFilter !== filter}
          class:text-gray-600={activeFilter !== filter}
        >
          {filter}
        </button>
      {/each}
    </div>

    <div class="flex items-center">
      <button
        class="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-400/80 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
      >
        Actions
      </button>
    </div>
  </div>
</div>
