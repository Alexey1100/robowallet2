<script>
    import WalletConnect from '@walletconnect/client';
    import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
    import { getAccount } from '$lib/crypto_storage';
    import {
        publicKey,
        isLoggedIn,
        loginCredential,
        walletConnectConnector,
        balance,
        algodKey,
        algodUrl
    } from '$lib/stores';
    import { getBalance } from '$lib/algorand.js';
    import { onDestroy } from 'svelte';

    async function connect() {
        walletConnectConnector.set(
            new WalletConnect({
                bridge: 'https://bridge.walletconnect.org',
                qrcodeModal: QRCodeModal
            })
        );

        $walletConnectConnector.killSession();
        $walletConnectConnector.createSession();

        $walletConnectConnector.on('connect', (error, _payload) => {
            if (error) {
                throw error;
            }
            login();
        });

        $walletConnectConnector.on('session_update', (error, _payload) => {
            if (error) {
                throw error;
            }
            login();
        });

        $walletConnectConnector.on('disconnect', (error, _payload) => {
            if (error) {
                throw error;
            }
            logout();
        });
    }

    async function login() {
        if ($walletConnectConnector?.accounts[0]) {
            loginCredential.set($walletConnectConnector.accounts[0]);
            const account = await getAccount($loginCredential);
            publicKey.set(account.addr);
            isLoggedIn.set(true);

            const algosdk = (await import('algosdk')).default;
            const algodClient = new algosdk.Algodv2(
                {
                    'x-api-key': $algodKey
                },
                $algodUrl,
                ''
            );
            balance.set(await getBalance($publicKey, algodClient));
        }
    }

    async function logout() {
        $walletConnectConnector?.killSession();
        walletConnectConnector.set(null);
        loginCredential.set(null);
        publicKey.set(false);
        isLoggedIn.set(false);
        balance.set(null);
    }

    onDestroy(() => {
        logout();
    });
</script>

<div class="my-10">
    <h2 class="text-xl font-bold">Remote Wallet</h2>
    {#if $isLoggedIn}
        <div>
            <span>Address: </span>
            <span class="font-mono">{$loginCredential}</span>
        </div>

        <button
            class="bg-neutral-200 px-3 py-1 my-1 rounded active:bg-neutral-400  disabled:cursor-not-allowed disabled:text-neutral-400"
            on:click={logout}
        >
            Disconnect
        </button>
    {:else}
        <div class="my-3">
            To get started, connect a remote wallet via <b>WalletConnect</b>.
            <br />
            Your local wallet will be securely stored and encrypted using <b>WebAuthn</b>.
        </div>

        <button
            class="bg-neutral-200 px-3 py-1 my-1 rounded active:bg-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-400"
            on:click={connect}
        >
            Connect
        </button>
    {/if}
</div>
