import axios from "axios"
import { 
    proposals_store, 
    users_store, 
    choice_array_store, 
    balances_store, 
    rswp_approval_store } from "../store";
import { get } from "svelte/store";
import type { I_Proposal, I_User, I_Choice } from "../types/imported-types";
//Mock Data
//import proposals from '../mock-data/proposals.json'
//import users from '../mock-data/users.json'


const local_hostnames = [
    '0.0.0.0', 'localhost', '127.0.0.1'
]

const apiUrl = [
    'localhost:35993/'
]

const blockservice = [
    'https://blockservice.opticprotocol.finance/'
]

// const isProd = () => !local_hostnames.includes(window.location.hostname)

// const base_url = isProd() ? 'api/' : `${constructTestingUrl()}:2001/`

// function constructTestingUrl() {
//     const url = `${window.location.protocol}//${window.location.hostname}`
//     console.log(url)
//     return url
// }



export async function syncProposals() {
    try {
        const proposals: any = (await axios.get(`${apiUrl[0]}all_proposals`)).data as I_Proposal[]
        
        let data = proposals.proposals;
        proposals_store.set(data);

        return data

    } catch (err) {
        console.log(err)
    }
}

export async function syncUsers() {
    try {
        const users: any = (await axios.get(`${apiUrl[0]}users`)).data as I_User[]
        
        let data = users.users;
        users_store.set(data);

        return data

    } catch (err) {
        console.log(err)
    }
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
            
            let w: any = u0.voteWeight;
            u0.voteWeight = parseFloat((w/total*100).toFixed(2));
            if(w === 0 || total === 0){
                u0.voteWeight = parseFloat("0.00")
                
            }
            
        }

    }

    return proposalChoices
}

export async function initSyncDaoData(){

    const proposals: any = await syncProposals();
    const users: any = await syncUsers();

    let choiceArray: any[] = [];
    let proposalChoices: I_Choice[] = []

    
    if(proposals){
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
                    let w: any = u2.voteWeight;
                    
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

        return  [ proposals, choiceArray]
    }

   return ['', '']
           
}

//remove this function to an appropriate place
export function findVotedProposals(vk: string, store: any) {
    for (let u of store){
        if (u.vk === vk){
            return u.proposals
        }
    }
}


//remove this function to an appropriate place
function get_fixed_value( obj: any ){
    let value;
    if(obj===null)return 0
    obj.__fixed__?value=Number(obj.__fixed__): value=Number(obj);
    return value
}



export async function getTauBalance(vk: string) {
    try {
        const balance: any = (await axios.get(`${blockservice[0]}current/one/currency/balances/${vk}`)).data
        
        balances_store.set({TAU: get_fixed_value(balance.value)})
        
    } catch (err) {
        console.log(err)
    }
}

export async function getApprovalBalance(vk: string) {
    let dao_contract = "con_lite_dao_test";
    let rswp = "con_rswp_lst001";
    try {
        const rswp_approval_amount: any = (await axios.get(`${blockservice[0]}current/one/${rswp}/balances/${vk}:${dao_contract}`)).data
        
        rswp_approval_store.set(get_fixed_value(rswp_approval_amount.value))
        
    } catch (err) {
        console.log(err)
    }
}




