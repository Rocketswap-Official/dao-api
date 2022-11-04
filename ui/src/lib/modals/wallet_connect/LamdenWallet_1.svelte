<script>
    // Stores
    //import { get_filter } from '$lib/js/stores/filter-stores'

    // Utils
    import { show_connect_main } from '$lib/modals/wallet_connect/connect_utils'
    import { handle_modal_close } from '$lib/js/event-handlers'

    // Images
    import LamdenLogoText from '$lib/svg/lamden-logo-text.svg'

    // Components
    //import FilterCheckboxCheck from '$lib/misc-components/FilterCheckboxCheck.svelte'

    // Services
    import { connect_wallet } from '$lib/js/services/wallet.service'

    function handle_click_connect(){
        connect_wallet()
        handle_modal_close()
    }

</script>

<h2 class="modal-heading">Lamden Wallet Login</h2>
<div class="modal-content-confirm">
    <div class="modal-highlight">
        <img src={LamdenLogoText} alt="lamden logo" />
    </div>
    <div class="flex center">
        <!--FilterCheckboxCheck filter={get_filter("Connect Wallet")} filter_name={"Auto Connect to Lamden Wallet"} single /-->
    </div>
    <div class="modal-buttons">
        <button class="outlined white" on:click={show_connect_main}><div>Back</div></button>
        <button class="outlined primary white" on:click={handle_click_connect}><div>Connect</div></button>
    </div>
    
</div>

<style>
    .modal-highlight{
        width: fit-content;
        margin: 0 auto var(--units-2vw);
    }
</style>