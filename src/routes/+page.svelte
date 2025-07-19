<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<main
  class="container mx-auto p-8 bg-gray-900 text-white min-h-screen font-sans"
>
  <h1
    class="text-4xl font-bold mb-8 text-teal-400 border-b border-gray-700 pb-4"
  >
    Film Collection
  </h1>

  {#if data.error}
    <div class="bg-red-800 p-4 rounded-lg">
      <p class="font-bold text-red-200">{data.error}</p>
    </div>
  {:else if data.films.length > 0}
    <div class="space-y-4">
      {#each data.films as film (film.id)}
        <div class="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-sky-400">{film.title}</h2>
          <p class="text-gray-400">Year: {film.year}</p>
        </div>
      {/each}
    </div>

    <div class="flex justify-between items-center mt-8 text-gray-300">
      <a
        href="?page={data.pagination.page - 1}"
        class:pointer-events-none={data.pagination.page <= 1}
        class="px-4 py-2 font-bold text-white bg-sky-600 rounded {data
          .pagination.page <= 1
          ? 'opacity-50'
          : 'hover:bg-sky-700'}"
      >
        Previous
      </a>

      <span>
        Page {data.pagination.page} of {data.pagination.totalPages}
      </span>

      <a
        href="?page={data.pagination.page + 1}"
        class:pointer-events-none={data.pagination.page >=
          data.pagination.totalPages}
        class="px-4 py-2 font-bold text-white bg-sky-600 rounded {data
          .pagination.page >= data.pagination.totalPages
          ? 'opacity-50'
          : 'hover:bg-sky-700'}"
      >
        Next
      </a>
    </div>
  {:else}
    <div class="bg-gray-800 text-center p-8 rounded-lg">
      <p class="text-amber-400 text-lg">No films found in the database.</p>
    </div>
  {/if}
</main>
