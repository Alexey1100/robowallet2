<script>
	import { publicKey, balance } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let publicKeyValue;
	let balanceValue;

	publicKey.subscribe((value) => {
		publicKeyValue = value;
	});
	balance.subscribe((value) => {
		balanceValue = value;
	});
</script>

<div class="font-mono my-5">
	<p>
		<span in:fade={{ duration: 250 }}>Account: </span>
		<span>{publicKeyValue}</span>
	</p>

	<p>
		<span>Balance: </span>
		<span in:fade={{ duration: 250 }}>{balanceValue}</span>
	</p>
</div>
