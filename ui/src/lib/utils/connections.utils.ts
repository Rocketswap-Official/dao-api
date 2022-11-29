import WalletController from 'lamden_wallet_controller';
import { connectionRequest } from '../../config'
import { lwc_store, wallet_store, toast_store } from '../store';
import { getTauBalance, getApprovalBalance } from './api.utils';


export const handleWalletInfo = async (wInfo: any)=> {
    if (wInfo?.errors){
        for(let err of wInfo.errors){
            if(err=="You must be an authorized dApp to send this message type. Send 'lamdenWalletConnect' event first to authorize."){
                toast_store.set({show: true, error:true, title:"Wallet error", message:"Kindly connect to wallet"})
                return
            }
            toast_store.set({show: true, error:true, title:"Wallet error", message:err})
        }    
        
        // setTimeout(()=>{
        //     toast_store.set({show: false})
        // }, 2500)
        return
    }

    let address = wInfo.wallets[0];

    await getTauBalance(address);

    await getApprovalBalance(address);
    
    wallet_store.set(address);

}

export const handleTxnInfo = (txInfo: any)=> {
    if (txInfo?.errors){
        for (let err of txInfo.errors){
            if(err=="You must be an authorized dApp to send this message type. Send 'lamdenWalletConnect' event first to authorize."){
                toast_store.set({show: true, error:true, title:"Wallet error", message:"Your wallet is not connected"})
                return
            }
            toast_store.set({show: true, error:true, title:"Transaction error", message:err})
            
        }
    }
        console.log(txInfo)
}

export const initWalletController= ()=>{
    const lwc = new WalletController(connectionRequest);
    
    lwc_store.set(lwc) 
      
}



export const isWalletInstalled = (lwc)=>{
    lwc.walletIsInstalled()
        .then(installed=>{
            if(installed){}
            else {
                //send "install wallet" info to toast
                toast_store.set({show: true, error:true, title:"Wallet error", message:"Install Wallet" })
            }
        })
}

export const getCurrentWalletInfo = (lwc)=>{
    lwc.getInfo() // might change
}



//TODO: add the below to some configs or txn utils
// export const castBallot = (proposalIdx: number, choiceIdx: number)=>{

//     const detail = JSON.stringify({
//         networkType: 'marvinnet', 
//         methodName: 'cast_ballot', 
//         kwargs: {
//             proposal_idx: proposalIdx,
//             choice_idx: choiceIdx
//         }, 
//         stampLimit: 100
//     });

//     //Send transaction to the wallet
//     document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail}));

// }
