<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { filtersStore } from "$lib/stores";
  import type { PageData } from "./$types";

  import Search from "$lib/components/Search.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import FilmGrid from "$lib/components/FilmGrid.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";

  export let data: PageData;
  let showSearchModal = false;

  // ===== CORE REACTIVE LOGIC ===== //
  onMount(() => {
    // 1. When the page loads, initialize our store with the filters from the `load` function.
    filtersStore.set(data.filters);

    // 2. Subscribe to any changes in the store (e.g., from FilterBar or Pagination).
    const unsubscribe = filtersStore.subscribe((currentFilters) => {
      // The store is initialized with data.filters, so this check prevents an
      // immediate navigation on page load.
      if (JSON.stringify(currentFilters) === JSON.stringify(data.filters)) {
        return;
      }

      // 3. Build a new URL query string from the store's state.
      const params = new URLSearchParams();
      params.set("page", String(currentFilters.page));
      params.set("limit", String(currentFilters.limit));

      if (currentFilters.searchTerm) params.set("q", currentFilters.searchTerm);
      if (currentFilters.region) params.set("region", currentFilters.region);
      if (currentFilters.statuses)
        params.set("statuses", currentFilters.statuses.join(","));

      // 4. Navigate to the new URL. SvelteKit will re-run the `load` function.
      goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
    });

    return unsubscribe; // Clean up the subscription when the component is unmounted.
  });

  // ===== EVENT HANDLERS ===== //
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      showSearchModal = true;
    }
  }

  function handleSearchSubmit(event: CustomEvent<{ searchTerm: string }>) {
    // This is called when the Search component dispatches 'submit'
    showSearchModal = false;
    filtersStore.update((f) => ({
      ...f,
      searchTerm: event.detail.searchTerm,
      page: 1, // Reset to page 1 on new search
    }));
  }

  function handleClearSearch() {
    filtersStore.update((f) => {
      const { searchTerm, ...rest } = f; // Remove searchTerm from filters
      return { ...rest, page: 1 };
    });
  }

  function handlePrevious() {
    filtersStore.update((f) => ({ ...f, page: Math.max(1, f.page - 1) }));
  }

  function handleNext() {
    filtersStore.update((f) => ({ ...f, page: f.page + 1 }));
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- The Search modal now dispatches a 'submit' event -->
<Search
  bind:isOpen={showSearchModal}
  on:submit={handleSearchSubmit}
  on:close={() => (showSearchModal = false)}
/>

<svelte:head>
  <title>
    {data.filters.searchTerm
      ? `Search: ${data.filters.searchTerm}`
      : "Rare Films"}
  </title>
</svelte:head>

<div class="font-sans bg-gray-100/90 text-gray-800 min-h-screen">
  <PageHeader on:searchClick={() => (showSearchModal = true)} />

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- FilterBar now works without props by using the store -->
    <FilterBar regions={data.regions} />

    <main class="pb-16">
      {#if data.filters.searchTerm}
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-lg text-gray-700">
            Results for:
            <span class="font-semibold text-pink-600"
              >"{data.filters.searchTerm}"</span
            >
          </h2>
          <!-- Use a button with an event handler for better accessibility and control -->
          <button
            on:click={handleClearSearch}
            class="text-sm text-pink-500 hover:text-pink-400 hover:underline transition"
          >
            Clear Search
          </button>
        </div>
      {/if}

      {#if data.error}
        <Alert message={data.error} />
      {:else if data.films.length > 0}
        <FilmGrid films={data.films} />
        <!-- Pagination is now event-driven -->
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          on:previous={handlePrevious}
          on:next={handleNext}
        />
      {:else}
        <EmptyState />
      {/if}
    </main>
  </div>
</div>
