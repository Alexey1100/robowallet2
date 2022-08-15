export async function getBalance(address, algodClient) {
	return await algodClient.accountInformation(address).do().amount;
}

export async function makePayTxn(from, to, amount, algosdk, algodClient) {
	return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
		from: from,
		to: to,
		amount: amount,
		suggestedParams: await algodClient.getTransactionParams().do()
	});
}

export async function signTxn(txn, account) {
	return txn.signTxn(account.sk);
}

export async function submitTxn(signedTxn, algosdk, algodClient) {
	await algodClient.sendRawTransaction(signedTxn).do();
	await algosdk.waitForConfirmation(algodClient, txId, 4);
}
