<script lang="ts">
  import { filtersStore } from "$lib/stores";
  import type { Film, RegionWithCount } from "$lib/db";

  // The component accepts the list of regions as a prop, fetched from +page.ts
  export let regions: RegionWithCount[] = [];

  // --- State for Status Filters ---
  const filterOptions: { label: string; value: Film["status"] }[] = [
    { label: "Orphan", value: "orphan" },
    { label: "Adopted", value: "adopted" },
    { label: "Abandoned", value: "abandoned" },
  ];

  function setStatusFilter(status: Film["status"]) {
    filtersStore.update((currentFilters) => ({
      ...currentFilters,
      statuses: [status],
      page: 1, // Reset to page 1 whenever a filter changes
    }));
  }

  // --- State for Region Filter ---
  // Initialize from the store to ensure it shows the correct value on page load
  let selectedRegion = $filtersStore.region ?? "";

  function handleRegionChange() {
    filtersStore.update((currentFilters) => ({
      ...currentFilters,
      region: selectedRegion || undefined, // Use undefined if "All Regions" is selected
      page: 1, // Reset to page 1 whenever a filter changes
    }));
  }
</script>

<div
  class="mb-6 p-3 bg-gradient-to-b from-gray-200 to-gray-100 border border-gray-300 shadow-sm rounded-lg"
>
  <div class="flex items-end gap-x-6">
    <!-- Status Filter Buttons (These will stay on the left) -->
    <div>
      <div class="flex items-center gap-2">
        {#each filterOptions as filter (filter.value)}
          {@const isActive = $filtersStore.statuses?.includes(filter.value)}
          <button
            on:click={() => setStatusFilter(filter.value)}
            class="px-4 py-1.5 text-sm rounded-md font-semibold transition-all duration-150"
            class:bg-white={isActive}
            class:text-gray-800={isActive}
            class:border-gray-400={isActive}
            class:shadow-sm={isActive}
            class:border-transparent={!isActive}
            class:text-gray-600={!isActive}
          >
            {filter.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="ml-auto">
      <select
        id="region-filter"
        class="w-56 h-10 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
  </div>
</div>
