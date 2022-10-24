export interface I_Proposal {
    id: number;
    proposal_id: number;
    title: string;
    description: string;
    date_decision: { __time__: string };
    choices: [];
    state: string;
    ballot_count: number;
    counted: string;
    verified: string;
    lp_weight: number;
    results: {};
}