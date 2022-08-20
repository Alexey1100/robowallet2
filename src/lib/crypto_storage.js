import { CryptoStorage } from '@webcrypto/storage';

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

export async function getAccount(address) {
  const algosdk = (await import('algosdk')).default;
  const pass = await webauthn(address, address);
  const cryptoStorage = new CryptoStorage(pass, address);

  const mnemonic = await cryptoStorage.get('mnemonic');

  if (mnemonic) {
    return algosdk.mnemonicToSecretKey(mnemonic);
  } else {
    const account = algosdk.generateAccount();
    await cryptoStorage.set('mnemonic', algosdk.secretKeyToMnemonic(account.sk));

    return account;
  }
}

export async function getMnemonic(address) {
  const pass = await webauthn(address, address);
  const cryptoStorage = new CryptoStorage(pass, address);
  const mnemonic = await cryptoStorage.get('mnemonic');

  return mnemonic;
}
