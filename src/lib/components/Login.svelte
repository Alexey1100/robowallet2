<script>
	import { getAccount } from '$lib/crypto_storage';
	import { publicKey } from '$lib/stores';

	let loginCredential;

	async function login() {
		const account = await getAccount(loginCredential);
		publicKey.set(account.addr);
	}
</script>

<p class="my-5">
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 rounded font-mono"
		placeholder="Login"
		bind:value={loginCredential}
	/>
	<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={login}>
		Sign In
	</button>
</p>
