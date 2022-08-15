import { writable } from 'svelte/store';

export const loginCredential = writable('0x');
export const publicKey = writable('');
export const balance = writable('0.1 ALGO');
export const apiUrl = writable('http://localhost:3000/api/v1/projects/20');
export const apiKey = writable('Fq2tlpI0ELzj18IbXNq25nevNSA4eLFf');
export const isLoggedIn = writable(false);
export const isConnected = writable(false);
