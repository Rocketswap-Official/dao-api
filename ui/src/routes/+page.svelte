<script lang="ts">

    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte'
    import type { I_Proposal, Tuple7 } from '../lib/types/imported-types'
    import { handle_modal_open_voting, handle_modal_open_details } from '../events'
    import { countTxnInfo } from '../config';
    import { handleTxnInfo } from '$lib/utils/connections.utils';
    import { lwc_store, toast_store} from '$lib/store';

    export let data

    const spitDateObj = (proposalArray: I_Proposal): Date => {
        const dateArray: Tuple7<number> = proposalArray.date_decision.__time__
        return new Date(...dateArray)
    }

    const getCurrentTime = (): Date => {
        return new Date()
    }

    const submitCountTxn = (proposal_id: number)=>{
        countTxnInfo.kwargs.proposal_idx = proposal_id
        toast_store.set({show: true, title:"Transacton State", pending:true, message:"Pending"})
        $lwc_store.sendTransaction(countTxnInfo, handleTxnInfo)
    }

</script>

<div style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(500px, 1fr)); 
    grid-gap: 20px">
    
    {#if Object.keys(data.proposals).length > 0}
        {#each data.proposals as proposal}
            
            <ProposalCard {proposal}  endDate = {spitDateObj(proposal)}> 
                
                <ChoiceSelectorPieChart choices ={data.choiceArray[proposal.proposal_id - 1]}/>

                <div class="flex row j-end" style="margin-top: 3vw;">

                    {#if getCurrentTime() > spitDateObj(proposal)}
                        <div class="mr-1em">
                            <Button id={proposal.proposal_id}  act = {()=>submitCountTxn(proposal.proposal_id)} style="">
                               Count
                            </Button>
                        </div>
                    {:else}
                        <div class="mr-1em">
                            <Button id={proposal.proposal_id}  act = {handle_modal_open_voting} style="">
                            Vote
                            </Button>
                        </div>
                    {/if}
                    
                    <Button id={proposal.proposal_id} act = {handle_modal_open_details} style="">
                        Details
                        
                    </Button>
                </div>
                
            </ProposalCard>
            
        {/each}

    {:else}
            <p style="color: red; font-size: 11px;">No open proposals at the moment</p>
    {/if}
</div>


