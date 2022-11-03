import { user_wallet } from '$lib/js/stores/user-stores'

// MOCK DATA
import mock_wallet from '$lib/mock_data/mock_wallet.json'

export function connect_wallet(){
    user_wallet.set(mock_wallet)
}

export function disconnect_wallet(){
    user_wallet.set(false)
}