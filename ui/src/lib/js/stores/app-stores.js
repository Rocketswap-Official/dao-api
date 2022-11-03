import { writable } from "svelte/store";
//import { writable as ls_writeable   } from 'svelte-local-storage-store'

export const menu_open = writable()
export const modal_open_store = writable(false)
export const modal_data_store = writable({})
export const modal_callback = writable(false)
//export const slippage_percent_store = ls_writeable("slippage percent", 2)