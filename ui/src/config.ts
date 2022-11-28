import type {I_ProposalInfo, I_TransactionObj, I_BallotInfo, I_RSWPApprovalInfo} from './lib/types/imported-types'

export const connectionRequest = {
    appName: 'Lite DAO',
    version: '1.0.0', 
    logo: 'dao.svg', 
    contractName: 'con_lite_dao_test', 
    networkType: 'mainnet'
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

export let RSWPApprovalInfo:  I_RSWPApprovalInfo = {
    amount: 0,
    to: ''
    
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

export let RswpApprovalTxnInfo: I_TransactionObj = {
    contractName: "con_rswp_lst001",
    networkType: "mainnet",
    methodName: "approve",
    kwargs: RSWPApprovalInfo, 
    stampLimit: 100
    
}