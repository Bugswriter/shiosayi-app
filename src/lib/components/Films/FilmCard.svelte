<script lang="ts">
  // This is the recommended type-safety fix
  import type { Film } from "$lib/services/database";
  export let film: Film;
</script>

<figure class="group w-[160px] cursor-pointer" on:click>
  {#if film.poster_url}
    <div
      class="relative w-full h-auto aspect-[2/3] bg-white border border-gray-300 shadow-[0_2px_6px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-200"
    >
      <img
        class="w-full h-full object-cover"
        src={film.poster_url}
        alt="Poster for {film.title}"
        width="160"
        height="240"
      />
    </div>
  {/if}
  <figcaption class="mt-2 text-center">
    <p class="text-sm font-medium text-gray-800 truncate">{film.title}</p>
    <p class="text-xs text-gray-500">{film.year || "N/A"}</p>
  </figcaption>
</figure>
