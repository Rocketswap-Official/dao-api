<script lang="ts">
    import WalletController  from 'lamden_wallet_controller'
    import { RswpApprovalTxnInfo } from '../../../../config'
    import { handleTxnInfo } from '../../../utils/connections.utils'
    import { wallet_store } from '../../../store'
    import { onMount } from 'svelte'

    let submitRSWPApproval: any;

    onMount(()=>{

        submitRSWPApproval = ()=>{

            const lwc = new WalletController();
    
            RswpApprovalTxnInfo.senderVk = $wallet_store;
            RswpApprovalTxnInfo.kwargs.amount = 999999999999999999999999999999;
            RswpApprovalTxnInfo.kwargs.to = 'con_lite_dao_test';

            lwc.sendTransaction(RswpApprovalTxnInfo, handleTxnInfo)
            //document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail: JSON.stringify(RswpApprovalTxnInfo)}));
            console.log(RswpApprovalTxnInfo)
        }

    })

    
</script>
<div>
    <div class="flex col align-center">

        <h3 style="margin-bottom: 2em;">
            One time approval for DAO contract to spend RSWP (con_rswp_lst001)
        </h3>

        <button class="outlined white" style="width: 50%" on:click={submitRSWPApproval}>
            <div>Approve</div>
        </button>
    </div>

</div>