import type { ComponentType } from "svelte";

//########## Proposal Types ##############################

export interface I_Proposal {
    id?: number;
    proposal_id: number;
    title: string;
    description: string;
    date_decision: { __time__: string };
    //choices: I_Choice[];
    choices: string[];
    state: string;
    ballot_count: number;
    counted: string;
    verified: string;
    lp_weight: number;
    results: {};
}

export interface I_Choice { 
    choice: string, 
    choiceIdx: number, 
    proposalId: number, 
    vk?: string, 
    voteWeight: number, 
    total: number 
}

//########## User Types ##############################

export interface I_User {
    vk: string;
    ballot_idx: number[];
    choice_idx: number[]
    weight: number[]
    proposals: number[]
    rswp_balance: number;
    rocket_fuel: number;
    staked_rswp: number;
    staked_lp_value: number[];
    lp_value: number[];
}

//########## Modal Types ##############################

export interface I_ModalType {
    type: string;
    component: ComponentType | string;
}

//########## Transaction Types ##############################

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
    contractName?: string;
    senderVk?: string;
    networkType: string;
    methodName: string; 
    kwargs: any; 
    stampLimit: number;
}


export interface I_BallotInfo {
    proposal_idx: string|number;
    choice_idx: string|number;
    
}

export interface I_RSWPApprovalInfo {
    amount: number;
    to: string;
    
}