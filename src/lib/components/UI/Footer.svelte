<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<footer
  class="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gray-100 px-4 py-1 border-t border-gray-300 text-sm text-gray-600 shadow-inner z-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
>
  <!-- Left-aligned content -->
  <div class="flex items-center gap-x-4">
    <span>© {new Date().getFullYear()} Rare Films</span>
    <span class="hidden sm:block text-xs"
      >Made with ❤️ using Svelte & Tauri</span
    >
  </div>

  <!-- Right-aligned Settings Button -->
  <button
    on:click={() => dispatch("openSettings")}
    aria-label="Open settings"
    class="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-5 w-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </button>
</footer>
