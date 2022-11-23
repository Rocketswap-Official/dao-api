<script>
    import { modal_data_store, proposals_store } from '../../../store'
    import { getProposalDescription } from './content-modal.utils'

    let proposal_id = $modal_data_store.proposal_id
    let description = getProposalDescription($proposals_store, proposal_id)
    

</script>

<div style="margin-top: 2vw; font-size: var(--units-1_14vw);">
    <h2 style="font-weight: 700;">Description</h2>
    {description}
</div>