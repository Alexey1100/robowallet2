<script>
	import { publicKey, balance, isLoggedIn, loginCredential, algodUrl, algodKey } from '$lib/stores';
	import { getMnemonic, getAccount } from '$lib/crypto_storage';
	import { makePayTxn, signTxn, submitTxn } from '$lib/algorand.js';
	import { fade } from 'svelte/transition';

	async function exportMnemonic() {
		const mnemonic = await getMnemonic($loginCredential);

		window.alert(mnemonic);
	}

	async function topUp() {
		// Implement topup
	}

	async function withdraw() {
		const account = await getAccount($loginCredential);
		const algosdk = (await import('algosdk')).default;
		const algodClient = new algosdk.Algodv2(
			{
				'x-api-key': $algodKey
			},
			$algodUrl,
			''
		);

		try {
			let txn = await makePayTxn($publicKey, $loginCredential, $balance, algosdk, algodClient);
			let signedTxn = await signTxn(txn, account);
			await submitTxn(signedTxn, algosdk, algodClient);
		} catch (err) {
			console.error(err);
			window.alert(err);
		}
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
			<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={topUp}>
				Top Up
			</button>

			<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={withdraw}>
				Withdraw
			</button>

			<button
				class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"
				on:click={exportMnemonic}
			>
				🔒 Export
			</button>
		</div>
	</div>
{/if}
