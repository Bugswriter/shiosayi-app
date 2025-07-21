<!-- src/lib/components/Settings/SettingsModal.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let isOpen = false;

  function closeModal() {
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  $: {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.addEventListener("keydown", handleKeydown);
        document.body.style.overflow = "hidden";
      } else {
        document.removeEventListener("keydown", handleKeydown);
        document.body.style.overflow = "";
      }
    }
  }

  // Ensure we clean up if the component is ever destroyed while open.
  onDestroy(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    }
  });
</script>

{#if isOpen}
  <div
    on:click={closeModal}
    on:keydown={(e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    }}
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
      role="document"
    >
      <slot />

      <button
        on:click={closeModal}
        class="absolute top-3 right-3 p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
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
  </div>
{/if}
