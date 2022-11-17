<script lang="ts">
    
    import { wallet_store } from "../store"
    import { pieLabels, pieColours } from "./pieChart/pie";
    import PieChart from './pieChart/pieChart.svelte';
	import type { I_Choice } from "../types/imported-types";
    import leadingVoteSvg from '$lib/svg/award-medal-badge-svgrepo-com.svg';
    import choiceSelectedSvg from '$lib/svg/check-svgrepo-com.svg';

    export let choices: I_Choice[];
    let total: number;

    
    //get vk from lamden wallet
    //let vk = $wallet_store;
    let vk = "cccccccccc"
    let vkVoted = false;
    let chosenChoice: number;
    let justChosen: any;
    let justVoted = false;
    let vote: any;
    let n = 0;
    let labels: string[] = [];
    let weights: number[] = [];
    let backgroundColor: string[] = [];
    let maxValue = 0;

    for (let c of choices){
        if (c.vk === vk){
            vkVoted = true;
            chosenChoice = c.choiceIdx;
        }
        labels.push(pieLabels[n]);
        weights.push(parseFloat(c.voteWeight));
        backgroundColor.push(pieColours[n]);
        total = c.total
        n = n + 1
    }

    maxValue = Math.max(...weights)

    
</script>

<div style="margin-bottom: 3vw; font-size: var(--units-1_14vw);">
    <ol type="A">
    {#each choices as choice}
            
        <div class="flex row space-between">

            <div class="flex row a-start">

                <img class="svg" class:visibility={choice.voteWeight == maxValue} src={leadingVoteSvg} alt="leading vote"/>

                <li class="mb-1" style="margin-left: var(--units-1_4vw); font-weight: 400">    
                   
                    {choice.choice}
                
                </li>
            </div>

            <div class="flex row a-start">
                <div>{choice.voteWeight}%</div>
                <img class="svg2" class:visibility={choice.vk == vk} src={choiceSelectedSvg} alt="selected choice"/>
            </div>
                                    
        </div>
        
    {/each}
    </ol>
    
</div>

<div class="flex row space-between">

    <div class="flex col j-end ">
        <div style="font-size: var(--units-09vw);">
            <div style="font-weight: 500">Total votes: {(total/102000321*100).toFixed(8)}%</div>
            <div>{total}/102000321 RSWP</div>
        </div>
        
    </div>
    
    <PieChart {labels} {weights} {backgroundColor}/>
    
    
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