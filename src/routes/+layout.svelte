<script lang="ts">
  import type { PageData } from "./$types";
  import DbInitializer from "$lib/components/UI/Initialize.svelte";
  import DbError from "$lib/components/UI/Crash.svelte";

  export let data: PageData;
</script>

{#await data}
  <DbInitializer />
{:then _}
  {#if _.startupError}
    <DbError
      message={_.startupError}
      on:retry={() => window.location.reload()}
    />
  {:else}
    <slot />
  {/if}
{:catch error}
  <DbError message={error.message} on:retry={() => window.location.reload()} />
{/await}
