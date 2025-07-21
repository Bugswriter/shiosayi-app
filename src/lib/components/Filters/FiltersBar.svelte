<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { filtersStore } from "$lib/utils/stores";
  import type { Film, RegionWithCount } from "$lib/services/database";

  const dispatch = createEventDispatcher();

  export let regions: RegionWithCount[] = [];

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
  class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
>
  <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <!-- Left Aligned: Status Filters -->
    <div>
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

    <!-- Right Aligned: Region and Search -->
    <div class="flex items-end gap-x-4">
      <div>
        <label
          for="region-filter"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Region
        </label>
        <select
          id="region-filter"
          class="w-full sm:w-auto md:w-56 h-10 pl-3 pr-10 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
        <label class="block text-sm font-medium mb-1"> </label>
        <button
          on:click={() => dispatch("searchClick")}
          aria-label="Search"
          class="h-10 flex items-center justify-center gap-x-2 px-3 py-2 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-all hover:border-pink-500 dark:hover:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
            class="px-1.5 py-0.5 text-xs font-sans font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-md"
          >
            Ctrl K
          </kbd>
        </button>
      </div>
    </div>
  </div>
</div>
