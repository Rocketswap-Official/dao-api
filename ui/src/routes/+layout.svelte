<script lang="ts">
	import '$lib/css/app.css';
	import '$lib/css/flex.css';
	import '$lib/css/layout.css';
	import '$lib/css/styled-defaults.css';
	import { lwc_store, toast_store } from '$lib/store';
	import { onMount } from 'svelte';
	import Toast from '$lib/components/toast.svelte';
	import Header from '$lib/components/header/header.svelte';
	import LeftMenu from '$lib/components/leftMenu/leftMenu.svelte';
	import Modal from '$lib/components/modal/modal.svelte';
	import {
		controllerInstance,
		handleWalletInfo,
		// handleTxnInfo,
		getCurrentWalletInfo,
		isWalletInstalled
	} from '$lib/utils/connections.utils';

	onMount(() => {
		const lwc = controllerInstance();
		getCurrentWalletInfo(lwc);
		lwc_store.set(lwc);
		lwc.events.on('newInfo', handleWalletInfo);
	});

	//$lwc_store?.events.on('txStatus', handleTxnInfo);

	// Components

	// import Header from '$lib/header/Header.svelte';
	// import LeftMenu from '$lib/left-menu/LeftMenu.svelte';
	// import MobileMenu from '$lib/mobile-menu/MobileMenu.svelte';
	// import Modal from '$lib/modals/Modal.svelte';

	// Stores

	// import { wallet_connected } from '$lib/js/stores/user-stores';

	//
	// let wallet_connected = true
	// onMount(async ()=>await syncProposals())
</script>

<Header />
<LeftMenu />
<!--MobileMenu /-->
<Modal />

<!-- <main class:connected={$wallet_connected}>
	<slot />
</main> -->

<Toast toast_data={$toast_store} />

<main>
	<slot />
</main>

<!--button on:click={()=>toast_store.set({show: $toast_store.show = !$toast_store.show})}>
	Toast
</button-->

<!--svelte:window on:resize={close_menu} /-->
<style>
	main {
		padding: 7vmax 5vw 15vw 10vw;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		main {
			padding: 10vw 3vw 15vw 10vw;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 20vh 5vw 15vw;
		}
		/* main.connected{
			padding: 27vh 5vw 15vw;
		} */
	}
</style>
