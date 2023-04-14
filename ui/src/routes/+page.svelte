<script lang="ts">

    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte'
    import { handle_modal_open_voting, handle_modal_open_details } from '../events'
    //import { proposals_store, choice_array_store} from '$lib/store';

    export let data

</script>

<div style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(500px, 1fr)); 
    grid-gap: 20px">
    
    {#if Object.keys(data.proposals).length > 0}
        {#each data.proposals as proposal}
            
            <ProposalCard {proposal}> 
                
                <ChoiceSelectorPieChart choices ={data.choiceArray[proposal.proposal_id - 1]}/>

                <div class="flex row j-end" style="margin-top: 3vw;">
                    <div class="mr-1em">
                        <Button id={proposal.proposal_id}  act = {handle_modal_open_voting} style="">
                            Cast vote
                        </Button>
                    </div>
                    
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


