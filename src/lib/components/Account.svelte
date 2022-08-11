<script>
	import { publicKey, balance } from '$lib/stores';
	import { fade } from 'svelte/transition';
</script>

<div class="my-10">
	<h2 class="text-xl font-bold">Wallet</h2>
	<div>
		<span in:fade={{ duration: 250 }}>Address: </span>
		<span class="font-mono">{$publicKey}</span>
	</div>

	<div>
		<span>Balance: </span>
		<span class="font-mono" in:fade={{ duration: 250 }}>{$balance}</span>
	</div>

	<div class="my-1">
		<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"> Top-up </button>
	</div>
</div>
