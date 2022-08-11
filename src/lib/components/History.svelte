<script>
	import { transactionHistory } from '$lib/stores';
</script>

<div class="my-10">
	<h2 class="text-xl font-bold">Transactions</h2>
	<div
		class="grid grid-cols-12 gap-2 my-1 bg-slate-200 text- px-3 py-1 rounded capitalize font-semibold"
	>
		<div class="col-span-1">id</div>
		<div class="col-span-1">type</div>
		<div class="col-span-5">destination</div>
		<div class="col-span-4">amount (ALGO)</div>
		<div class="col-span-1">status</div>
	</div>

	{#each $transactionHistory as t}
		<div class="grid grid-cols-12 gap-2 my-1 bg-slate-100 text- px-3 py-1 rounded">
			<div class="col-span-1 truncate hover:text-clip">{t.id}</div>
			<div class="col-span-1 truncate hover:text-clip">{t.transactableType}</div>
			<div class="col-span-5 truncate hover:text-clip font-mono">{t.destination}</div>
			<div class="col-span-4 truncate hover:text-clip font-mono">{t.amount}</div>
			<div class="col-span-1 truncate hover:text-clip">{t.status}</div>
		</div>
	{/each}
</div>
