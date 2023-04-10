<script lang="ts">
	import ChoiceSelectorPieChart from '$lib/components/choiceSelectorPieChart.svelte';
	import ProposalCard from '$lib/components/proposalCard.svelte';
	import Button from '$lib/components/button/button.svelte';
	import { handle_modal_open_details } from '../../events';
	import { users_store, wallet_store } from '$lib/store';

    export let data;

	let votedProposals: number[] = [];

	for (let u of $users_store) {
		if (u?.vk === $wallet_store) {
			for (let id of u.proposals) {
				votedProposals.push(parseInt(id));
			}
		}
	}
</script>

<div
	style="display: grid; 
    grid-template-columns:repeat(auto-fit, minmax(500px, 1fr)); 
    grid-gap: 20px"
>
	{#if Object.keys(data.proposals).length > 0}
		{#each data.proposals as proposal}
			{#if votedProposals.includes(proposal.proposal_id)}
				<ProposalCard {proposal}>
					<ChoiceSelectorPieChart choices={data.choiceArray[proposal.proposal_id - 1]} />

					<div class="flex row j-end" style="margin-top: 3vw;">
						<Button id={proposal.proposal_id} act={handle_modal_open_details} style="">
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
