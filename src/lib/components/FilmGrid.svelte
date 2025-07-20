<!-- src/lib/components/FilmGrid.svelte -->
<script lang="ts">
  import FilmCard from "./FilmCard.svelte";
  export let films: any[];
</script>

<div
  class="grid gap-5 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] px-0 mx-0 w-full"
>
  {#each films as film (film.id)}
    <FilmCard {film} />
  {/each}
</div>
