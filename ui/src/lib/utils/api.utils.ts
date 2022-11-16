import axios from "axios"
import { proposals_store, users_store, choice_array_store } from "../store";
import type { I_Proposal, I_User, I_Choice } from "../types/imported-types";
//Mock Data
import proposals from '../mock-data/proposals.json'
import users from '../mock-data/users.json'


const local_hostnames = [
    '0.0.0.0', 'localhost', '127.0.0.1'
]

// const isProd = () => !local_hostnames.includes(window.location.hostname)

// const base_url = isProd() ? 'api/' : `${constructTestingUrl()}:2001/`

// function constructTestingUrl() {
//     const url = `${window.location.protocol}//${window.location.hostname}`
//     console.log(url)
//     return url
// }

export async function syncProposals(): Promise<void> {
    try {
        //const proposals = (await axios.get(`${base_url}all_proposals`)).data as I_Proposal[]
        
        proposals_store.set(proposals.proposals)
    } catch (err) {
        console.log(err)
    }
}

export async function syncUsers(): Promise<void> {
    try {
        //const users = (await axios.get(`${base_url}users`)).data as I_User[]
        
        users_store.set(users.users)
    } catch (err) {
        console.log(err)
    }
}

export async function process(proposals: I_Proposal[], users: I_User[]){
    //let choiceArray: I_Choice[] = [];
    let choiceArray: any[] = [];
    let proposalChoices: I_Choice[] = []

    

    for (let proposal of proposals){
        let results: any = proposal.results
        let choices: string[] = proposal.choices
        let total = 0;
        

        for (let s of choices){
            let i = choices.indexOf(s)
            proposalChoices.push({"proposalId": proposal.proposal_id, "choiceIdx": i, "choice": s, "voteWeight": 0.00, "total": total});
        }

        if(Object.keys(users).length > 0){
            for (let u  of users){
                for (let ui of u.proposals){
                    if (ui === proposal.proposal_id){
                        let indx = u.proposals.indexOf(ui);
                        let c = u.choice_idx[indx];
                        let cWeight = u.rswp_balance + u.rocket_fuel + u.staked_rswp + u.staked_lp_value[indx] + u.lp_value[indx];

                        for (let u1 of proposalChoices){
                            if (u1.choiceIdx === c){
                                u1.voteWeight += cWeight
                                u1.vk = u.vk;
                                
                            }
                        }

                        total += cWeight;
                    }


                }
                
            }

            for (let u2 of proposalChoices){
                let w = u2.voteWeight;
                
                u2.voteWeight = parseFloat((w/total*100).toFixed(2));
                if(w === 0 || total === 0){
                    u2.voteWeight = parseFloat("0.00");
                }
                u2.total = total
            }


        }


        proposalChoices = await checkVerified(proposal, proposalChoices)

        choiceArray.push(proposalChoices)
        proposalChoices = []
    }
    

    choice_array_store.set(choiceArray)
           
}

export async function checkVerified(proposal: I_Proposal, proposalChoices: I_Choice[]){
    let verified = proposal.verified
    let results = proposal.results
    let total = 0;
    //check for verified state here
    if (verified === 'true'){
        const choice_idx = Object.keys(results)

        for (let idx of choice_idx){
            total += results[idx]; //could be an object with __fixed__ key
        }
        for (let u0 of proposalChoices){
            
            let w = u0.voteWeight;
            u0.voteWeight = parseFloat((w/total*100).toFixed(2));
            if(w === 0 || total === 0){
                u0.voteWeight = parseFloat("0.00")
                
            }
            
        }

    }

    return proposalChoices
}

process(proposals.proposals, users.users)

