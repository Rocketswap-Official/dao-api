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
	} from '$lib/utils/connections.utils';
	import MobileMenu from '$lib/mobile-menu/MobileMenu.svelte';

	onMount(() => {
		const lwc = controllerInstance();
		lwc_store.set(lwc);
		lwc.getInfo();
		lwc.events.on('newInfo', handleWalletInfo);
	});

</script>

<Header/>
<LeftMenu />
<MobileMenu/>
<Modal />

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
		padding: 10vmax 5vw 15vw 10vw;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		main {
			padding: 14vw 3vw 15vw 10vw;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 16vh 5vw 15vw;
			padding-top: 118.6px;
			width: 100%;
			margin: 0 auto;
		}
		/* main.connected{
			padding: 27vh 5vw 15vw;
		} */
	}
</style>
