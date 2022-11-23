//import { I_Choice } from '../../../types/imported-types';

export const getCheckBoxGroup = (choices, group)=>{
    for (let c of choices){
        if(c.choice){
            group.push(c.choice) 
        }
    }
    return group
}

export const CheckVoted = (vk, choices)=>{
    let voted = false;
    for (let c of choices){
        if(c.vk == vk)voted = true
    }
    return voted
}

export const getProposalDescription = (proposals, id) => {
   
    for (let p of proposals){
        if(p.proposal_id === id){
            return p.description
        }
    }   
    
}
