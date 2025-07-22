<script lang="ts">
  import { filtersStore } from "$lib/utils/state";

  $: isDefaultState =
    !$filtersStore.searchTerm &&
    !$filtersStore.region &&
    JSON.stringify($filtersStore.statuses) === JSON.stringify(["orphan"]);

  function formatStatuses(statuses: string[] | undefined): string {
    if (!statuses || statuses.length === 0) {
      return "All";
    }
    return statuses
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(", ");
  }
</script>

{#if !isDefaultState}
  <div
    class="mb-6 rounded-lg border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800"
  >
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-md font-semibold text-zinc-900 dark:text-zinc-100">
          Current Filters
        </h2>
        <dl class="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <div class="flex">
            <dt class="font-medium w-24 flex-shrink-0">Status:</dt>
            <dd>{formatStatuses($filtersStore.statuses)}</dd>
          </div>

          {#if $filtersStore.region}
            <div class="flex">
              <dt class="font-medium w-24 flex-shrink-0">Region:</dt>
              <dd>{$filtersStore.region}</dd>
            </div>
          {/if}

          {#if $filtersStore.searchTerm}
            <div class="flex">
              <dt class="font-medium w-24 flex-shrink-0">Search Term:</dt>
              <dd class="italic">"{$filtersStore.searchTerm}"</dd>
            </div>
          {/if}
        </dl>
      </div>

      <button
        on:click={() => filtersStore.reset()}
        class="flex-shrink-0 text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400 hover:underline transition"
      >
        Clear Filters
      </button>
    </div>
  </div>
{/if}
