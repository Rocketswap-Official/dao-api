<script lang="ts">
    import ProposalCard from '../components/proposalCard.svelte';
    import Modal from '../components/modal/modal.svelte';
	import { onMount } from 'svelte';
	import { show_vote_modal } from '../components/modal/modal-utils';
	import type { I_Proposal } from '../types/imported-types';

    //import { proposals_store, users_store } from '../store';
    //mock data
    const proposals = [{
        "proposal_id": 1,
        "title":'some proposal', 
		"description": 'this is enginneered', 
		"date_decision": {__time__:"29/10/2021"}, 
	 	"choices": ['This is the first proposal', 'No', "I'm undecided"],
	 	"state": "open",
        "ballot_count": 1,
        "lp_weight": 123,
        "results": {},
        "counted": "false",
        "verified": "false"
    },
    {
        "proposal_id": 2,
        "title":'some proposal', 
		"description": 'this is enginneered', 
		"date_decision": {__time__: "29/10/2021"}, 
	 	"choices": ['yeah its me', 'nope not me', 'we shall see'],
	 	"state": "concluded",
         "ballot_count": 1,
        "lp_weight": 102,
        "results": {"0": 123, "1": 321,"2":222},
        "counted": "tru",
        "verified": "true"
    }];

    const user = [{
        "vk": 'cccccccccc',
        "ballot_idx": [1],
        "choice_idx": [0,2],
        "weight": [],
        "proposals": [1,2],
        "rswp_balance": 1000,
        "rocket_fuel": 2000,
        "staked_rswp": 50000,
        "staked_lp_value": [2000, 3000],
        "lp_value": [3000, 4000]
    },
    {
        "vk": 'bbbbbbbbbb',
        "ballot_idx": [1],
        "choice_idx": [2,0],
        "weight": [],
        "proposals": [1,2],
        "rswp_balance": 1000,
        "rocket_fuel": 2020,
        "staked_rswp": 50500,
        "staked_lp_value": [2020, 3300],
        "lp_value": [3300, 4040]
    }]
    
    //const proposals = [];
</script>

<div style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); 
    grid-gap: 50px">
    <!--div>
        use $proposals_store here
        use $users_store here
    </div-->
    {#if Object.keys(proposals).length > 0}
        {#each proposals as proposal}
            
            <ProposalCard {proposal} {user}/> 
            {/each}
            {:else}
            <p style="color: red; font-size: 11px;">No proposals to display</p>
            {/if}
</div>
<Modal/>
