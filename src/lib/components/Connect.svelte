<script>
	import { apiUrl, apiKey, isLoggedIn, publicKey, isConnected, loginCredential } from '$lib/stores';
	import { getAccount } from '$lib/crypto_storage';
	import { db } from '$lib/db';
	import { onDestroy } from 'svelte';

	const fetchPeriod = 1000;
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
		const transaction = await getTransaction();
		// check if transactable id is already present and paid
		// alert and disconnect if present
		// push to store
		// sign and broadcast with Algorand account
		// if success, update state in store to pending, add tx hash
		// if failure, update state in store to failed, cancel transaction
		// wait for submit
		// if success, update state in store to paid, submit transaction
		// if failure, update state in store to failed, cancel transaction

		// 		{
		//   "id": "40",
		//   "blockchainTransactableId": null,
		//   "blockchainTransactableType": null,
		//   "destination": "0x42D00fC2Efdace4859187DE4865Df9BaA320D5dB",
		//   "source": "0x42D00fC2Efdace4859187DE4865Df9BaA320D5dB",
		//   "amount": 50,
		//   "nonce": 1,
		//   "contractAddress": "0x1D1592c28FFF3d3E71b1d29E31147846026A0a37",
		//   "network": "ethereum_ropsten",
		//   "txHash": null,
		//   "txRaw": "{\"from\":\"0x42D00fC2Efdace4859187DE4865Df9BaA320D5dB\",\"to\":\"0x1D1592c28FFF3d3E71b1d29E31147846026A0a37\",\"value\":\"0x0\",\"contract\":{\"abi\":[{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}],\"method\":\"transfer\",\"parameters\":[\"0x42D00fC2Efdace4859187DE4865Df9BaA320D5dB\",\"50\"]}}",
		//   "status": "created",
		//   "statusMessage": null,
		//   "createdAt": "2021-04-06T10:05:00.000Z",
		//   "updatedAt": "2021-04-06T10:05:00.000Z",
		//   "syncedAt": null,
		//   "blockchainTransactables": [
		//     {
		//       "blockchainTransactableId": 4,
		//       "blockchainTransactableType": "Award",
		//       "id": null
		//     }
		//   ]
		// }
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
