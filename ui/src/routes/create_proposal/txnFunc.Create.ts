import {
	sendToastMessageSuccess,
	sendToastMessageError,
	closeToast
} from '../../lib/utils/connections.utils';
import { explorer } from '../../config';

export const handleTxnInfo = async (txInfo: any) => {
	//handle txn results
	const { data } = txInfo;
	const { errors, txBlockResult } = data;
	if (errors) {
		sendToastMessageError('Txn Error', errors[0], '');
	} else {
		// const { title, returnResult } = resultInfo;
		if (txBlockResult && Object.keys(txBlockResult).length > 0) {
			const { hash, errors, result, stamps_used } = txBlockResult;
			if (result === 'None') {
				sendToastMessageSuccess(
					'Txn Success',
					`Success! Stamps used: ${stamps_used}`,
					`${explorer}/${hash}`
				);
			} else if (errors[0] !== undefined) {
				sendToastMessageError('Txn Error', `${errors[0]}`, '');
			} else if (result.includes('Error')) {
				sendToastMessageError(
					'Txn Error',
					`${result} Stamps used: ${stamps_used}`,
					`${explorer}/${hash}`
				);
			}
		}
	}
	setTimeout(() => {
		closeToast();
	}, 3000);
};
