<!-- src/lib/components/Search.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  export let isOpen = false;
  const dispatch = createEventDispatcher();

  // This variable will hold the value of the input field
  let searchTerm = "";

  function close() {
    dispatch("close");
  }

  /**
   * This function is now called when the form is submitted.
   * It prevents the default browser navigation and instead dispatches
   * a 'submit' event with the search term for the parent page to handle.
   */
  function handleSubmit() {
    // Only dispatch if the user has typed something
    if (searchTerm.trim()) {
      dispatch("submit", { searchTerm: searchTerm.trim() });
    }
  }

  // A utility to autofocus the input when the modal opens
  function autofocus(node: HTMLInputElement) {
    // A small timeout ensures the element is visible before focusing
    setTimeout(() => node.focus(), 50);
  }

  // Handles the 'Escape' key to close the modal
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      close();
    }
  }

  // Add/remove the global event listener when the component is mounted/destroyed
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
      <!-- 
        KEY CHANGES:
        1. `on:submit|preventDefault` stops the page reload.
        2. It now calls our custom `handleSubmit` function.
        3. `action` and `method` attributes are removed as they are no longer needed.
      -->
      <form on:submit|preventDefault={handleSubmit} class="flex-1">
        <!-- 
          KEY CHANGES:
          1. `bind:value={searchTerm}` creates a two-way binding to our script variable.
          2. `name="q"` is removed as we are not using a standard form submission.
        -->
        <input
          type="search"
          bind:value={searchTerm}
          use:autofocus
          placeholder="Search..."
          class="w-full bg-gray-300 text-black placeholder:text-gray-600 border border-gray-500 px-2 py-1 text-sm rounded focus:outline-none focus:ring-0"
        />
      </form>

      <!-- Close Button (No changes needed here) -->
      <button
        type="button"
        on:click={close}
        aria-label="Close"
        class="ml-2 text-gray-300 hover:text-white px-2 py-1 text-lg font-bold focus:outline-none focus:ring-0"
      >
        ✕
      </button>
    </div>

    <!-- Optional Content (No changes needed here) -->
    <div class="p-3 text-sm text-gray-300">Type to search your library...</div>
  </div>
{/if}
