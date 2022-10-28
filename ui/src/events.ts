import { modal_open_store,modal_callback, modal_data_store  } from "./store"

export function handle_modal_close() {
    modal_open_store.set(false)
    modal_data_store.set({})
    modal_callback.set(false)
}