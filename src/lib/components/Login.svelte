<script>
	import { getAccount } from '$lib/crypto_storage';
	import { publicKey, isLoggedIn, loginCredential } from '$lib/stores';

	async function login() {
		const account = await getAccount($loginCredential);
		publicKey.set(account.addr);
		isLoggedIn.set(true);
	}
</script>

<p class="my-5">
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 rounded font-mono"
		placeholder="Login"
		bind:value={$loginCredential}
	/>
	<button
		class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-400"
		disabled={$isLoggedIn}
		on:click={login}
	>
		Sign In
	</button>
	<button
		class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400  disabled:cursor-not-allowed disabled:text-neutral-400"
		disabled
	>
		Sign Out
	</button>
</p>
