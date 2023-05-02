<script>
	// Misc
	// import { config } from '../../config'

	// Components
	import GuideItem from './guide-item.svelte'

	// Icons
	import Code from './icons/code.svelte'
	// import Fees from './icons/fees.svelte'
	import PlusCircle from './icons/plus-circle.svelte'

	const guideItems = [
		{
			icon: PlusCircle,
			title: "Creating Tokens",
			link: "https://rocketswap.exchange/docs/#/token"
		},
		{
			icon: Code,
			title: "Developer Resources",
		link: "https://github.com/Rocketswap-Official/lite-dao"
		}
		// {
		// 	icon: Fees,
		// 	title: "Fees & Discounts",
		// 	link: "https://rocketswap.exchange/docs/#/fee_discount"
		// }
	]

</script>

<h2>Guides</h2>
<div class="flex row">
	{#each guideItems as guideItem}
		<GuideItem {guideItem} />
	{/each}
</div>

<style>
    h2{
		font-size: var(--text-size-xlarge);
        margin-bottom: 1rem;
		margin-left: 15px;
    }
	div{
		/* justify-content: space-around; */
        width: 100%;
	}

	@media screen and (min-width: 490px) {
		h2{
			font-size: 1.5em;
			margin-left: 0px;
		}
		/* div{
			justify-content: space-between;
		} */
	}

	@media screen and (min-width: 2560px) {
        h2{
            font-size: 2em;
        }
	}
</style>