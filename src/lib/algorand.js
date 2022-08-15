import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export async function getBalance(address, algodClient) {
	const accountInfo = await algodClient.accountInformation(address).do();
	return accountInfo.amount;
}

export async function makePayTxn(from, to, amount, algosdk, algodClient, flatFee = false) {
	const suggestedParams = await algodClient.getTransactionParams().do();

	if (flatFee) {
		const accountInfo = await algodClient.accountInformation(from).do();
		const minimumBalance = accountInfo['min-balance'];
		suggestedParams.fee = algosdk.ALGORAND_MIN_TX_FEE;
		suggestedParams.flatFee = true;
		amount = amount - suggestedParams.fee - minimumBalance;
	}

	return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
		from: from,
		to: to,
		amount: amount,
		suggestedParams: suggestedParams
	});
}

export async function signTxn(txn, account) {
	return txn.signTxn(account.sk);
}

export async function signTxnViaWalletConnect(txn, connector, algosdk) {
	const txns = [txn];
	const txnsToSign = txns.map((txn) => {
		const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64');

		return {
			txn: encodedTxn
		};
	});

	const requestParams = [txnsToSign];
	const request = formatJsonRpcRequest('algo_signTxn', requestParams);
	const result = await connector.sendCustomRequest(request);
	return result.map((element) => {
		return element ? new Uint8Array(Buffer.from(element, 'base64')) : null;
	});
}

export async function submitTxn(signedTxn, algosdk, algodClient) {
	const txResult = await algodClient.sendRawTransaction(signedTxn).do();
	await algosdk.waitForConfirmation(algodClient, txResult.txId, 4);
}
