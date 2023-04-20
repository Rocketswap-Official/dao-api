<script lang="ts">
    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte'
    import type { I_Proposal, Tuple7 } from '../../lib/types/imported-types'
    import { handle_modal_open_details } from '../../events'
    //import { proposals_store, choice_array_store} from '$lib/store';
    import Legend from '../../lib/components/legend.svelte'

    export let data

    const getComputedDate = (proposalArray: I_Proposal): Date => {
        let dateArray: Tuple7<number> = proposalArray.date_decision.__time__
        //decrement month to display correctly
        dateArray[1] -= 1 
        const utcDate = new Date(Date.UTC(...dateArray))
        return utcDate
    }
  
</script>

<div class="flex j-end">
    <Legend/>
</div>

{#if data === undefined}
    <div class="loader">
        <img style="width: 55px" src="Rolling-1s-200px.gif" alt="spinner"/>
    </div>

{:else}

    <div style="display: grid; 
        grid-template-columns:repeat(auto-fit, minmax(500px, 1fr)); 
        grid-gap: 20px">
        
        {#if Object.keys(data.proposals).length > 0}
            {#each data.proposals as proposal}
                
                <ProposalCard {proposal} endDate = {getComputedDate(proposal)}> 
                    
                    <ChoiceSelectorPieChart choices ={data.choiceArray[proposal.proposal_id - 1]}/>

                    <div class="flex row j-end" style="margin-top: 3vw;">
                        <Button id={proposal.proposal_id} act = {handle_modal_open_details} style="">
                            Details
                        </Button>
                    </div>
                    
                </ProposalCard>
                
            {/each}

        {:else}
                <p style="color: red; font-size: 11px;">No concluded proposals at the moment</p>
        {/if}
    </div>

{/if}

<style>
    .loader{
        position: fixed;
        height: 100%;
        width: 100%;
    }
    img{
        position: relative;
        left: 40%;
        top: 40%;
    }
</style>
