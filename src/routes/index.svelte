<script>
	import { CryptoStorage } from '@webcrypto/storage';

	let address;
	let privateKey;
	let cryptoStorage;

	async function login() {
		const pass = await webauthn(address, address);
		cryptoStorage = new CryptoStorage(pass, address);

		privateKey = await cryptoStorage.get('privateKey');
	}

	async function save() {
		await cryptoStorage.set('privateKey', privateKey);
	}

	async function webauthn(user, challenge) {
		const encoder = new TextEncoder();
		const publicKey = {
			challenge: encoder.encode(challenge),
			user: {
				id: encoder.encode(user),
				name: user,
				displayName: user
			},
			pubKeyCredParams: [
				{
					type: 'public-key',
					alg: -7
				}
			],
			rp: {
				name: document.title,
				id: location.hostname
			}
		};

		const credential = await navigator.credentials.create({ publicKey });
		const decoder = new TextDecoder();
		const decodedClientData = decoder.decode(credential.response.clientDataJSON);
		const clientDataObj = JSON.parse(decodedClientData);
		return clientDataObj.challenge;
	}
</script>

<h1 class="text-3xl font-bold">Welcome to Robowallet</h1>

<input type="text" class="border-violet-500 bg-neutral-200 " bind:value={address} />
<input type="text" class="border-violet-500 bg-neutral-200 " bind:value={privateKey} />

<p class="my-5">
	<button class="bg-neutral-200 px-2 py-1 rounded active:bg-neutral-400" on:click={login}>
		Sign-In
	</button>

	<button class="bg-neutral-200 px-2 py-1 rounded active:bg-neutral-400" on:click={save}>
		Save
	</button>
</p>
