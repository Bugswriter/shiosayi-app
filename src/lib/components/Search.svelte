<!-- src/lib/components/Search.svelte -->
<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  export let isOpen = false;
  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  function autofocus(node: HTMLInputElement) {
    setTimeout(() => node.focus(), 0);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      close();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
</script>

{#if isOpen}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Search films"
    class="fixed top-[35%] left-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 border border-gray-600 bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-lg shadow-[0_5px_25px_rgba(0,0,0,0.5)]"
  >
    <!-- Titlebar: Search + Close Button -->
    <div
      class="flex items-center border-b border-gray-600 bg-gradient-to-b from-gray-600 to-gray-700 px-3 py-2 rounded-t-lg"
    >
      <!-- Search Input -->
      <form action="/" method="GET" on:submit={close} class="flex-1">
        <input
          type="search"
          name="q"
          use:autofocus
          placeholder="Search..."
          class="w-full bg-gray-300 text-black placeholder:text-gray-600 border border-gray-500 px-2 py-1 text-sm rounded focus:outline-none focus:ring-0"
        />
      </form>

      <!-- Close Button -->
      <button
        type="button"
        on:click={close}
        aria-label="Close"
        class="ml-2 text-gray-300 hover:text-white px-2 py-1 text-lg font-bold focus:outline-none focus:ring-0"
      >
        ✕
      </button>
    </div>

    <!-- Optional Content -->
    <div class="p-3 text-sm text-gray-300">Type to search your library...</div>
  </div>
{/if}
