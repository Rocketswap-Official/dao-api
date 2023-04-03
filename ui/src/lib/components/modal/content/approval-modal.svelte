<script lang="ts">
    // import WalletController  from 'lamden_wallet_controller'
    import { lwc_store, wallet_store } from '../../../store';
    import { RswpApprovalTxnInfo } from '../../../../config';
    import { handleTxnInfo } from '../../../utils/connections.utils';
    import { contracts } from '../../../../config';

    const submitRSWPApproval = ()=>{

        RswpApprovalTxnInfo.senderVk = $wallet_store;
        RswpApprovalTxnInfo.kwargs.amount = {__fixed__: "999999999999999999999999999999"};
        RswpApprovalTxnInfo.kwargs.to = contracts.dao;

        $lwc_store.sendTransaction(RswpApprovalTxnInfo, handleTxnInfo)
        console.log(RswpApprovalTxnInfo)
    }

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