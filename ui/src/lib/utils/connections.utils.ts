import WalletController from '../../lib/walletController';
import { connectionRequest, toastWalletMessage, walletError } from '../../config';
import { wallet_store, toast_store } from '../store';
import { getTauBalance, getApprovalBalance } from './api.utils';

export const sendToastMessageError = (title, message) => {
	toast_store.set({
		show: true,
		error: true,
		title: title,
		message: message
	});
};

export const sendToastMessageSuccess = (title, message) => {
	toast_store.set({
		show: true,
		error: false,
		title: title,
		message: message
	});
};

export const closeToast = () => {
	toast_store.set({ show: false });
};

const updateBalances = async (wInfo) => {
	let vk = wInfo.wallets[0];
	await Promise.all([await getTauBalance(vk), await getApprovalBalance(vk)]);
	//store wallet address in store
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
				}, 2000);

				return;
			}
			sendToastMessageError('Wallet Error', err);
		}
		setTimeout(() => {
			closeToast();
		}, 2000);

		return;
	}
	await updateBalances(wInfo);
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
