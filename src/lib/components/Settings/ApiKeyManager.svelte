<script lang="ts">
  import { settingsStore } from "$lib/utils/stores";
  import { fly } from "svelte/transition";

  let currentKey = $settingsStore.apiKey || "";
  let saved = false;

  function handleSave() {
    settingsStore.setApiKey(currentKey);
    saved = true;
    setTimeout(() => (saved = false), 2000); // Hide "Saved!" message after 2 seconds
  }
</script>

<div class="flex flex-col gap-2">
  <p class="text-sm text-gray-500 dark:text-gray-400">
    Join the <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      class="text-pink-600 hover:underline dark:text-pink-400"
      >shiosayi membership</a
    > to obtain an API key.
  </p>
  <div class="flex items-center gap-2">
    <input
      type="password"
      bind:value={currentKey}
      placeholder="Enter your API key..."
      class="flex-grow w-full h-10 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
    />
    <button
      on:click={handleSave}
      class="flex-shrink-0 h-10 px-4 font-semibold text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50"
      disabled={currentKey === $settingsStore.apiKey}
    >
      {#if saved}
        <span in:fly={{ y: -5, duration: 200 }}>Saved!</span>
      {:else}
        <span>Save</span>
      {/if}
    </button>
  </div>
</div>
