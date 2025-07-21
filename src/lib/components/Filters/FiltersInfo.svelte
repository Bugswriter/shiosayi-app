<script lang="ts">
  import { filtersStore, isShowAllState } from "$lib/utils/stores";

  function formatStatuses(statuses: string[] | undefined): string {
    if (!statuses || statuses.length === 0) {
      return "All";
    }
    return statuses
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(", ");
  }
</script>

{#if !$isShowAllState}
  <div
    class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex justify-between items-start">
      <!-- Left side: List of active filters -->
      <div>
        <h2 class="text-md font-semibold text-gray-800 dark:text-gray-200">
          Current Filters
        </h2>
        <dl class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <!-- Status: Always displayed as it's the primary filter -->
          <div class="flex">
            <dt class="font-medium w-24 flex-shrink-0">Status:</dt>
            <dd>{formatStatuses($filtersStore.statuses)}</dd>
          </div>

          <!-- Region: Conditionally displayed only if a region is selected -->
          {#if $filtersStore.region}
            <div class="flex">
              <dt class="font-medium w-24 flex-shrink-0">Region:</dt>
              <dd>{$filtersStore.region}</dd>
            </div>
          {/if}

          <!-- Search Term: Conditionally displayed only if a search is active -->
          {#if $filtersStore.searchTerm}
            <div class="flex">
              <dt class="font-medium w-24 flex-shrink-0">Search Term:</dt>
              <dd class="italic">"{$filtersStore.searchTerm}"</dd>
            </div>
          {/if}
        </dl>
      </div>

      <!-- Right side: Reset button -->
      <button
        on:click={filtersStore.reset}
        class="flex-shrink-0 text-sm font-medium text-pink-600 hover:text-pink-500 hover:underline transition"
      >
        Reset to Default
      </button>
    </div>
  </div>
{/if}
