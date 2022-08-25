<script>
  import '../app.css';
  import { Buffer } from 'buffer';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import "carbon-components-svelte/css/white.css";

  // NOTE: Polyfill for Buffer
  onMount(async () => {
    if (browser) {
      window.Buffer = Buffer;
    }
  });
</script>

<main class="p-5">
  <slot />
</main>
