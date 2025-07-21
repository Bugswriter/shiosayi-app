<script lang="ts">
  import { initializeApp } from "$lib/services/init";
  import { appState, appError } from "$lib/utils/state";
  import DbInitializer from "$lib/components/UI/Initialize.svelte";
  import DbError from "$lib/components/UI/Crash.svelte";

  // This logic now runs the combined init process
  const startupPromise = initializeApp()
    .then(() => ($appState = "ready"))
    .catch((err) => {
      $appError =
        err.message || "An unknown error occurred during initialization.";
      $appState = "error";
    });
</script>

{#await startupPromise}
  <DbInitializer />
{:then}
  {#if $appState === "ready"}
    <slot />
  {:else if $appState === "error"}
    <DbError message={$appError} on:retry={() => window.location.reload()} />
  {/if}
{/await}
