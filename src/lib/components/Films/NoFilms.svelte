<!-- src/lib/components/Films/NoFilms.svelte -->
<div
  class="flex flex-col items-center justify-center text-center text-muted-foreground py-16"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-film mb-4 opacity-50"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M3 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 3v18" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </svg>
  <p class="text-lg font-medium">No films match your search.</p>
  <p class="text-sm">Try adjusting your filters or search term.</p>
</div>
