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

  <button
    on:click|stopPropagation={() => dispatch("close")}
    class="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
    aria-label="Close or remove setting"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</div>
