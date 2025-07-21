<!-- src/lib/components/Guardian/GuardianCard.svelte -->
<script lang="ts">
  import type { GuardianFilm } from "$lib/utils/state";
  export let film: GuardianFilm;
</script>

<div
  class="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
>
  <img
    src={film.poster_url ||
      "https://placehold.co/80x120/1f2937/9ca3af?text=N/A"}
    alt="Poster for {film.title}"
    class="w-14 h-auto aspect-[2/3] object-cover rounded-md shadow-md flex-shrink-0"
  />
  <div class="overflow-hidden">
    <p class="font-bold text-gray-800 dark:text-gray-100 truncate">
      {film.title}
    </p>
    <p class="text-sm text-gray-600 dark:text-gray-400">{film.year}</p>
  </div>
</div>
