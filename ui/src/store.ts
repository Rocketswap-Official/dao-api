import { writable, type Writable } from "svelte/store";
import type { I_Proposal, I_User } from "./types/imported-types"

export const proposals_store: Writable<I_Proposal[]> = writable([])
export const users_store: Writable<I_User[]> = writable([])
export const wallet_store: Writable<any> = writable(null)
//Toast
export const showToast = writable(false)
export const title = writable('')
export const message = writable('')
export const errorMessage = writable('')