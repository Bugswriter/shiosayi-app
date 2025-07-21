<!-- src/lib/components/Settings/SettingsMenu.svelte -->
<script lang="ts">
  import ApiKeyManager from "./ApiKeyManager.svelte";
  import ThemeSwitcher from "./ThemeSwitcher.svelte";
  import SettingsCard from "./SettingsCard.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="p-4 sm:p-6 space-y-6">
  <SettingsCard
    title="API Key"
    description="Manage your Shiosayi membership key."
  >
    <!-- We listen for the custom event here and dispatch 'close' upwards -->
    <ApiKeyManager on:authSuccess={() => dispatch("close")} />
  </SettingsCard>

  <SettingsCard
    title="Appearance"
    description="Customize the look and feel of the app."
  >
    <ThemeSwitcher />
  </SettingsCard>
</div>
