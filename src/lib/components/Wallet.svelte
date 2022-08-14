<script>
	import { publicKey, balance, isLoggedIn, loginCredential } from '$lib/stores';
	import { getMnemonic } from '$lib/crypto_storage';
	import { fade } from 'svelte/transition';

	async function exportMnemonic() {
		const mnemonic = await getMnemonic($loginCredential);

		window.alert(mnemonic);
	}
</script>

{#if $isLoggedIn}
	<div class="my-10">
		<h2 class="text-xl font-bold">Local Wallet</h2>

		<div>
			<span in:fade={{ duration: 250 }}>Address: </span>
			<span class="font-mono">{$publicKey}</span>
		</div>

		<div>
			<span>Balance: </span>
			<span class="font-mono" in:fade={{ duration: 250 }}>{$balance}</span>
		</div>

		<div class="my-1">
			<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"> Top Up </button>
			<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"> Withdraw </button>
			<button
				class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"
				on:click={exportMnemonic}
			>
				🔒 Export
			</button>
		</div>
	</div>
{/if}
