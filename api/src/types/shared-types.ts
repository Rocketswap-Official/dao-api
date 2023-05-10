export interface I_Proposal {
    id: number;
    proposal_id: number;
    title: string;
    description: string;
    date_decision: { __time__: string };
    choices: I_Choice[];
    state: string;
    ballot_count: number;
    counted: boolean;
    verified: boolean;
    lp_weight: number;
    results?: {};
}

export interface I_Choice { 
    choice: string, 
    choiceIdx: number, 
    proposalId: number, 
    vk: string, 
    voteWeight: number 
}

export interface I_User {
    vk?: string;
    ballot_idx?: number[];
    choice_idx?: number[]
    weight?: number[]
    proposals?: string[]
    rswp_balance: number;
    rocket_fuel: number;
    staked_rswp: number;
    staked_lp_value?: number[];
    lp_value?: number[];
}