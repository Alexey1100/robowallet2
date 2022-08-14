<script>
	import { transactionHistory, isLoggedIn } from '$lib/stores';
</script>

{#if $isLoggedIn}
	<div class="my-10">
		<h2 class="text-xl font-bold">Transactions</h2>
		<div class="grid grid-cols-12 gap-2 my-1 bg-slate-200 text- px-3 py-1 rounded font-semibold">
			<div class="col-span-1">Id</div>
			<div class="col-span-1">Type</div>
			<div class="col-span-5">Destination</div>
			<div class="col-span-4">Amount (μALGO)</div>
			<div class="col-span-1">Status</div>
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
{/if}
