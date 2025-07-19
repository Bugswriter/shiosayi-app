<script lang="ts">
  export let searchTerm: string = "";
</script>

<nav
  class="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 mb-8 border-b border-gray-700"
>
  <div class="container mx-auto">
    <form action="/" method="GET" class="flex gap-4">
      <input
        type="search"
        name="q"
        value={searchTerm}
        placeholder="Search by title..."
        class="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg"
      >
        Search
      </button>
    </form>
  </div>
</nav>
