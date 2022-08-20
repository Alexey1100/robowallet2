import Dexie from 'dexie';
import { publicKey } from '$lib/stores';

export const db = new Dexie(`wallet_${publicKey.value}`);

db.version(2).stores({
	transactions: '++id'
});
