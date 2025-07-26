<!-- src/lib/components/UI/Header.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<!-- 
  The Header Container:
  - `sticky top-0`: Keeps the header at the top when scrolling.
  - `backdrop-blur-lg`: The key "Apple" effect that blurs content behind it.
  - `bg-white/70 dark:bg-zinc-900/70`: A semi-transparent background to let the blur show through.
  - `border-b`: A very subtle bottom border to separate the header from the content.
-->
<header
  class="sticky top-0 z-30 w-full backdrop-blur-lg transition-colors duration-500
         bg-white/70 dark:bg-zinc-900/70
         border-b border-zinc-900/10 dark:border-white/10"
>
  <div
    class="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between"
  >
    <!-- The Title:
      - Uses the new handwriting font.
      - Uses a gradient for a premium text effect.
    -->
    <h1
      class="font-script text-3xl font-bold bg-gradient-to-r from-pink-600 to-fuchsia-500 dark:from-pink-500 dark:to-fuchsia-400 bg-clip-text text-transparent"
    >
      Shiosayi Films
    </h1>
  </div>
</header>
