<!-- src/lib/components/UI/Crash.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  /** The error message to display. Passed in from the parent. */
  export let message: string | null;

  // --- FIX ---
  // Define the events this component can dispatch using a generic type.
  // This says: "This dispatcher can emit a 'retry' event, which carries no data (void)."
  const dispatch = createEventDispatcher<{ retry: void }>();
</script>

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 p-8 text-center"
>
  <div class="max-w-md">
    <h1 class="text-3xl font-bold text-red-600 dark:text-red-500">
      Application Error
    </h1>
    <p class="mt-4 text-base text-zinc-600 dark:text-zinc-300">
      {message || "An unknown error occurred during startup."}
    </p>
    <button
      on:click={() => dispatch("retry")}
      class="mt-8 px-6 py-2 font-semibold text-white bg-pink-600 rounded-lg shadow-md hover:bg-pink-700 dark:hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-75 transition-colors"
    >
      Retry
    </button>
  </div>
</div>
