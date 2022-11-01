import VotingModal from './content/voting-modal.svelte'
import { modal_data_store, modal_open_store, proposals_store } from '../../store'
import type { I_Proposal } from '../../types/imported-types'

export function show_vote_modal(proposal: I_Proposal) {
    modal_data_store.set({ proposal })
    modal_open_store.set(VotingModal)
}
