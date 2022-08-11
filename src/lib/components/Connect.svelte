<script>
	import { apiUrl, apiKey } from '$lib/stores';

	let apiUrlValue;
	let apiKeyValue;

	apiUrl.subscribe((value) => {
		apiUrlValue = value;
	});
	apiKey.subscribe((value) => {
		apiKeyValue = value;
	});
</script>

<p class="my-5">
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 rounded font-mono"
		placeholder="API URL"
		bind:value={apiUrlValue}
	/>
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 rounded font-mono"
		placeholder="API KEY"
		bind:value={apiUrlValue}
	/>
	<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={login}>
		Connect
	</button>
	<button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={login}>
		Disconnect
	</button>
</p>
