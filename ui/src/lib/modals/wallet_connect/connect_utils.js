// Components
import LamdenWallet_1 from '$lib/modals/wallet_connect/LamdenWallet_1.svelte'
import Keystore_1 from '$lib/modals/wallet_connect/Keystore_1.svelte'
import ConnectMain from '$lib/modals/wallet_connect/ConnectMain.svelte'

// Stores
import { modal_open_store } from '$lib/js/stores/app-stores'

export function show_lamden_wallet_1(){
    modal_open_store.set(LamdenWallet_1)
}

export function show_connect_main(){
    modal_open_store.set(ConnectMain)
}

export function show_keystore_1(){
    modal_open_store.set(Keystore_1)
}