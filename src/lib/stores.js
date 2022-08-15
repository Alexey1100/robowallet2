import { writable } from 'svelte/store';

export const loginCredential = writable(null);
export const walletConnectConnector = writable(null);
export const publicKey = writable(null);
export const balance = writable(null);
export const apiUrl = writable('http://localhost:3000/api/v1/projects/20');
export const apiKey = writable('Fq2tlpI0ELzj18IbXNq25nevNSA4eLFf');
export const apiFetchPeriod = writable(1000);
export const algodUrl = writable('https://testnet-algorand.api.purestake.io/ps2');
export const algodKey = writable('yay5jiXMXr88Bi8nsG1Af9E1X3JfwGOC2F7222r3');
export const isLoggedIn = writable(false);
export const isConnected = writable(false);
