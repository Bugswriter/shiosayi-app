<!-- src/routes/+page.svelte -->
<script lang="ts">
  // 1. SvelteKit and Type Imports
  import type { PageData } from "./$types";

  // 2. Component Imports
  import Search from "$lib/components/Search.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte"; // <-- IMPORT THE NEW COMPONENT
  import FilmGrid from "$lib/components/FilmGrid.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";

  // 3. Page Data and State
  export let data: PageData;
  let showSearchModal = false;

  // 4. Event Handlers
  function handleKeydown(event: KeyboardEvent) {
    // Listens for Ctrl+K or Cmd+K to open the search modal
    if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      showSearchModal = true;
    }
  }
</script>

<!-- Global listener for the search shortcut -->
<svelte:window on:keydown={handleKeydown} />

<!-- The search modal component, its visibility is controlled by this page -->
<Search
  bind:isOpen={showSearchModal}
  on:close={() => (showSearchModal = false)}
/>

<!-- Sets the document head for this page -->
<svelte:head>
  <title>
    {data.searchTerm ? `Search: ${data.searchTerm}` : "Rare Films"}
  </title>
</svelte:head>

<!-- Page Wrapper with your custom background -->
<div
  class="font-sans bg-[url('')] bg-repeat bg-[length:150px_150px] bg-gray-100/90 text-gray-800 min-h-screen"
>
  <PageHeader on:searchClick={() => (showSearchModal = true)} />

  <!-- A container to align the FilterBar and main content -->
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- ADD THE FILTER BAR HERE -->
    <FilterBar />

    <main class="pt-6 pb-16">
      {#if data.searchTerm}
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-lg text-gray-700">
            Results for: <span class="font-semibold text-pink-600"
              >"{data.searchTerm}"</span
            >
          </h2>
          <a
            href="/"
            class="text-sm text-pink-500 hover:text-pink-400 hover:underline transition"
          >
            Clear Search
          </a>
        </div>
      {/if}

      {#if data.error}
        <Alert message={data.error} />
      {:else if data.films.length > 0}
        <FilmGrid films={data.films} />
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          searchTerm={data.searchTerm}
        />
      {:else}
        <EmptyState />
      {/if}
    </main>
  </div>
</div>

<style>
</style>
