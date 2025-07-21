<script lang="ts">
  import { filtersStore } from "$lib/utils/state";
  import type { RegionWithCount } from "$lib/services/database";

  export let regions: RegionWithCount[] = [];

  let selectedRegion = $filtersStore.region ?? "";

  function handleRegionChange() {
    filtersStore.update((currentFilters) => ({
      ...currentFilters,
      region: selectedRegion || undefined,
      page: 1,
    }));
  }
</script>

<div class="relative">
  <label
    for="region-filter"
    class="block text-sm font-medium text-gray-700 mb-1"
  >
    Region
  </label>
  <select
    id="region-filter"
    class="w-full h-10 pl-3 pr-10 text-sm bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
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
