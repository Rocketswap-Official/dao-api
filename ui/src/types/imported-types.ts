export interface I_Proposal {
    proposal_id: number;
    title: string;
    description: string;
    date_decision: { __time__: string };
    choices: any[];
    state: string;
    ballot_count: number;
    counted: string;
    verified: string;
    lp_weight: number;
    results: any;
}

export interface I_User {
    vk?: string;
    ballot_idx?: number[];
    choice_idx?: number[]
    weight?: number[]
    proposals?: number[]
    rswp_balance: number;
    rocket_fuel: number;
    staked_rswp: number;
    staked_lp_value?: number[];
    lp_value?: number[];
}