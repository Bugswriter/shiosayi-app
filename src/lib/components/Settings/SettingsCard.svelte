<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div
  on:click={() => dispatch("open")}
  class="relative flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === "Enter" && dispatch("open")}
>
  <div>
    <slot />
  </div>
</div>
