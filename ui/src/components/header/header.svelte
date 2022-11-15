<script>
	// Images
	import logo_rocket from '$lib/svg/logo-rocket.svg';
	import logo_dao from '$lib/svg/logo-dao.svg';
	import logo_twitter from '$lib/svg/logo-twitter.svg';
	import logo_medium from '$lib/svg/logo-medium.svg';
	import logo_telegram from '$lib/svg/logo-telegram.svg';
	import menu_burger from './menu-burger.svg';
	import icon_notification from './icon-notification.svg';

	// Utils
	import { toggle_menu } from '$lib/mobile-menu/menu-functions'

	// Stores
	import { tau_balance } from '$lib/js/stores/user-stores';

	import { wallet_store } from '../../store';
	import { format_wallet_address, tauhq_addresses } from './header'


</script>

<header class="desktop flex" class:connected={$wallet_store}>
		<!--div class="corner left flex row">
			<a href="https://rocketswap.exchange/" class="desktop max-content">
				<img src={logo_rocket} alt="Rocketswap" class="rocketship-icon" />
			</a>
			<div class="desktop flex row max-content">
				<div class="ml-1 rocketswap">
					<a href="https://rocketswap.exchange/">
						<img src={logo_dao} alt="Rocketswap" />
					</a>
					TAU: $0.066 | RSWP: $0.016
				</div>
	
				<span class="inline-flex align-center ml-1 weight-300 max-content">
					Powered by <a href="https://www.lamden.io" class="link-primary">Lamden</a>
				</span>
			</div>
		</div-->

		<div class="flex row">
			<a href="https://rocketswap.exchange/" class="desktop max-content">
				<img src={logo_rocket} alt="Rocketswap" class="rocketship-icon" />
			</a>
			<div class="desktop flex row max-content">
				<div class="flex col justify-center ml-1 dao">
					<a href="https://rocketswap.exchange/">
						<img src={logo_dao} alt="Rocketswap" />
					</a>
					TAU: $0.066 | RSWP: $0.016
				</div>
	
				<span class="inline-flex align-center ml-1 weight-300 max-content">
					Powered by <a href="https://www.lamden.io" class="link-primary">Lamden</a>
				</span>
			</div>
		</div>

	
		{#if $wallet_store}
			<div class="wallet-balance-address desktop flex align-center">
				{`${$tau_balance} TAU | `}
				<a class="primary-link" href="{`${tauhq_addresses($wallet_store)}`}" target="_blank">
					{format_wallet_address($wallet_store)}
				</a>
			</div>
		{/if}

		<div class="corner right flex row align-center mobile">
			<img src={menu_burger} alt="menu" on:click={toggle_menu}/>
		</div>

		<div class="corner right flex row align-center">
			{#if $wallet_store}
				<button class="icon">
					<img src="{icon_notification}" alt="notification">
				</button>
			{/if}
			<a href="https://twitter.com/RSwapOfficial" class="ml-1">
				<img src={logo_telegram} alt="Telegram" />
			</a>
			<a href="https://twitter.com/RSwapOfficial" class="ml-1">
				<img class="logo_medium" src={logo_medium} alt="Medium" />
			</a>
			<a href="https://twitter.com/RSwapOfficial" class="ml-1">
				<img src={logo_twitter} alt="Twitter" />
			</a>
		</div>
</header>

<header class="mobile flex col" class:connected={$wallet_store}>
	<div class="flex">
		<!--div class="corner left flex row">
			<a href="https://rocketswap.exchange/" class="desktop max-content">
				<img src={logo_rocket} alt="Rocketswap" class="rocketship-icon" />
			</a>
			<div class="flex col grow">
				<a href="https://rocketswap.exchange/" class="rocketswap">
					<img src={logo_dao} alt="Rocketswap" />
				</a>
				<span class="subtitle inline-flex align-center ml-1 weight-300 max-content">
					Powered by <a href="https://www.lamden.io" class="link-primary  ml-1 mr-1em">Lamden</a>
					TAU: $0.066 | RSWP: $0.016
				</span>
			</div>
		</div-->
		<div class="flex row">
			<a href="https://rocketswap.exchange/" class="desktop max-content">
				<img src={logo_rocket} alt="Rocketswap" class="rocketship-icon" />
			</a>
			<div class="flex col grow">
				<a href="https://rocketswap.exchange/" class="rocketswap">
					<img src={logo_dao} alt="Rocketswap" />
				</a>
				<span class="subtitle inline-flex align-center ml-1 weight-300 max-content">
					Powered by <a href="https://www.lamden.io" class="link-primary  ml-1 mr-1em">Lamden</a>
					TAU: $0.066 | RSWP: $0.016
				</span>
			</div>
		</div>
		{#if $wallet_store}
			<div class="wallet-balance-address desktop flex align-center">
				{`${$tau_balance} TAU | `}
				<a class="primary-link" href="{`${tauhq_addresses($wallet_store)}`}" target="_blank">
					{format_wallet_address($wallet_store)}
				</a>
			</div>
		{/if}
		<div class="corner right flex row align-center mobile">
			<img src={menu_burger} alt="menu" on:click={toggle_menu}/>
		</div>
	</div>
	{#if $wallet_store}
		<div class="connected-row flex align-center center">
			<div class="wallet-balance-address  flex align-center">
				{`${$tau_balance} TAU |`}
				<a class="primary-link" href="{`${tauhq_addresses($wallet_store)}`}" target="_blank">
					{format_wallet_address($wallet_store)}
				</a>
			</div>
			<button class="icon">
				<img src="{icon_notification}" alt="notification">
			</button>
		</div>
	{/if}
</header>

<style>
	header {
		position: fixed;
		box-sizing: border-box;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		background-color: var(--panel-background-color);
		padding: var(--units-1_2vw) var(--units-2vw) var(--units-1_2vw) var(--units-6vw);
		height: var(--units-5vw);
		min-height: 38.5px;

        box-shadow: var(--panel-box-shadow-high);
        -webkit-box-shadow: var(--panel-box-shadow-high);
        -moz-box-shadow: var(--panel-box-shadow-high);
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;  
		height: 100%;
	}

	.corner.right > a {
		width: var(--units-2_5vw);
	}

	.corner.right > button {
		width: var(--units-2_3vw);
	}

	.corner.left{
		width: 40vw;
	}

	.corner img {
		width: 100%;
		height: 100%; 
		object-fit: contain;
	}

	a.max-content{
		width: max-content;
	}
	
	a.link-primary{
		width: unset;
		font-weight: 200;
	}

	.dao{
		line-height: 0.8;
		padding: var(--units-015vw);
	}

	img.logo_medium{
		height: 136%;
	}

	.wallet-balance-address{
		background-color: var(--background-color);
		border-radius: var(--units-06vw);
		box-shadow: var(--panel-box-shadow-high);

		height: 100%;
		padding: 0 var(--units-2vw);
		margin-right: calc(-1 * 12vw);
		width: fit-content;

		font-size: var(--units-1_15vw);
	}

	.wallet-balance-address > a{
		margin-left: var(--units-03vw);
	}
	
	@media (max-width: 768px) {
        header{
			font-size: var(--units-1vw);
        }
		.corner.left{
			width: 307.594px;
		}
    }

	@media (max-width: 480px) {
        header{
			padding: 4vh 5vw;
			height: unset;
        }
		header.connected{
			padding: 4vh 5vw 3vh;
		}
		.subtitle{
			font-size: 3vw;
		}
		
		.corner a{
			width: unset;
			height: unset;
		}
		.corner.right{
			width: 13vw;
		}
		.rocketswap{
			width: 50vw;
		}
		.corner img{
			height: unset;
		}
		.corner.left{
			width: 100%;
			font-size: var(--units-1vw);
		}
		.mobile .rocketswap{
			width: 55vw;
		}
		.wallet-balance-address{
			margin-right: 4vw;
			padding: 1vh 2vh;
			font-size: 3.5vw;
		}
		.connected-row{
			margin-top: 3vh;
		}

    }
</style>