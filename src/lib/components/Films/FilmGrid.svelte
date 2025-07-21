<script lang="ts">
  import FilmCard from "./FilmCard.svelte";
  export let films: any[];
  export let totalFilms: number;
</script>

<div>
  <div class="mb-4 text-md text-gray-600 dark:text-gray-400">
    {#if totalFilms > 0}
      <p>Found {totalFilms} film{totalFilms !== 1 ? "s" : ""}.</p>
    {:else}
      <p>No films found matching your criteria.</p>
    {/if}
  </div>

  <div
    class="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] px-0 mx-0 w-full"
  >
    {#each films as film (film.id)}
      <FilmCard {film} />
    {/each}
  </div>
</div>
