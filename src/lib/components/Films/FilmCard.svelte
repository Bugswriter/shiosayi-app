<script lang="ts">
  // This is the recommended type-safety fix
  import type { Film } from "$lib/services/database";
  export let film: Film;
</script>

<button type="button" class="group w-[160px] cursor-pointer text-left" on:click>
  <figure>
    {#if film.poster_url}
      <div
        class="relative w-full h-auto aspect-[2/3] bg-white dark:bg-zinc-800 rounded-md overflow-hidden
               border-2 border-zinc-200 dark:border-zinc-700
               shadow-md dark:shadow-black/20
               transition-all duration-200
               group-hover:shadow-xl group-hover:border-pink-500"
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
      <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
        {film.title}
      </p>
      <p class="text-xs text-zinc-500 dark:text-zinc-400">
        {film.year || "N/A"}
      </p>
    </figcaption>
  </figure>
</button>
