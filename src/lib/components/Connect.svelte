<script>
	import { apiUrl, apiKey, isLoggedIn, publicKey, isConnected, loginCredential } from '$lib/stores';
	import { getAccount } from '$lib/crypto_storage';
	import { db } from '$lib/db';
	import { onDestroy } from 'svelte';

	const fetchPeriod = 1000;
	const algodKey = 'yay5jiXMXr88Bi8nsG1Af9E1X3JfwGOC2F7222r3';
	const algodUrl = 'https://testnet-algorand.api.purestake.io/ps2';
	let fetchInterval;
	let account;

	export async function register() {
		try {
			const response = await fetch(`${$apiUrl}/hot_wallet_addresses`, {
				method: 'POST',
				headers: {
					'API-Transaction-Key': $apiKey
				},
				body: JSON.stringify({
					body: { data: { hot_wallet: { address: $publicKey } } }
				})
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	export async function getTransaction() {
		try {
			const response = await fetch(`${$apiUrl}/blockchain_transactions`, {
				method: 'POST',
				headers: {
					'API-Transaction-Key': $apiKey
				},
				body: JSON.stringify({
					body: { data: { transaction: { source: $publicKey, nonce: 1 } } }
				})
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	export async function submitTransaction(transaction) {
		try {
			const response = await fetch(`${$apiUrl}/blockchain_transactions/${transaction.id}`, {
				method: 'PUT',
				headers: {
					'API-Transaction-Key': $apiKey
				},
				body: JSON.stringify({
					body: { data: { transaction: { tx_hash: transaction.hash } } }
				})
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	export async function cancelTransaction(transaction, reason) {
		try {
			const response = await fetch(`${$apiUrl}/blockchain_transactions/${transaction.id}`, {
				method: 'DELETE',
				headers: {
					'API-Transaction-Key': $apiKey
				},
				body: JSON.stringify({
					body: { data: { transaction: { tx_hash: null, status_message: reason } } }
				})
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	export async function processTransaction() {
		const algosdk = (await import('algosdk')).default;
		const algodClient = new algosdk.Algodv2(
			{
				'x-api-key': algodKey
			},
			algodUrl,
			''
		);
		const transaction = await getTransaction();
		let transactionHash;
		let transactionDbId;

		try {
			if (
				(await db.transactions
					.where(['blockchainTransactionbleId', 'status'])
					.equals([transaction.blockchainTransactionbleId, 'complete'])
					.count()) > 0
			) {
				throw `Transaction already processed: ${transaction}`;
			}

			transactionDbId = await db.transactions.add({
				id: transaction.id,
				blockchainTransactionbleId: transaction.blockchainTransactionbleId,
				blockchainTransactionbleType: transaction.blockchainTransactionbleType,
				amount: transaction.amount,
				destination: transaction.destination,
				hash: null,
				status: 'pending'
			});

			let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from: $publicKey,
				to: transaction.destination,
				amount: transaction.amount,
				suggestedParams: await algodClient.getTransactionParams().do()
			});
			let signedTxn = txn.signTxn(account.sk);
			transactionHash = txn.txID().toString();

			db.transactions.update(transactionDbId, {
				hash: transactionHash
			});

			await algodClient.sendRawTransaction(signedTxn).do();
			await algosdk.waitForConfirmation(algodClient, txId, 4);
			db.transactions.update(transactionDbId, {
				status: 'complete'
			});
			submitTransaction(transaction);
		} catch (err) {
			console.error(err);

			if (transactionDbId) {
				db.transactions.update(transactionDbId, {
					status: 'failed',
					statusMessage: err
				});
			}

			if (transactionHash) {
				cancelTransaction(transaction, err);
			}

			window.alert(err);
		}
	}

	export async function connect() {
		account = await getAccount($loginCredential);
		register();
		isConnected.set(true);

		fetchInterval = setInterval(async () => {
			await processTransaction();
		}, fetchPeriod);
	}

	export async function disconnect() {
		account = null;
		clearInterval(fetchInterval);
		isConnected.set(false);
	}

	onDestroy(() => {
		disconnect();
	});
</script>

{#if $isLoggedIn}
	<div class="my-10">
		<h2 class="text-xl font-bold">Settings</h2>
		<input
			type="text"
			class="bg-neutral-200 px-3 py-1 my-1 rounded font-mono w-1/2"
			placeholder="API URL"
			bind:value={$apiUrl}
		/>
		<input
			type="password"
			class="bg-neutral-200 px-3 py-1 my-1 rounded font-mono w-1/2"
			placeholder="API KEY"
			bind:value={$apiKey}
		/>
		<div class="my-1">
			<button
				class="bg-green-200 px-3 py-1 rounded active:bg-neutral-400 disabled:bg-neutral-200 disabled:text-neutral-200 disabled:cursor-not-allowed"
				disabled={$isConnected}
				on:click={connect}
			>
				Start
			</button>
			<button
				class="bg-red-200 px-3 py-1 rounded active:bg-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-200 disabled:cursor-not-allowed"
				disabled={!$isConnected}
				on:click={disconnect}
			>
				Stop
			</button>
		</div>
	</div>
{/if}
