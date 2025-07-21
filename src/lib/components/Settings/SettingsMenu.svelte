<script lang="ts">
  import ApiKeyManager from "./ApiKeyManager.svelte";
  import ThemeSwitcher from "./ThemeSwitcher.svelte";
</script>

<div class="flex flex-col gap-y-2">
  <h2
    class="text-xl font-bold text-gray-800 dark:text-gray-100 pb-2 mb-4 border-b border-gray-200 dark:border-gray-700"
  >
    Settings
  </h2>

  <!-- API Key Setting -->
  <div class="py-3">
    <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
      API Key
    </h3>
    <ApiKeyManager />
  </div>

  <!-- Theme Setting -->
  <div class="py-3 mt-2 border-t border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
      Appearance
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Choose between light and dark mode.
    </p>
    <ThemeSwitcher />
  </div>
</div>
