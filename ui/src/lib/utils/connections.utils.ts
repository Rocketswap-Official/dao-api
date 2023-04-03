import WalletController from '$lib/walletController';
import { connectionRequest, toastWalletMessage, walletError } from '../../config';
import { wallet_store, toast_store } from '../store';
import { getTauBalance, getApprovalBalance } from './api.utils';

let response;

const sendToastMessage = (message) => {
	toast_store.set({
		show: true,
		error: true,
		title: 'Wallet error',
		message: 'Connection request not initialised!'
	});
};

const closeToast = ()=>{
	toast_store.set({ show: false });
}

const updateBalances = async (wInfo) => {
	let vk = wInfo.wallets[0];
	await Promise.all([await getTauBalance(vk), await getApprovalBalance(vk)]);
	wallet_store.set(wInfo.wallets[0]);
};

export const handleWalletInfo = async (wInfo) => {
	response = 'got an event!';
	if (wInfo?.errors) {
		for (let err of wInfo.errors) {
			if (err === walletError.authError) {
				return;
			} else if (err === walletError.existError) {
				sendToastMessage(toastWalletMessage.existError);
				setTimeout(() => {
					closeToast();
				}, 2500);

				return;
			}
			sendToastMessage(err);
		}
		setTimeout(() => {
			closeToast();
		}, 2500);

		return;
	}
	await updateBalances(wInfo);
};

export const handleTxnInfo = (txInfo: any) => {
	if (txInfo?.errors) {
		for (let err of txInfo.errors) {
			if (
				err ==
				"You must be an authorized dApp to send this message type. Send 'lamdenWalletConnect' event first to authorize."
			) {
				toast_store.set({
					show: true,
					error: true,
					title: 'Wallet error',
					message: 'Your wallet is not connected'
				});
				return;
			}
			toast_store.set({ show: true, error: true, title: 'Transaction error', message: err });
		}

		return;
	}

	toast_store.set({
		show: true,
		error: txInfo.resultInfo.errorInfo ? true : false,
		title: txInfo.resultInfo.title,
		message:
			txInfo.txBlockResult.result === 'None'
				? txInfo.resultInfo.subtitle
				: txInfo.txBlockResult.result
	});

	console.log(txInfo);
};

export const controllerInstance = () => {
	return new WalletController(connectionRequest);
};

export const isWalletInstalled = (lwc) => {
	if (lwc === null) {
		sendToastMessage(toastWalletMessage.initialseError);
		return;
	}

	lwc.sendConnection(connectionRequest);
	setTimeout(() => {
		if (response === undefined) {
			sendToastMessage(toastWalletMessage.installError);
		}
	}, 1000);
};

export const getCurrentWalletInfo = (lwc) => {
	lwc.getInfo(); // might change
};
