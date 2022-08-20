<script>
	import {
		apiUrl,
		apiKey,
		apiFetchPeriod,
		isLoggedIn,
		publicKey,
		isConnected,
		loginCredential,
		balance,
		algodKey,
		algodUrl
	} from '$lib/stores';
	import { makePayTxn, signTxn, submitTxn, getBalance } from '$lib/algorand.js';
	import { getAccount } from '$lib/crypto_storage';
	import { db } from '$lib/db';
	import { onDestroy } from 'svelte';

  let fetchInterval;
  let account;

  export async function register() {
    const response = await fetch(`${$apiUrl}/hot_wallet_addresses`, {
      method: 'POST',
      headers: {
        'API-Transaction-Key': $apiKey,
				'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: { data: { hot_wallet: { address: $publicKey } } }
      })
    });
    return await response.json();
  }

  export async function getTransaction() {
    const response = await fetch(`${$apiUrl}/blockchain_transactions`, {
      method: 'POST',
      headers: {
        'API-Transaction-Key': $apiKey,
				'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: { data: { transaction: { source: $publicKey, nonce: 1 } } }
      })
    });
    return await response.json();
  }

  export async function submitTransaction(transaction) {
    const response = await fetch(`${$apiUrl}/blockchain_transactions/${transaction.id}`, {
      method: 'PUT',
      headers: {
        'API-Transaction-Key': $apiKey,
				'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: { data: { transaction: { tx_hash: transaction.hash } } }
      })
    });
    return await response.json();
  }

  export async function cancelTransaction(transaction, reason) {
    const response = await fetch(`${$apiUrl}/blockchain_transactions/${transaction.id}`, {
      method: 'DELETE',
      headers: {
        'API-Transaction-Key': $apiKey,
				'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: { data: { transaction: { tx_hash: null, status_message: reason, failed: true } } }
      })
    });
    return await response.json();
  }

  export async function processTransaction() {
    const algosdk = (await import('algosdk')).default;
    const algodClient = new algosdk.Algodv2(
      {
        'x-api-key': $algodKey
      },
      $algodUrl,
      ''
    );
    const transaction = await getTransaction();
    let transactionHash;
    let transactionDbId;

    balance.set(await getBalance($publicKey, algodClient));

    try {
      if (
        (await db.transactions
          .where(['blockchainTransactableId', 'status'])
          .equals([transaction.blockchainTransactables[0].blockchainTransactableId, 'complete'])
          .count()) > 0
      ) {
        throw `Transaction already processed: ${JSON.stringify(transaction)}`;
      }

      transactionDbId = await db.transactions.add({
        remoteId: transaction.id,
        blockchainTransactableId: transaction.blockchainTransactables[0].blockchainTransactableId,
        blockchainTransactableType:
					transaction.blockchainTransactables[0].blockchainTransactableType,
        amount: transaction.amount,
        destination: transaction.destination,
        hash: null,
        status: 'pending'
      });

      let txn = await makePayTxn(
        $publicKey,
        transaction.destination,
        transaction.amount,
        algosdk,
        algodClient
      );
      let signedTxn = await signTxn(txn, account);
      transactionHash = txn.txID().toString();

      await db.transactions.update(transactionDbId, {
        hash: transactionHash
      });

      await submitTxn(signedTxn, algosdk, algodClient);
      await db.transactions.update(transactionDbId, {
        status: 'complete'
      });
      await submitTransaction(transaction);
    } catch (err) {
      console.error(err);

			if (transaction) {
				await cancelTransaction(transaction, err);
			}

      if (transactionDbId) {
        await db.transactions.update(transactionDbId, {
          status: 'failed',
          statusMessage: err
        });
      }

			window.alert(err);
		}

    balance.set(await getBalance($publicKey, algodClient));
  }

  export async function connect() {
    account = await getAccount($loginCredential);
    register();
    isConnected.set(true);

    fetchInterval = setInterval(async () => {
      await processTransaction();
    }, $apiFetchPeriod);
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
				class="bg-green-200 px-3 py-1 inline-flex items-center rounded active:bg-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-200 disabled:cursor-not-allowed"
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
