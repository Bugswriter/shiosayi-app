<!-- src/lib/components/Alert.svelte -->
<script lang="ts">
  export let message: string;
</script>

<div class="bg-red-100 p-4 rounded border border-red-300 shadow-sm">
  <p class="font-bold text-red-600">{message}</p>
</div>
