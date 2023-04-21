<script>
    import { page, navigating } from '$app/stores';
    import menu_items from '$lib/config/menu-items.json'
    // Components
    import ConnectButton from '$lib/components/leftMenu/ConnectButton.svelte'
    // Icons
    import menu_icon_map from '$lib/config/menu-icons.js'
    import logo_twitter from '$lib/svg/logo-twitter.svg';
	import logo_medium from '$lib/svg/logo-medium.svg';
	import logo_telegram from '$lib/svg/logo-telegram.svg';
    // Store
	import { menu_open } from '$lib/js/stores/app-stores'
    import { wallet_connected } from '$lib/js/stores/user-stores'
    // Utils
    import { close_menu } from '$lib/mobile-menu/menu-functions'
    navigating.subscribe(close_menu)
</script>

<div class="mobile">
    <div class:open={$menu_open} class="menu" class:connected={$wallet_connected}>
        <ul>
            {#each menu_items as menu_item}
                <li class:text-gradient-primary={$page.url.pathname == menu_item.path}>
                    <a href="{menu_item.path}" class="flex row align-center" >
                        {#if $page.url.pathname == menu_item.path}
                            <img src={menu_icon_map[menu_item.logo.concat('_color')]} 
                                 alt="{menu_item.name}"
                            />
                        {:else}
                            <img src={menu_icon_map[menu_item.logo]} 
                                alt="{menu_item.name}"
                            />
                        {/if}
                        {menu_item.name}
                    </a>
                </li>
            {/each}

            <ConnectButton />
        </ul>
        <div class="socials flex align-center space-between">
            <a href="https://t.me/rocketswap" >
                <img src="svg/logo-telegram.svg" alt="Telegram" />
            </a>
            <a href="https://medium.com/rswp-io">
                <img class="logo_medium" src="svg/logo-medium.svg" alt="Medium" />
            </a>
            <a href="https://twitter.com/RSwapOfficial">
                <img src="svg/logo-twitter.svg" alt="Twitter" />
            </a>
        </div>
    </div>
</div>

<style>
    .open.menu{
        display: block;
    }
    .menu{
        display: none;
        z-index: 9;
        background-color: var(--panel-background-color);
        padding: 18vh 2.5vw 0;
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        position: fixed;
        top: 2vw;
        left: 0;
        touch-action: none;
    }
    .menu.connected{
        padding-top: 25vh;
    }
    .socials{
        padding: 0 20vw;
        box-sizing: border-box;
    }
    .socials > a > img{
        width: 7vh;
    }
    .socials > a > img.logo_medium{
        width: 8vh;
    }
    ul{
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        font-size: 2.5vh;
        font-weight: 600;
        list-style-type: none;
    }
    ul:first-child{
        margin-top: 0;
    }
    li{
        display: flex;
        color: var(--primary-gradient);
    }
    li > a{
        padding: 1.5vh 2.5vw;
        width: 100%;
    }
    li:hover > a{
        text-decoration: underline;
        background-color: var(--panel-background-highlight);
    }
    li > a > img{
        margin-right: 5vw;
        width: 5vh;
    }

    @media (max-width: 768px) {
        .menu{
            top: 4vw;   
        }
    }

	@media (max-width: 480px) {
        .menu{
            top: 12vw;    
        }

    }
</style>
