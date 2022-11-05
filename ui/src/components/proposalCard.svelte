<script lang="ts">
    
    import Button from './button/button.svelte';
    import  type { I_Proposal, I_User }  from '../types/imported-types';
    import { handle_modal_open } from '../events'

    export let proposal: I_Proposal;

    const showModal = ()=>{let n; n= true}

    
</script>


<div class="container panel">
    <div class="proposal-title">#{proposal.proposal_id} - {proposal.title}</div>
    <div class="metadata-container">
        <div>Status: <span class="{proposal.state === 'concluded'?'text-secondary':'text-green'}" >{proposal.state}</span></div>
        <div>Voting Ends: {proposal.date_decision.__time__}</div>
    </div>

    <div class="choice-container">

        <slot></slot>    
            
    </div>

    <div class="flex row j-end">
        <div class="mr-1em">
            <Button act = {handle_modal_open} style="">
                Cast vote
            </Button>
        </div>
        
        <Button act = {showModal} style="">
            Details
        </Button>
    </div>
    
    
</div>

<style>
    .container{
        /* width: 60%; */
        padding: 2.5vw;
        box-shadow: var(--panel-box-shadow-higher);
        margin-bottom: 15px;
        color: var(--font-primary-color);
        font-size: var(--units-1_14vw);
        font-weight: 300;
    }
    .proposal-title {
        /* font-size: var(--units-1_14vw); */
        font-weight: 500;

    }
    .metadata-container{
        margin-bottom: 3vw;
        font-size: var(--units-1vw);
    }
    .choice-container{
        margin-bottom: 3vw;
        width: 100%;
        overflow-x: hidden;
        /* margin: 10px 0 10px 0; */
    }
    .text-secondary {
        color: var(--secondary-color)
    }
   
</style>