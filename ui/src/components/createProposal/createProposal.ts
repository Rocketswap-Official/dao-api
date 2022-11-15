//##########Utils##############################

export const processChoices = (choices: I_ChoicesObj[]): string[] =>{
    let c: any = []
    for (let choice of choices){
        c.push(choice.text)
    }

    return c
}

export const sendTransaction = async (lwc, transaction: I_TransactionObj): Promise<void> =>{
    lwc.sendTransaction(transaction) 
    //console.log(transaction)
}

//##########Config##############################

export let proposalInfo: I_ProposalInfo = {
    title: '',
    description: '',
    date_decision: '',
    choices: []
}

export let proposalTxnInfo: I_TransactionObj = {
   
    networkType: "mainnet",
    methodName: "create_proposal",
    kwargs: proposalInfo, 
    stampLimit: 100
    
}

//##########Types##############################

export interface I_ProposalInfo {
    title: string;
    description: string;
    date_decision: string;
    choices: I_ChoicesObj[]
}
export interface I_ChoicesObj {
    id: number;
    text: string;

}
export interface I_TransactionObj{
    networkType: string;
    methodName: string; 
    kwargs: any; 
    stampLimit: number;
}