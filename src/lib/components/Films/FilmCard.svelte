<script lang="ts">
  // This is the recommended type-safety fix
  import type { Film } from "$lib/services/database";
  export let film: Film;
</script>

<button type="button" class="group w-[160px] cursor-pointer text-left" on:click>
  <figure>
    {#if film.poster_url}
      <div
        class="relative w-full h-auto aspect-[2/3] bg-card border border-border shadow-[0_2px_6px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-200 overflow-hidden rounded-md"
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
      <p class="text-sm font-medium text-card-foreground truncate">
        {film.title}
      </p>
      <p class="text-xs text-muted-foreground">{film.year || "N/A"}</p>
    </figcaption>
  </figure>
</button>
