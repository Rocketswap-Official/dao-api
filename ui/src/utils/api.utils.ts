import axios from "axios"
import { proposals_store, users_store } from "../store";
import type { I_Proposal, I_User } from "../types/imported-types";


const local_hostnames = [
    '0.0.0.0', 'localhost', '127.0.0.1'
]

const isProd = () => !local_hostnames.includes(window.location.hostname)

const base_url = isProd() ? 'api/' : `${constructTestingUrl()}:2001/`

function constructTestingUrl() {
    const url = `${window.location.protocol}//${window.location.hostname}`
    console.log(url)
    return url
}

export async function syncProposals(): Promise<void> {
    try {
        const proposals = (await axios.get(`${base_url}all_proposals`)).data as I_Proposal[]
        proposals_store.set(proposals)
    } catch (err) {
        console.log(err)
    }
}

export async function syncUsers(): Promise<void> {
    try {
        const users = (await axios.get(`${base_url}users`)).data as I_User[]
        users_store.set(users)
    } catch (err) {
        console.log(err)
    }
}