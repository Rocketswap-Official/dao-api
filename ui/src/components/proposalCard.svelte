<script lang="ts">
    
    import ChoiceSelectorPieChart from './choiceSelectorPieChart.svelte';
    import Button from './button/button.svelte';
    import  type { I_Proposal, I_User }  from '../types/imported-types';
    export let proposal: I_Proposal;
    export let user: I_User[];

    const showModal = ()=>{let n; n= true}

    let results = proposal.results
    let choices = proposal.choices
    let total = 0;
    let choiceArray: any[] = [];

    for (let s of choices){
        let i = choices.indexOf(s)
        choiceArray.push({"proposalId": proposal.proposal_id, "choiceIdx": i, "choice": s, "voteWeight": 0.00});
    }
    //console.log(label)

    if (Object.keys(user).length > 0){
        for (let u  of user){
            for (let ui of u.proposals){
                if (ui === proposal.proposal_id){
                    let indx = u.proposals.indexOf(ui);
                    let c = u.choice_idx[indx];
                    let cWeight = u.rswp_balance + u.rocket_fuel + u.staked_rswp + u.staked_lp_value[indx] + u.lp_value[indx];
                    for (let u1 of choiceArray){
                        if (u1.choiceIdx === c){
                            u1.voteWeight += cWeight
                            u1.vk = u.vk;
                            
                        }
                    }

                    total += cWeight;
                }


            }
            
        }
        for (let u2 of choiceArray){
            let w = u2.voteWeight;
            
            u2.voteWeight = (w/total*100).toFixed(2);
            if(w === 0 || total === 0){
                u2.voteWeight = parseFloat("0.00");
            }
        }
    }

    //check for verified state here
    if(proposal.verified === 'true'){
        const choice_idx = Object.keys(results)

        for (let idx of choice_idx){
            total += results[idx]; //could be an object with __fixed__ key
        }
        for (let u0 of choiceArray){
            
            let w = u0.voteWeight;
            u0.voteWeight = (w/total*100).toFixed(2) + "%";
            if(w === 0 || total === 0){
                u0.voteWeight = "0.00%" 
                
            }
            
        }

    }   
    
</script>


<div class="container panel">
    <div class="proposal-title">#{proposal.proposal_id} - {proposal.title}</div>
    <div class="metadata-container">
        <div>Status: <span class="{proposal.state === 'concluded'?'text-secondary':'text-green'}" >{proposal.state}</span></div>
        <div>Voting Ends: {proposal.date_decision.__time__}</div>
    </div>

    <div class="choice-container">
             
        <ChoiceSelectorPieChart choices={choiceArray} {total}/>
            
    </div>

    <div class="flex row j-end">
        <div class="mr-1em">
            <Button act = {showModal}>
                Cast vote
            </Button>
        </div>
        
        <Button act = {showModal}>
            Details
        </Button>
    </div>
    
    
</div>

<style>
    .container{
        /* width: 60%; */
        padding: 2.5vw;
        box-shadow: var(--panel-box-shadow-higher);
        margin-bottom: 15px;
        color: var(--font-primary-color);
        font-size: var(--units-1_14vw);
        font-weight: 300;
    }
    .proposal-title {
        /* font-size: var(--units-1_14vw); */
        font-weight: 500;

    }
    .metadata-container{
        margin-bottom: 3vw;
        font-size: var(--units-1vw);
    }
    .choice-container{
        margin-bottom: 3vw;
        width: 100%;
        overflow-x: hidden;
        /* margin: 10px 0 10px 0; */
    }
    .text-secondary {
        color: var(--secondary-color)
    }
   
</style>