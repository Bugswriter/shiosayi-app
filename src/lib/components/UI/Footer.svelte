<!-- src/lib/components/UI/Footer.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { guardianStore } from "$lib/utils/state";
  import GuardianInfo from "$lib/components/Guardian/GuardianInfo.svelte";

  const dispatch = createEventDispatcher();
  const guardian = guardianStore;
  let showGuardianInfo = false;
</script>

<GuardianInfo bind:isOpen={showGuardianInfo} />

<footer
  class="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-zinc-100 px-4 py-1 border-t border-zinc-200 text-sm text-zinc-600 shadow-inner z-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
>
  <div class="flex items-center gap-x-4">
    <span>© {new Date().getFullYear()} Rare Films</span>
    <span class="hidden sm:block text-xs"
      >Made with ❤️ using Svelte & Tauri</span
    >
  </div>

  <div class="flex items-center gap-2">
    {#if $guardian}
      <button
        on:click={() => (showGuardianInfo = true)}
        aria-label="Open guardian profile"
        class="px-3 py-1.5 flex items-center gap-2 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4 text-pink-600 dark:text-pink-500"
        >
          <path
            d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.998 6.998 0 0010 11.5a6.998 6.998 0 00-6.535 2.993z"
          />
        </svg>
        <span class="text-xs font-medium">{$guardian.name}</span>
      </button>
    {/if}

    <button
      on:click={() => dispatch("openSettings")}
      aria-label="Open settings"
      class="p-2 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors"
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495-.645.87l.213-1.281z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  </div>
</footer>
