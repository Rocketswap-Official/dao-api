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

        return
    }

    toast_store.set({
        show: true, 
        error: txInfo.resultInfo.errorInfo?true:false,
        title: txInfo.resultInfo.title, 
        message: txInfo.txBlockResult.result === 'None'?txInfo.resultInfo.subtitle:txInfo.txBlockResult.result
    })

    
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




