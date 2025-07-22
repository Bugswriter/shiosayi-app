<!-- src/lib/components/Settings/ThemeSwitcher.svelte -->
<script lang="ts">
  import { settingsStore } from "$lib/utils/state";
  import type { Theme } from "$lib/utils/settings";

  const themes: { id: Theme; label: string; icon: string }[] = [
    {
      id: "light",
      label: "Light",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 mb-1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`,
    },
    {
      id: "dark",
      label: "Dark",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 mb-1"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`,
    },
    {
      id: "system",
      label: "System",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 mb-1"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>`,
    },
  ];
</script>

<div
  class="grid grid-cols-3 gap-0 overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-600"
>
  {#each themes as theme (theme.id)}
    {@const isActive = $settingsStore.theme === theme.id}
    <button
      on:click={() => settingsStore.setTheme(theme.id)}
      class="flex flex-col items-center justify-center gap-1 p-4 text-center text-sm font-semibold transition-colors duration-150 focus:outline-none focus:relative focus:z-10 focus:ring-2 focus:ring-pink-500"
      class:bg-pink-600={isActive}
      class:text-white={isActive}
      class:hover:bg-pink-700={isActive}
      class:dark:hover:bg-pink-500={isActive}
      class:bg-white={!isActive}
      class:dark:bg-zinc-700={!isActive}
      class:text-zinc-600={!isActive}
      class:dark:text-zinc-300={!isActive}
      class:hover:bg-zinc-100={!isActive}
      class:dark:hover:bg-zinc-600={!isActive}
    >
      {@html theme.icon}
      {theme.label}
    </button>
  {/each}
</div>
