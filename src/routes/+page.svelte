<script lang="ts">
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  export let data: PageData;
</script>

<svelte:head>
  <title>
    {data.searchTerm ? `Searching for "${data.searchTerm}"` : "Film Collection"}
  </title>
</svelte:head>

<main class="bg-gray-900 min-h-screen text-gray-300">
  <Nav searchTerm={data.searchTerm} />

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    {#if data.searchTerm}
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-xl text-gray-400">
          Showing results for: <span class="font-bold text-sky-400"
            >"{data.searchTerm}"</span
          >
        </h2>
        <a href="/" class="text-sm text-amber-400 hover:underline"
          >Clear Search</a
        >
      </div>
    {/if}

    {#if data.error}
      <div class="bg-red-800 p-4 rounded-lg">
        <p class="font-bold text-red-200">{data.error}</p>
      </div>
    {:else if data.films.length > 0}
      <div class="space-y-6">
        {#each data.films as film (film.id)}
          <div
            class="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
          >
            <div class="md:w-1/4 xl:w-1/5 flex-shrink-0 bg-gray-700">
              {#if film.poster_url}
                <img
                  src={film.poster_url}
                  alt="Poster for {film.title}"
                  class="w-full h-full object-cover"
                />
              {/if}
            </div>
            <div class="p-6 flex-grow">
              <h2 class="text-2xl font-bold text-sky-400">
                {film.title} ({film.year})
              </h2>
              <div class="mt-4 flex items-center space-x-4 text-sm">
                <span
                  class="bg-cyan-800/50 text-cyan-300 px-3 py-1 rounded-full"
                  >{film.status}</span
                >
                <span
                  class="bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full"
                  >{film.region}</span
                >
              </div>
              <p class="mt-4 text-gray-400 leading-relaxed">
                {film.plot || "No plot summary available."}
              </p>
              <div class="mt-6 border-t border-gray-700 pt-4">
                <h3 class="font-semibold text-white">Guardian Information</h3>
                <p class="text-teal-400">
                  {film.guardian_name || "No guardian assigned."}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="flex justify-between items-center mt-8 text-gray-300">
        <a
          href="?q={data.searchTerm}&page={data.pagination.page - 1}"
          class:pointer-events-none={data.pagination.page <= 1}
          class="px-4 py-2 font-bold text-white bg-sky-600 rounded {data
            .pagination.page <= 1
            ? 'opacity-50'
            : 'hover:bg-sky-700'}">Previous</a
        >
        <span class="font-mono"
          >Page {data.pagination.page} of {data.pagination.totalPages}</span
        >
        <a
          href="?q={data.searchTerm}&page={data.pagination.page + 1}"
          class:pointer-events-none={data.pagination.page >=
            data.pagination.totalPages}
          class="px-4 py-2 font-bold text-white bg-sky-600 rounded {data
            .pagination.page >= data.pagination.totalPages
            ? 'opacity-50'
            : 'hover:bg-sky-700'}">Next</a
        >
      </div>
    {:else}
      <div class="text-center p-8">
        <p class="text-lg text-amber-400">No films found.</p>
      </div>
    {/if}
  </div>
</main>
