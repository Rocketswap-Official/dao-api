import {
	sendToastMessageSuccess,
	sendToastMessageError,
	closeToast
} from '../../../../lib/utils/connections.utils';
import { wallet_store } from '../../../../lib/store';
import { get } from 'svelte/store';
import { getApprovalBalance } from '../../../../lib/utils/api.utils';

export const handleTxnInfo = async (txInfo: any) => {
	//handle txn results
	const { data } = txInfo;
	const { errors, txBlockResult } = data;
	if (errors) {
		sendToastMessageError('Txn Error', errors[0]);
	} else {
		// const { title, returnResult } = resultInfo;
		if (txBlockResult && Object.keys(txBlockResult).length > 0) {
			const { errors, result, stamps_used } = txBlockResult;
			if (result === 'None') {
				sendToastMessageSuccess('Txn Success', `Success! \nstamps used: ${stamps_used}`);
				// update RSWP approved amount
				await getApprovalBalance(get(wallet_store));
			} else if (errors[0] !== undefined) {
				sendToastMessageError('Txn Error', `${errors[0]}`);
			} else if (result.includes('Error')) {
				sendToastMessageError('Txn Error', `${result} \nstamps used: ${stamps_used}`);
			}
		}
	}
	setTimeout(() => {
		closeToast();
	}, 2000);
};
