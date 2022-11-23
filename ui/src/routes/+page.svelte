<script lang="ts">

    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte'
    import { handle_modal_open_voting, handle_modal_open_details } from '../events'
    import { proposals_store, choice_array_store} from '$lib/store';


    let n = 0;
    let it = 0;
    const increment = ()=>{
        n = it
        n = n + 1 - 1
        it = it + 1
        return n

    }

    

    
</script>

<div style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); 
    grid-gap: 50px">
    
    {#if Object.keys($proposals_store).length > 0}
        
        {#each $proposals_store as proposal}
           
            <ProposalCard {proposal}> 
                
                <ChoiceSelectorPieChart choices ={$choice_array_store[increment()]}/>

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
            <p style="color: red; font-size: 11px;">No proposals to display</p>
    {/if}
</div>


