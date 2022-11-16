<script lang="ts">
    
    import { wallet_store } from "../store"
    import { pieLabels, pieColours } from "./pieChart/pie";
    import PieChart from './pieChart/pieChart.svelte';
	import type { I_Choice } from "../types/imported-types";

    export let choices: I_Choice[];
    let total: number;

    
    //get vk from lamden wallet
    let vk = $wallet_store;
    //let vk = "dddddddddd"
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
        n = n + 1
    }

    
    // onMount(()=>{
    //     vote = castBallot

    //     document.addEventListener('lamdenWalletTxStatus', async(response: any) => {
    //         let data = await response.detail.data
    //         if (data.resultInfo.type === 'error') {
                
    //             console.log(data.resultInfo)
    //         }
    //         if (Object.keys(data.txBlockResult).length > 0){
    //             if (data.txBlockResult.result === "None"){
    //                 justChosen.disabled = true;
    //                 justChosen.style.border = '2px solid seagreen';
    //                 justVoted = true;
    //             }
    //         }
            //console.log(data)
            
            //data.resultInfo.title: "Transaction Pending" 
            //data.resultInfo.title: "Transaction Successful"
            //data.resultInfo.subtitle: "Your transaction used 1 stamps"
            //data.resultInfo.type: "success"
            
                
    //     });
    // })
    
</script>

<div style="margin-bottom: 3vw; font-size: var(--units-1_14vw);">
    <ol type="A">
    {#each choices as choice}
        {#if vkVoted}
            {#if choice.choiceIdx === chosenChoice}
                <label for="choice">
                    <button class="voted" disabled>{choice.choice}</button>
                </label>
                <div class="progress-bar">
                    <div class="track text-primary-color-dark weight-300" style="width: {choice.voteWeight}">{choice.voteWeight}</div>
                </div>
            {:else}
                <label for="choice">
                    <button disabled>{choice.choice}</button>
                </label>
                <div class="progress-bar">
                    <div class="track text-primary-color-dark weight-300" style="width: {choice.voteWeight}">{choice.voteWeight}</div>
                </div>
            {/if}
            
        {:else}
            <li class="mb-1" style="margin-left: var(--units-1_4vw); font-weight: 400">
                
                <div class="flex row space-between">
                    <div style="width: 70%; overflow:hidden; ">{choice.choice}</div>
                    <div>{choice.voteWeight}%</div>
                </div>
                
            
                
            </li>
            
        {/if}
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

    .progress-bar{
        width: 100%;
        height: 14px;
        padding: 0;
        margin: 5px 0 5px 0;
    }
    .track{
        background-color: aqua;
        border-radius: 3px;
        text-align: center;
        color: var(--background-color);
        padding: 0;
    }
    label{
        font-size: 11px;
    }
    button{
        padding: 4px;
        background-color: transparent;
        border: 0.5px solid grey;
        border-radius: 5px;
        cursor: pointer;
    }
    .voted {
        border: 2px solid seagreen;
    }
    ol {    
        padding-left: 0;
    }
    
</style>