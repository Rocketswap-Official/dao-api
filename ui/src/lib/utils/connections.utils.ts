import WalletController from 'lamden_wallet_controller';
import { connectionRequest } from '../../config'
import { lwc_store, wallet_store, toast_store } from '../store';


export const handleWalletInfo = (wInfo: any)=> {
    if (wInfo.errors){
        wInfo.errors.forEach(err => {
            if(err=="You must be an authorized dApp to send this message type. Send 'lamdenWalletConnect' event first to authorize."){
                toast_store.set({show: true, error:true, title:"Wallet error", message:"Kindly connect to wallet"})
                return
            }
            toast_store.set({show: true, error:true, title:"Wallet error", message:err})
            
        })
        // setTimeout(()=>{
        //     toast_store.set({show: false})
        // }, 2500)
        return
    }
    wallet_store.set(wInfo.wallets[0])
}
export const handleTxnInfo = (txInfo: any)=> console.log(txInfo)

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
