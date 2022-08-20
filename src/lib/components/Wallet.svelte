<script>
    import {
        publicKey,
        balance,
        isLoggedIn,
        loginCredential,
        algodUrl,
        algodKey,
        walletConnectConnector
    } from '$lib/stores';
    import {
        getBalance,
        makePayTxn,
        signTxn,
        submitTxn,
        signTxnViaWalletConnect
    } from '$lib/algorand.js';
    import { getMnemonic, getAccount } from '$lib/crypto_storage';
    import { fade } from 'svelte/transition';

    let topUpAmount;

    async function exportMnemonic() {
        const mnemonic = await getMnemonic($loginCredential);

        window.alert(mnemonic);
    }

    async function topUp() {
        const algosdk = (await import('algosdk')).default;
        const algodClient = new algosdk.Algodv2(
            {
                'x-api-key': $algodKey
            },
            $algodUrl,
            ''
        );

        try {
            let txn = await makePayTxn($loginCredential, $publicKey, topUpAmount, algosdk, algodClient);
            let signedTxn = await signTxnViaWalletConnect(txn, $walletConnectConnector, algosdk);
            await submitTxn(signedTxn, algosdk, algodClient);
            balance.set(await getBalance($publicKey, algodClient));
        } catch (err) {
            console.error(err);
            window.alert(err);
        }
    }

    async function withdraw() {
        const account = await getAccount($loginCredential);
        const algosdk = (await import('algosdk')).default;
        const algodClient = new algosdk.Algodv2(
            {
                'x-api-key': $algodKey
            },
            $algodUrl,
            ''
        );

        try {
            let txn = await makePayTxn(
                $publicKey,
                $loginCredential,
                $balance,
                algosdk,
                algodClient,
                true
            );
            let signedTxn = await signTxn(txn, account);
            await submitTxn(signedTxn, algosdk, algodClient);
            balance.set(await getBalance($publicKey, algodClient));
        } catch (err) {
            console.error(err);
            window.alert(err);
        }
    }
</script>

{#if $isLoggedIn}
    <div class="my-10">
        <h2 class="text-xl font-bold">Local Wallet</h2>

        <div>
            <span in:fade={{ duration: 250 }}>Address: </span>
            <span class="font-mono">{$publicKey}</span>
        </div>

        <div>
            <span>Balance: </span>
            <span class="font-mono" in:fade={{ duration: 250 }}>{$balance}</span>
            <span class="" in:fade={{ duration: 250 }}>μALGO</span>
        </div>

        <div class="my-1">
            <input
                type="number"
                class="bg-neutral-200 px-3 py-1 my-1 rounded font-mono"
                placeholder="Amount"
                bind:value={topUpAmount}
            />

            <button
                class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-200 disabled:cursor-not-allowed"
                on:click={topUp}
                disabled={!topUpAmount}
            >
                Top Up
            </button>

            <button class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400" on:click={withdraw}>
                Withdraw
            </button>

            <button
                class="bg-neutral-200 px-3 py-1 rounded active:bg-neutral-400"
                on:click={exportMnemonic}
            >
                🔒 Export
            </button>
        </div>
    </div>
{/if}
