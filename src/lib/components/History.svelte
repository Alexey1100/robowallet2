<script>
	import { isLoggedIn } from '$lib/stores';
	import { liveQuery } from 'dexie';
	import { db } from '$lib/db';
	import { browser } from '$app/env';

	let transactions = liveQuery(() => (browser ? db.transactions.toArray() : []));
</script>

{#if $isLoggedIn && $transactions.count > 0}
	<div class="my-10">
		<h2 class="text-xl font-bold">Transactions</h2>
		<div class="grid grid-cols-12 gap-2 my-1 bg-slate-200 text- px-3 py-1 rounded font-semibold">
			<div class="col-span-1">Id</div>
			<div class="col-span-1">Type</div>
			<div class="col-span-5">Destination</div>
			<div class="col-span-3">Amount (μALGO)</div>
			<div class="col-span-1">Status</div>
			<div class="col-span-1">Hash</div>
		</div>

		{#each $transactions as t (t.id)}
			<div class="grid grid-cols-12 gap-2 my-1 bg-slate-100 text- px-3 py-1 rounded">
				<div class="col-span-1 truncate hover:text-clip">{t.id}</div>
				<div class="col-span-1 truncate hover:text-clip">{t.blockchainTransactionbleType}</div>
				<div class="col-span-5 truncate hover:text-clip font-mono">{t.destination}</div>
				<div class="col-span-3 truncate hover:text-clip font-mono">{t.amount}</div>
				<div class="col-span-1 truncate hover:text-clip">{t.status} {t.statusMessage}</div>
				<div class="col-span-1 truncate hover:text-clip font-mono">{t.hash}</div>
			</div>
		{/each}
	</div>
{/if}
