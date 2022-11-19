import type { I_TransactionObj } from './lib/types/imported-types'

export const sendTransaction = async (lwc, transaction: I_TransactionObj): Promise<void> =>{
    lwc.sendTransaction(transaction) 
    //console.log(transaction)
}