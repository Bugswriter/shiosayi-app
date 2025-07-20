<!-- src/lib/components/EmptyState.svelte -->
<script lang="ts">
  export let message = "No films match your search.";
</script>

<div class="text-center py-16">
  <p class="text-lg text-gray-500">{message}</p>
</div>
