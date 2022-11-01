import { writable, type Writable } from "svelte/store";
import type { I_Proposal, I_User } from "./types/imported-types"

export const proposals_store: Writable<I_Proposal[]> = writable([])
export const users_store: Writable<I_User[]> = writable([])
export const wallet_store: Writable<any> = writable(null)

export const modal_open_store: Writable<any> = writable(false)
export const modal_data_store: Writable<any> = writable({})
export const modal_callback: Writable<Function | false> = writable()
//Toast
export const showToast = writable(false)
export const title = writable('')
export const message = writable('')
export const errorMessage = writable('')