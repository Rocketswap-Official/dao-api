<script context="module" >
    export const reloadCountedProposalPage = () => { 
        window.location.reload(true) //should work with firefox and any browser
     }
</script>

<script lang="ts">
    import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
    import ProposalCard from '$lib/components/proposalCard.svelte';
    import Button from '$lib/components/button/button.svelte';
    import type { I_Proposal, Tuple7 } from '../../lib/types/imported-types';
    import { handle_modal_open_voting, handle_modal_open_details } from '../../events';
    import { verifyTxnInfo } from '../../config';
    import { handleTxnInfo } from '../../routes/counted_proposals/txnFunc.Counted';
    import { lwc_store, toast_store} from '$lib/store';
    import { isAnyProposalCounted } from '../../lib/utils/api.utils';
    import Legend from '../../lib/components/legend.svelte'

    export let data

    const getComputedDate = (proposalArray: I_Proposal): Date => {
        let dateArray: Tuple7<number> = proposalArray.date_decision.__time__
        //decrement month to display correctly
        dateArray[1] -= 1 
        const utcDate = new Date(Date.UTC(...dateArray))
        return utcDate
    }

    const submitVerifyTxn = (proposal_id: number)=>{
        verifyTxnInfo.kwargs.proposal_idx = proposal_id
        toast_store.set({show: true, title:"Transacton State", pending:true, message:"Pending"})
        $lwc_store.sendTransaction(verifyTxnInfo, handleTxnInfo)
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
        
        {#if Object.keys(data.proposals).length > 0 && isAnyProposalCounted(data.proposals)}
            {#each data.proposals as proposal}
                
                <ProposalCard {proposal}  endDate = {getComputedDate(proposal)}> 
                    
                    <ChoiceSelectorPieChart choices ={data.choiceArray[proposal.proposal_id - 1]}/>

                    <div class="flex row j-end" style="margin-top: 3vw;">
                        <div class="mr-1em">
                            <Button id={proposal.proposal_id}  act = {()=>submitVerifyTxn(proposal.proposal_id)} style="">
                                Verify
                            </Button>
                        </div>
                        
                        <Button id={proposal.proposal_id} act = {handle_modal_open_details} style="">
                            Details
                            
                        </Button>
                    </div>
                    
                </ProposalCard>
                
            {/each}

        {:else}
                <p style="color: red; font-size: 11px;">No counted proposals at the moment</p>
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
