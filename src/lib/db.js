import Dexie from 'dexie';
import { publicKey } from '$lib/stores';

export const db = new Dexie(`wallet_${publicKey}`);

db.version(1).stores({
  transactions: '++id, blockchainTransactableId, status'
});
