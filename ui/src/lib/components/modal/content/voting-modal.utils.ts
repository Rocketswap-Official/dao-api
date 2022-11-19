//import { I_Choice } from '../../../types/imported-types';

export const getCheckBoxGroup = (choices, group)=>{
    for (let c of choices){
        if(c.choice){
            group.push(c.choice) 
        }
    }
    return group
}
