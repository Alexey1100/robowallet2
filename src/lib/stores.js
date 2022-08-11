import { writable } from 'svelte/store';

export const publicKey = writable('');
export const balance = writable('0.1 ALGO');
export const apiUrl = writable('');
export const apiKey = writable('');
export const transactionHistory = writable([]);
export const isLoggedIn = writable(true);
export const isConnected = writable(true);
