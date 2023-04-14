import WalletController from '../../lib/walletController';
import { connectionRequest, toastWalletMessage, walletError } from '../../config';
import { wallet_store, toast_store } from '../store';
import { getTauBalance, getApprovalBalance } from './api.utils';

const sendToastMessageError = (title, message) => {
	toast_store.set({
		show: true,
		error: true,
		title: title,
		message: message
	});
};

const sendToastMessageSuccess = (title, message) => {
	toast_store.set({
		show: true,
		error: false,
		title: title,
		message: message
	});
};

const closeToast = () => {
	toast_store.set({ show: false });
};

const updateBalances = async (wInfo) => {
	let vk = wInfo.wallets[0];
	await Promise.all([await getTauBalance(vk), await getApprovalBalance(vk)]);
	wallet_store.set(wInfo.wallets[0]);
};

let response;

export const handleWalletInfo = async (wInfo) => {
	response = 'got an event!';
	if (wInfo?.errors) {
		for (let err of wInfo.errors) {
			if (err === walletError.authError) {
				// put setTimeout here too?
				return;
			} else if (err === walletError.existError) {
				sendToastMessageError('Wallet Error', toastWalletMessage.existError);
				setTimeout(() => {
					closeToast();
				}, 2500);

				return;
			}
			sendToastMessageError('Wallet Error', err);
		}
		setTimeout(() => {
			closeToast();
		}, 2500);

		return;
	}
	await updateBalances(wInfo);
};

export const handleTxnInfo = (txInfo: any) => {
	//handle txn results
	const { data } = txInfo;
	const { errors, txBlockResult } = data;
	if (errors) {
		sendToastMessageError('Txn Error', errors[0]);
	} else {
		// const { title, returnResult } = resultInfo;
		if (txBlockResult && Object.keys(txBlockResult).length > 0) {
			const { result, stamps_used } = txBlockResult;
			if (result === 'None') {
				sendToastMessageSuccess('Txn Success', `Success! \nstamps used: ${stamps_used}`);
			} else if (result.includes('Error')) {
				sendToastMessageError('Txn Error', `${result} \nstamps used: ${stamps_used}`);
			}
		}
	}
	setTimeout(() => {
		closeToast();
	}, 4000);
};

export const controllerInstance = () => {
	return new WalletController(connectionRequest);
};

export const isWalletInstalled = (lwc) => {
	if (lwc === null) {
		sendToastMessageError('Wallet Error', toastWalletMessage.initialiseError);
		return;
	}

	lwc.sendConnection(connectionRequest);
	setTimeout(() => {
		if (response === undefined) {
			sendToastMessageError('Wallet Error', toastWalletMessage.installError);
		}
	}, 1000);
};
