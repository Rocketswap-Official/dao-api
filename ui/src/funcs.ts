import type { I_TransactionObj } from './lib/types/imported-types'

export const sendTransaction = async (lwc, callback, transaction: I_TransactionObj): Promise<void> =>{
    lwc.sendTransaction(transaction, callback) 
    //console.log(transaction)
}