<script lang="ts">
    
    import { wallet_store } from "../store"
    import { pieLabels, pieColours } from "./pieChart/pie";
    import PieChart from './pieChart/pieChart.svelte';
	import type { I_Choice } from "../types/imported-types";

    export let choices: I_Choice[];
    
    let total: number;
    //console.log(choices)
    //get vk from lamden wallet
    let vk = $wallet_store;
    // let vk = "cccccccccc"
    let vkVoted = false;
    let chosenChoice: number;
    let justChosen: any;
    let justVoted = false;
    let vote: any;
    let n = 0;
    let labels: string[] = [];
    let weights: number[] = [];
    let backgroundColor: string[] = [];


    for (let c of choices){
        if (c.vk === vk){
            vkVoted = true;
            chosenChoice = c.choiceIdx;
        }
        labels.push(pieLabels[n]);
        weights.push(parseFloat(c.voteWeight));
        backgroundColor.push(pieColours[n]);
        total = c.total
        console.log(c.voteWeight)
        n = n + 1
    }

    let wT = 0

    //do not render pie chart area when there is no voted weight
    for(let w of weights){
        wT = wT + w
    }

    const maxValue = Math.max(...weights)
    const sumWeights = weights.reduce((a,b)=> a+b)

    const average = sumWeights / weights.length
    
    const is_all_same_value = (choiceVoteWeight: number)=>{
        for(let w of weights){
            if (w !== average){
                return maxValue === choiceVoteWeight 
            }       
        }
        return false      
    }

    
</script>

<div style="margin-bottom: 3vw; font-size: var(--units-1_14vw);">
    <ol type="A">
    {#each choices as choice}
            
        <div class="flex row space-between">

            <div class="flex row a-start">

                <img class="svg" class:visibility={is_all_same_value(choice.voteWeight)} src="svg/award-medal-badge.svg" alt="leading vote"/>

                <li class="mb-1" style="margin-left: var(--units-1_4vw); font-weight: 400">    
                   
                    {choice.choice}
                
                </li>
            </div>

            <div class="flex row a-start">
                <div>{choice.voteWeight}%</div>
                <img class="svg2" class:visibility={choice.vk === vk} src="svg/checked.svg" alt="selected choice"/>
            </div>
                                    
        </div>
        
    {/each}
    </ol>
    
</div>

<div class="flex row space-between">

    <div class="flex col j-end ">
        <div style="font-size: var(--units-09vw);">
            <div style="font-weight: 500">Total votes: {(total/1200000000*100).toFixed(2)}%</div>
            <div>{total}/1200000000 RSWP</div>
        </div>
        
    </div>

    {#if wT > 0}
    
    <PieChart {labels} {weights} {backgroundColor}/>
    
    {/if}

</div>


<style>

    ol {    
        padding-left: 0;
    }
    /* TODO: deal with overflow issue
    li {
        overflow-x: scroll;
    } */
    .svg{
        width: 20px;
        visibility: hidden;
        opacity: 0;
    }
    .svg2{
        
        width: 15px;
        visibility: hidden;
        opacity: 0;
    }
    .visibility{
        visibility:visible;
        opacity: 1;
    }
    
</style>