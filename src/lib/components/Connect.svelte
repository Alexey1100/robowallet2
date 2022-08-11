<script>
	import { apiUrl, apiKey } from '$lib/stores';
</script>

<div class="my-10">
	<h2 class="text-xl font-bold">Settings</h2>
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 my-1 rounded font-mono w-1/2"
		placeholder="API URL"
		bind:value={$apiUrl}
	/>
	<input
		type="text"
		class="bg-neutral-200 px-3 py-1 my-1 rounded font-mono w-1/2"
		placeholder="API KEY"
		bind:value={$apiKey}
	/>
	<div class="my-1">
		<button class="bg-green-200 px-3 py-1 rounded active:bg-neutral-400"> Connect </button>
		<button class="bg-red-200 px-3 py-1 rounded active:bg-neutral-400"> Disconnect </button>
	</div>
</div>
