import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true
    }),
    optimizeImports()
  ],
  kit: {
    adapter: adapter(),
    prerender: {
      default: true
    }
  }
};

export default config;
