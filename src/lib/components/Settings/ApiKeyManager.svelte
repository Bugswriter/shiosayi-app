<!-- src/lib/components/Settings/ApiKeyManager.svelte -->
<script lang="ts">
  import { guardianStore } from "$lib/utils/state";
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let currentKey = "";
  let isLoading = false;
  let errorMsg: string | null = null;
  let justSaved = false;

  async function handleSave() {
    isLoading = true;
    errorMsg = null;
    justSaved = false;

    const success = await guardianStore.authenticate(currentKey);

    if (success) {
      justSaved = true;
      setTimeout(() => {
        dispatch("authSuccess");
      }, 1000);
    } else {
      errorMsg = "Invalid API key or network error.";
      // The key is NOT saved because the store handles that logic
    }
    isLoading = false;
  }
</script>

<div class="flex flex-col gap-2">
  <p class="text-sm text-gray-500 dark:text-gray-400">
    Join the <a
      href="https://bugswriter.com/members"
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
      on:keydown={(e) => {
        if (e.key === "Enter") handleSave();
      }}
      disabled={isLoading}
    />
    <button
      on:click={handleSave}
      class="flex-shrink-0 h-10 w-20 flex items-center justify-center font-semibold text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50"
      disabled={!currentKey || isLoading}
    >
      {#if isLoading}
        <div
          class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></div>
      {:else if justSaved}
        <span in:fly={{ y: -5, duration: 200 }}>Saved!</span>
      {:else}
        <span>Save</span>
      {/if}
    </button>
  </div>
  {#if errorMsg}
    <p class="text-xs text-red-500" transition:fly={{ y: -5 }}>{errorMsg}</p>
  {/if}
</div>
