import { modal_open_store, modal_index_store, modal_callback, modal_data_store  } from "./lib/store"

export function handle_modal_close() {
    modal_open_store.set(false)
    //modal_data_store.set({})
    modal_callback.set(false)
}
export function handle_modal_open_voting() {
    modal_open_store.set(true)
    modal_index_store.set(1)
    //modal_data_store.set({})
    modal_callback.set(false)
}
export function handle_modal_open_details() {
    modal_open_store.set(true)
    modal_index_store.set(2)
    //modal_data_store.set({})
    modal_callback.set(false)
}
// export function handle_modal_open_voting() {
//     modal_open_store.set(true)
//     modal_index_store.set(1)
//     modal_data_store.set({})
//     modal_callback.set(false)
// }