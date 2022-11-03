<script>
    // Utils
    import { show_lamden_wallet_1, show_keystore_1 } from '$lib/modals/wallet_connect/connect_utils'

</script>

<h2 class="modal-heading">Choose a Login Option</h2>
<div class="modal-content-confirm">
    <p class="modal-message">The Lamden Wallet is a Chrome browser plugin used to securely store your Lamden Accounts. You can install it from the 
        <a href="https://chrome.google.com/webstore/detail/lamden-vault-browser-exte/fhfffofbcgbjjojdnpcfompojdjjhdim" class="link-primary">Chrome Webstore</a>.
    </p>
    <button class="outlined white" on:click={show_lamden_wallet_1}><div>Lamden Wallet</div></button>
    <hr>
    <p class="modal-message">A Lamden Keystore can be used to login to Rocketswap in situations where the Lamden Wallet is not supported. A keystore can be created using the 
        <a href="https://docs.lamden.io/docs/wallet/backup_keystore" class="link-primary">Backup feature</a>
         of the Lamden Wallet.
    </p>
    <button class="outlined white" on:click={show_keystore_1}><div>Use Keystore File</div></button>
</div>

<style>
    button{
        display: block;
        margin: 0 auto;
    }
    .modal-message{
        text-align: left;
    }
    hr{
        margin-top: var(--units-2vw);
        width: 100%;
    }
</style>