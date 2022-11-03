import { get } from 'svelte/store'
import { modal_open_store, modal_data_store, modal_callback } from '$lib/js/stores/app-stores'
import { goto } from '$app/navigation'

// Components
//import SetSlippage from '$lib/modals/SetSlippage.svelte'
//import VerifiedTokens from '$lib/modals/info/VerifiedTokens.svelte';
//import ConfirmStakeAdd from '$lib/modals/confirms/ConfirmStakeAdd.svelte'
//import ConfirmStakeRemove from '$lib/modals/confirms/ConfirmStakeRemove.svelte'
//import ConfirmStakeWithdraw from '$lib/modals/confirms/ConfirmStakeWithdraw.svelte'
//import ConfirmFuelAdd from '$lib/modals/confirms/ConfirmFuelAdd.svelte'
//import ConfirmFuelRemove from '$lib/modals/confirms/ConfirmFuelRemove.svelte'
import ConnectMain from '$lib/modals/wallet_connect/ConnectMain.svelte'

export function handle_modal_open(args){
    const {modal, modal_data = {}, callback = false} = args

    modal_open_store.set(modal)
    modal_data_store.set(modal_data)
    modal_callback.set(callback)
}

export function handle_modal_close(){
    modal_open_store.set(false)
    modal_data_store.set({})
    modal_callback.set(false)
}

export function handle_modal_callback(){
    const callback = get(modal_callback)
    callback()
    modal_open_store.set(false)
}

// export function handle_show_verified_token_info(){
//     handle_modal_open({modal: VerifiedTokens})
// }


export function handle_goto_rswp_buy(){
    goto('/swap/con_rswp_lst001')
}

// export function handle_open_confirm_stake_add(fuel_amount){
//     handle_modal_open({
//         modal: ConfirmStakeAdd,
//         modal_data: {
//             fuel_amount
//         },
//         callback: () => console.log("staking add confirm callback")
//     })

// }

// export function handle_open_confirm_stake_remove(farm_info){
//     handle_modal_open({
//         modal: ConfirmStakeRemove,
//         modal_data: {
//             farm_info
//         },
//         callback: () => console.log("staking removce confirm callback")
//     })
// }

// export function handle_open_confirm_stake_withdraw(farm_info){
//     handle_modal_open({
//         modal: ConfirmStakeWithdraw,
//         modal_data: {
//             farm_info
//         },
//         callback: () => console.log("staking withdraw confirm callback")
//     })
// }

// export function handle_open_confirm_fuel_add(fuel_amount){
//     handle_modal_open({
//         modal: ConfirmFuelAdd,
//         modal_data: {
//             fuel_amount
//         },
//         callback: () => console.log("fuel add confirm callback")
//     })
// }

// export function handle_open_confirm_fuel_remove(fuel_amount){
//     handle_modal_open({
//         modal: ConfirmFuelRemove,
//         modal_data: {
//             fuel_amount
//         },
//         callback: () => console.log("fuel add confirm callback")
//     })
// }

export function open_connect_main(){
    handle_modal_open({
        modal: ConnectMain
    })
}