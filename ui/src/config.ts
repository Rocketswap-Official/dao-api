import type {I_ProposalInfo, I_TransactionObj, I_BallotInfo} from './lib/types/imported-types'

export const connectionRequest = {
    appName: 'My Killer dApp',
    version: '1.0.0', 
    logo: 'images/logo.png', 
    contractName: 'con_killer_app', 
    networkType: 'testnet'
}

export let proposalInfo: I_ProposalInfo = {
    title: '',
    description: '',
    date_decision: '',
    choices: []
}

export let ballotInfo:  I_BallotInfo = {
    proposal_idx: '',
    choice_idx: ''
    
}

export let proposalTxnInfo: I_TransactionObj = {
   
    networkType: "mainnet",
    methodName: "create_proposal",
    kwargs: proposalInfo, 
    stampLimit: 100
    
}

export let ballotTxnInfo: I_TransactionObj = {
   
    networkType: "mainnet",
    methodName: "cast_ballot",
    kwargs: ballotInfo, 
    stampLimit: 100
    
}