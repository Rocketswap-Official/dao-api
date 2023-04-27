import {
	sendToastMessageSuccess,
	sendToastMessageError,
	closeToast
} from '../lib/utils/connections.utils';
import { reloadOpenProposalPage } from './+page.svelte';

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
				// reload data when txn is successful
				setTimeout(() => {
					reloadOpenProposalPage();
				}, 1000);
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
