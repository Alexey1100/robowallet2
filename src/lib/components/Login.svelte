<script>
	import { getAccount } from '$lib/crypto_storage';
	import { publicKey, isLoggedIn, loginCredential } from '$lib/stores';

	async function login() {
		const account = await getAccount($loginCredential);
		publicKey.set(account.addr);
		isLoggedIn.set(true);
	}
</script>

<div class="my-10">
	<h2 class="text-xl font-bold">Remote Wallet</h2>
	{#if $isLoggedIn}
		<div>
			<span>Address: </span>
			<span class="font-mono">{$loginCredential}</span>
		</div>

		<button
			class="bg-neutral-200 px-3 py-1 my-1 rounded active:bg-neutral-400  disabled:cursor-not-allowed disabled:text-neutral-400"
		>
			Disconnect
		</button>
	{:else}
		<div class="my-3">
			To get started, connect a remote wallet via <b>WalletConnect</b>.
			<br />
			Your local wallet will be securely stored and encrypted using <b>WebAuthn</b>.
		</div>

		<button
			class="bg-neutral-200 px-3 py-1 my-1 rounded active:bg-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-400"
			on:click={login}
		>
			Connect
		</button>
	{/if}
</div>
