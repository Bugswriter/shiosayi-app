<script lang="ts">
  import { onMount } from "svelte";

  const messages = [
    "Polishing the lens...",
    "Loading the film stock...",
    "Finding the perfect frame...",
    "Adjusting the aperture...",
    "Waiting for the director's cue...",
    "Syncing audio and video...",
    "Color grading the scenes...",
  ];

  let message = messages[0];

  onMount(() => {
    message = messages[Math.floor(Math.random() * messages.length)];
  });
</script>

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100/90 dark:bg-amber-950/95 text-gray-800 dark:text-gray-200"
>
  <svg
    class="size-12 animate-spin text-amber-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
  <p class="mt-4 text-lg font-medium tracking-wide">{message}</p>
</div>
