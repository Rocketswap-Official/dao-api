import { get } from 'svelte/store'
import { menu_open } from '$lib/js/stores/app-stores'

export const toggle_menu = () => {
    const open = get(menu_open)
    if (open){
        menu_open.set(false)
    }else{
        menu_open.set(true)
    }
}

export const close_menu = () => {
    menu_open.set(false)
}