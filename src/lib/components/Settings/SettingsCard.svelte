<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div
  on:click={() => dispatch("open")}
  class="relative flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === "Enter" && dispatch("open")}
>
  <div>
    <slot />
  </div>
</div>
