<script lang="ts">

    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import { onMount } from 'svelte';
    import { findVotedProposals } from '$lib/utils/api.utils'
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte'
    //import { handle_modal_open_voting } from '../events'
    import { users_store, proposals_store, choice_array_store, wallet_store} from '$lib/store';
	import { validate_each_keys } from 'svelte/internal';

    const showModal = ()=>{let n; n= true}
    //let vk = $wallet_store;
    let vk = "cccccccccc";

    let n = 0;
    let it = 0;
    const increment = ()=>{
        n = it
        n = n + 1 - 1
        it = it + 1
        return n

    }
    
   
    const votedProposals = findVotedProposals(vk, $users_store)
    
    
</script>

<div style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); 
    grid-gap: 50px">
    
    {#if Object.keys($proposals_store).length > 0}
        
        {#each $proposals_store as proposal}

            {#if votedProposals.includes(proposal.proposal_id)}
           
                <ProposalCard {proposal}> 
                    
                    <ChoiceSelectorPieChart choices ={$choice_array_store[increment()]}/>
                    
                    <div class="flex row j-end" style="margin-top: 3vw;">
                        
                        <Button id={proposal.proposal_id} act = {showModal} style="">
                            Details
                        </Button>
                    </div> 
                    
                </ProposalCard>
            {/if}
        {/each}

    {:else}
            <p style="color: red; font-size: 11px;">No proposals to display</p>
    {/if}
</div>


