<!-- src/lib/components/Pagination.svelte -->
<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let searchTerm: string | null = null;
</script>

<nav class="mt-10 flex justify-center items-center gap-4">
  <a
    href={currentPage > 1
      ? `?q=${searchTerm || ""}&page=${currentPage - 1}`
      : null}
    class="px-4 py-2 font-medium text-gray-800 bg-gray-200 rounded border border-gray-400 hover:bg-gray-300 transition"
    class:opacity-50={currentPage <= 1}
    class:pointer-events-none={currentPage <= 1}
  >
    Previous
  </a>

  <span class="font-mono text-gray-600 text-sm">
    {currentPage} / {totalPages}
  </span>

  <a
    href={currentPage < totalPages
      ? `?q=${searchTerm || ""}&page=${currentPage + 1}`
      : null}
    class="px-4 py-2 font-medium text-gray-800 bg-gray-200 rounded border border-gray-400 hover:bg-gray-300 transition"
    class:opacity-50={currentPage >= totalPages}
    class:pointer-events-none={currentPage >= totalPages}
  >
    Next
  </a>
</nav>
