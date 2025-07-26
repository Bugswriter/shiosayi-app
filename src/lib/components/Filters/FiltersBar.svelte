<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { filtersStore } from "$lib/utils/state";
  import type { Film, RegionWithCount } from "$lib/services/database";

  const dispatch = createEventDispatcher();

  export let regions: RegionWithCount[] = [];

  const filterOptions: { label: string; value: Film["status"] }[] = [
    { label: "Orphan", value: "orphan" },
    { label: "Adopted", value: "adopted" },
  ];

  // --- NEW: Simplified function for tab-like behavior ---
  // This sets the filter to a single status.
  function setStatusFilter(newStatus: Film["status"]) {
    filtersStore.update((currentFilters) => {
      // No need to check for inclusion, just set the new value.
      return { ...currentFilters, status: newStatus, page: 1 };
    });
  }

  // --- Region filter logic remains the same ---
  let selectedRegion = $filtersStore.region || "";
  $: selectedRegion = $filtersStore.region || "";

  function handleRegionChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement;
    const newRegionValue = target.value;

    filtersStore.update((currentFilters) => ({
      ...currentFilters,
      region: newRegionValue || undefined,
      page: 1,
    }));
  }
</script>

<div
  class="p-4 bg-zinc-100 border rounded-b-lg border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
>
  <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <!-- Status Filter Buttons -->
    <div>
      <div class="flex items-center gap-3">
        {#each filterOptions as filter (filter.value)}
          <!-- NEW: Check for equality, not inclusion in an array -->
          {@const isActive = $filtersStore.status === filter.value}
          <div class="relative rounded-md overflow-hidden">
            <button
              on:click={() => setStatusFilter(filter.value)}
              class="px-4 py-1.5 text-sm rounded-md font-semibold
         border transition-all duration-200"
              class:bg-pink-600={isActive}
              class:text-white={isActive}
              class:border-pink-700={isActive}
              class:dark:border-pink-500={isActive}
              class:shadow-inner={isActive}
              class:translate-y-px={isActive}
              class:bg-white={!isActive}
              class:dark:bg-zinc-700={!isActive}
              class:text-zinc-700={!isActive}
              class:dark:text-zinc-300={!isActive}
              class:border-zinc-300={!isActive}
              class:dark:border-zinc-600={!isActive}
              class:shadow-md={!isActive}
              class:hover:shadow-lg={!isActive}
            >
              {filter.label}
            </button>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right Aligned: Region and Search -->
    <div class="flex items-end gap-x-4">
      <div>
        <!-- FIX: Added a visually hidden label for accessibility -->
        <label for="region-filter" class="sr-only">Filter by Region</label>
        <select
          id="region-filter"
          class="w-full sm:w-auto md:w-56 h-10 pl-3 pr-10 text-sm bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
          bind:value={selectedRegion}
          on:change={handleRegionChange}
        >
          <option value="">All Regions</option>
          {#each regions as regionItem (regionItem.region)}
            <option value={regionItem.region}>
              {regionItem.region} ({regionItem.film_count})
            </option>
          {/each}
        </select>
      </div>

      <div>
        <!-- FIX: The empty, problematic <label> tag has been removed -->
        <button
          on:click={() => dispatch("searchClick")}
          aria-label="Search films"
          class="h-10 flex items-center justify-center gap-x-2 px-3 py-2 bg-white dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm transition-all hover:border-pink-500 dark:hover:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <kbd
            class="px-1.5 py-0.5 text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-md"
          >
            Ctrl K
          </kbd>
        </button>
      </div>
    </div>
  </div>
</div>

<!--
  This <style> block is new. It adds the "shine" effect on hover.
  The styles are scoped to this component only.
-->
<style>
  .shine-effect::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.5s ease-out;
    pointer-events: none;
  }
  .shine-effect:hover::after {
    transform: scale(2);
  }
</style>
