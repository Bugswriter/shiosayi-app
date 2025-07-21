<script lang="ts">
  import FilmCard from "./FilmCard.svelte";
  import type { Film } from "$lib/services/database";

  export let films: Film[];
  export let totalFilms: number;

  export let selectFilm: (film: Film) => void;
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
      <!-- When this FilmCard is clicked, we call the selectFilm function with the film data -->
      <FilmCard {film} on:click={() => selectFilm(film)} />
    {/each}
  </div>
</div>
