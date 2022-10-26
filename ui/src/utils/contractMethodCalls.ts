
export const castBallot = (proposalIdx: number, choiceIdx: number)=>{

    const detail = JSON.stringify({
        networkType: 'marvinnet', 
        methodName: 'cast_ballot', 
        kwargs: {
            proposal_idx: proposalIdx,
            choice_idx: choiceIdx
        }, 
        stampLimit: 100
    });

    //Send transaction to the wallet
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail}));

}
export const createProposal = (title: string, description: string, date: any, choiceArray: any[])=>{

    const detail = JSON.stringify({
        networkType: 'marvinnet', 
        methodName: 'create_proposal', 
        kwargs: {
            title: title, 
            description: description, 
            date_decision: date, 
            choices: choiceArray
        }, 
        stampLimit: 100
    });

    //Send transaction to the wallet
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail}));

}