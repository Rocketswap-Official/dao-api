<script lang="ts">

    import ChoiceSelectorPieChart from '../components/choiceSelectorPieChart.svelte';
    import ProposalCard from '../components/proposalCard.svelte';
    import { proposals_store, choice_array_store } from '../store';

    let n = 0;
    let it = 0;
    const increment = ()=>{
        it = it + 1
        if(it>1) n = n + 1
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
                
            </ProposalCard>
            
        {/each}

    {:else}
            <p style="color: red; font-size: 11px;">No proposals to display</p>
    {/if}
</div>


