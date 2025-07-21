<script lang="ts">
  import { filtersStore } from "$lib/utils/stores";
  import type { Film, RegionWithCount } from "$lib/services/database";

  // --- Props ---
  export let regions: RegionWithCount[] = [];

  // --- Status Filter Logic (No changes here) ---
  const filterOptions: { label: string; value: Film["status"] }[] = [
    { label: "Orphan", value: "orphan" },
    { label: "Adopted", value: "adopted" },
    { label: "Abandoned", value: "abandoned" },
  ];

  function toggleStatusFilter(statusToToggle: Film["status"]) {
    filtersStore.update((currentFilters) => {
      const currentStatuses = currentFilters.statuses || [];
      const isCurrentlyActive = currentStatuses.includes(statusToToggle);
      let newStatuses: Film["status"][];

      if (isCurrentlyActive) {
        newStatuses = currentStatuses.filter((s) => s !== statusToToggle);
      } else {
        newStatuses = [...currentStatuses, statusToToggle];
      }

      return { ...currentFilters, statuses: newStatuses, page: 1 };
    });
  }

  // --- Region Filter Logic ---
  // `bind:value` will ensure this variable ALWAYS matches the store's value.
  // This is how the component reacts to external changes (like a reset).
  let selectedRegion = $filtersStore.region || "";

  // The reactive statement is no longer needed because bind:value handles this two-way flow.
  // We can simplify and rely on the bind.
  $: selectedRegion = $filtersStore.region || "";

  // The CORRECTED handler function
  function handleRegionChange(event: Event) {
    // Get the <select> element from the event
    const target = event.currentTarget as HTMLSelectElement;
    // Get its NEW value directly. This is guaranteed to be correct.
    const newRegionValue = target.value;

    filtersStore.update((currentFilters) => ({
      ...currentFilters,
      // Use the new value from the event, not the potentially stale `selectedRegion` variable.
      region: newRegionValue || undefined,
      page: 1,
    }));
  }
</script>

<div
  class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
>
  <div class="flex flex-wrap items-end gap-x-6 gap-y-4">
    <!-- Status Toggles Section -->
    <div class="flex-grow">
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Status
      </label>
      <div class="flex items-center gap-2">
        {#each filterOptions as filter (filter.value)}
          {@const isActive = $filtersStore.statuses?.includes(filter.value)}
          <button
            on:click={() => toggleStatusFilter(filter.value)}
            class="px-4 py-1.5 text-sm rounded-md font-semibold transition-all duration-150 border"
            class:bg-pink-600={isActive}
            class:text-white={isActive}
            class:border-pink-600={isActive}
            class:shadow-md={isActive}
            class:hover:bg-pink-700={isActive}
            class:bg-white={!isActive}
            class:dark:bg-gray-700={!isActive}
            class:text-gray-600={!isActive}
            class:dark:text-gray-300={!isActive}
            class:border-gray-300={!isActive}
            class:dark:border-gray-600={!isActive}
            class:hover:bg-gray-50={!isActive}
            class:dark:hover:bg-gray-600={!isActive}
          >
            {filter.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Region Dropdown Section -->
    <div class="w-full sm:w-auto md:w-56">
      <label
        for="region-filter"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Region
      </label>
      <select
        id="region-filter"
        class="w-full h-10 pl-3 pr-10 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
