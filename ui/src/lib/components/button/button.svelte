<script lang="ts">
	import { onMount } from 'svelte';
	import { modal_data_store } from '../../store'
	export let bid: any;
	export let act: any;
	export let style: T_ButtonStyle = ""; // primary / secondary

	(()=>{
		modal_data_store.set(bid - 1)
	})()
	
	

	type T_ButtonStyle = "primary" | "secondary" | ""
	type T_ButtonIcon = "arrow-right" | "";
</script>

<div>
	<button on:click={act} class="connect outlined white {style}">
		<div>
			<slot />
		</div>
	</button>
</div>

<style>
	button {
		margin-top: var(--units-1vw);
	}

	button.icon {
		margin: 0 auto;
		padding: var(--units-1vw) var(--units-1_4vw);
		border-radius: 100%;
	}
	button.icon:hover {
		background-color: var(--panel-background-highlight);
	}
	button {
		/* width: 50%; */
		margin: var(--units-1vw) auto 0;
	}
	button > div {
		padding: var(--units-02vw) var(--units-1_14vw);
		/* padding-right: var(--units-1_14vw); */
	}
	
	@media (max-width: 480px) {
	}
</style>
