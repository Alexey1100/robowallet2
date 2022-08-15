import { sveltekit } from '@sveltejs/kit/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		global: 'globalThis'
	},
	plugins: [sveltekit()]
};

export default config;
