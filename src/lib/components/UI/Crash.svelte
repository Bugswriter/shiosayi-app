<!-- src/lib/components/UI/Crash.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { appError } from "$lib/utils/state";

  const dispatch = createEventDispatcher();
</script>

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 dark:bg-amber-950 text-gray-800 dark:text-gray-200 p-8 text-center"
>
  <div class="max-w-md">
    <h1 class="text-3xl font-bold text-red-600 dark:text-red-400">
      Application Error
    </h1>
    <p class="mt-4 text-base text-gray-600 dark:text-gray-300">
      {$appError || "An unknown error occurred during startup."}
    </p>
    <button
      on:click={() => dispatch("retry")}
      class="mt-8 px-6 py-2 font-semibold text-white bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75 transition-colors"
    >
      Retry
    </button>
  </div>
</div>
