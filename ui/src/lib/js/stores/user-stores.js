import { writable, derived } from 'svelte/store'

import mock_balances from '$lib/mock_data/mock_user_balances.json'
import mock_vip from '$lib/mock_data/user_vip.json'

export const user_balances = writable(mock_balances)

export const tau_balance = derived(user_balances, ($user_balances) => {
    const { currency } = mock_balances
    return currency || "0"
})

export const user_wallet = writable(false)

export const wallet_vk = derived(user_wallet, ($user_wallet) => {
    if ($user_wallet) return $user_wallet.vk
    else return ""
})

export const wallet_connected = derived(user_wallet, ($user_wallet) => {
    if ($user_wallet) return true
    else return false
})

export const vip = writable(mock_vip)
export const exchange_tokens_staked = derived(vip, ($vip) => {
    const { exchange_tokens_staked } = $vip
    return exchange_tokens_staked
})