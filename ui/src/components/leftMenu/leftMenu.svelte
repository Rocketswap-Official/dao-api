<script>
    import { page } from '$app/stores';

    // Components
    import ConnectButton from './ConnectButton.svelte'

    // Icons
    import menu_icon_map from '$lib/config/menu-icons.js'

    import menu_items from '$lib/config/menu-items.json'

    $: current_route = $page.url.pathname
</script>

<nav id="left-menu" class="desktop flex col align-center">
    <ul>
        {#each menu_items as menu_item}
            <li class:active={current_route == menu_item.path}>
                <a href="{menu_item.path}" class="flex col align-center">
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
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 5.2vw;
        min-width: 40px;

        height: 100vh;
        background-color: var(--panel-background-color);
        padding: 8.4vw 0vw 0vw;

        box-shadow: var(--panel-box-shadow);
        -webkit-box-shadow: var(--panel-box-shadow);
        -moz-box-shadow: var(--panel-box-shadow);
    }

    ul{
        width: 100%;
        box-sizing: border-box;
        padding: 0;
    }

    ul:first-child{
        margin-top: 0;
    }

    a{
        text-align: center;
        align-items: center;
        color: var(--font-primary-color);
        padding: 0.8vw 0;
        margin: 0.3vw 0;
        overflow-wrap: normal;
    }

    li:hover:not(.active){
        background-color: var(--panel-background-highlight);

    }

    a img{
        width: 38%;
        margin-bottom: 0.3vw;
    }

    .active{
        cursor: unset;
    }

    .active > a{
        cursor: unset;
        background: var(--primary-gradient);
        background-clip: text;
        background: var(--primary-gradient-webkit);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    @media (max-width: 768px) {
        nav{
            padding-top:  53.76px;
            font-size: var(--font-size-fixed-768);
            font-size: var(--units-09vw);
        }
        a img{
            margin-bottom: 2.307px;
        }
        li {
            margin: 15.38px 0;
        }
    }
</style>