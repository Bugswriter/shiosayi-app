<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import { filtersStore } from "$lib/utils/state";
  import type { Film } from "$lib/services/database";

  // Components
  import Search from "$lib/components/Filters/SearchBar.svelte";
  import Header from "$lib/components/UI/Header.svelte";
  import Footer from "$lib/components/UI/Footer.svelte";
  import FilterBar from "$lib/components/Filters/FiltersBar.svelte";
  import FilterInfo from "$lib/components/Filters/FiltersInfo.svelte";
  import FilmGrid from "$lib/components/Films/FilmGrid.svelte";
  import Pagination from "$lib/components/Filters/Pagination.svelte";
  import Alert from "$lib/components/UI/Alert.svelte";
  import EmptyState from "$lib/components/Films/NoFilms.svelte";
  import SettingsModal from "$lib/components/Settings/SettingsModal.svelte";
  import SettingsMenu from "$lib/components/Settings/SettingsMenu.svelte";
  import FilmInfoModal from "$lib/components/Films/FilmInfo.svelte";

  export let data: PageData;
  let showSearchModal = false;
  let showSettingsModal = false;
  let selectedFilm: Film | null = null;

  onMount(() => {
    if (data?.filters) {
      filtersStore.set(data.filters);
    }
    const unsubscribe = filtersStore.subscribe((currentFilters) => {
      if (
        data?.filters &&
        JSON.stringify(currentFilters) === JSON.stringify(data.filters)
      ) {
        return;
      }
      const params = new URLSearchParams();
      params.set("page", String(currentFilters.page));
      params.set("limit", String(currentFilters.limit));
      if (currentFilters.searchTerm) params.set("q", currentFilters.searchTerm);
      if (currentFilters.region) params.set("region", currentFilters.region);
      if (currentFilters.statuses)
        params.set("statuses", currentFilters.statuses.join(","));
      goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
    });
    return unsubscribe;
  });

  // --- Event Handlers (Unchanged) ---
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      showSearchModal = true;
    }
  }
  function handleSearchSubmit(event: CustomEvent<{ searchTerm: string }>) {
    showSearchModal = false;
    filtersStore.update((f) => ({
      ...f,
      searchTerm: event.detail.searchTerm,
      page: 1,
    }));
  }
  function handlePrevious() {
    filtersStore.update((f) => ({ ...f, page: Math.max(1, f.page - 1) }));
  }
  function handleNext() {
    filtersStore.update((f) => ({ ...f, page: f.page + 1 }));
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<FilmInfoModal bind:film={selectedFilm} />

<SettingsModal bind:isOpen={showSettingsModal}>
  <SettingsMenu on:close={() => (showSettingsModal = false)} />
</SettingsModal>

<Search bind:isOpen={showSearchModal} on:submit={handleSearchSubmit} />

<svelte:head>
  <title>
    {data?.filters?.searchTerm
      ? `Search: ${data.filters.searchTerm}`
      : "Rare Films"}
  </title>
</svelte:head>

<div
  class="font-sans bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 min-h-screen"
>
  <Header />

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <FilterBar
      regions={data?.regions}
      on:searchClick={() => (showSearchModal = true)}
    />

    <!-- The <main> element is restored to its original structural purpose, without extra backgrounds or padding. -->
    <main class="py-6 pb-24">
      <FilterInfo />

      {#if data?.error}
        <Alert message={data.error} />
      {:else if data?.films?.length > 0}
        <FilmGrid
          films={data.films}
          totalFilms={data.totalFilms}
          selectFilm={(film) => (selectedFilm = film)}
        />
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      {:else}
        <EmptyState />
      {/if}
    </main>
  </div>

  <Footer on:openSettings={() => (showSettingsModal = true)} />
</div>
