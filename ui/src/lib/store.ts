import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { I_Proposal, I_User, I_Choice } from './types/imported-types';

export const proposals_store: Writable<I_Proposal[]> = writable([]);
export const users_store: Writable<I_User[]> = writable([]);

// export const wallet_store: Writable<string> = writable(
// 	(browser && sessionStorage.getItem('vk')) || ''
// );
// wallet_store.subscribe((value) => browser && (sessionStorage.vk = value));
export const wallet_store: Writable<string> = writable("")

// export const balances_store: Writable<any> = writable({TAU: 0, RSWP: 0})
export const balances_store: Writable<any> = writable({ TAU: 0 });

export const modal_open_store: Writable<any> = writable(false);
export const modal_data_store: Writable<any> = writable({});
export const modal_index_store: Writable<number> = writable(0);
export const modal_callback: Writable<Function | false> = writable();
//Toast
// export const showToast: Writable<any> = writable(false)
export const toast_store: Writable<any> = writable({ show: false });

//ChoiceArray
export const choice_array_store: Writable<I_Choice[]> = writable([]);

//Lamden Wallet Controller
export const lwc_store: Writable<any> = writable(null);

//RSWP approval
// export const rswp_approval_store: Writable<number> = writable(
// 	(browser && sessionStorage.getItem('rswp')) || 0
// );
// rswp_approval_store.subscribe((value) => browser && (sessionStorage.rswp = value));
export const rswp_approval_store: Writable<number> = writable(0);
