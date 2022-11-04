<script>
    // Utils
    import { show_connect_main } from '$lib/modals/wallet_connect/connect_utils'

    // Images
    import IconFile from '$lib/modals/wallet_connect/file_icon.svg'

</script>

<h2 class="modal-heading">Lamden Wallet Login</h2>
<div class="modal-content-confirm">
    <div class="modal-highlight">
        <img src={IconFile} alt="file icon" />
    </div>
    <div class="modal-message">
        <p>Select A Keystore</p>
    </div>
    <div class="modal-buttons">
        <button class="outlined white" on:click={show_connect_main}><div>Back</div></button>
        <button class="outlined primary white"><div>Select File</div></button>
    </div>
    
</div>

<style>
    .modal-highlight{
        width: fit-content;
        margin: 0 auto var(--units-2vw);
    }
</style>