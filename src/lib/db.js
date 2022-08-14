import Dexie from 'dexie';

export const db = new Dexie('walletDatatbase');

db.version(1).stores({
	transactions: '++id, blockchainTransactableId, status'
});
