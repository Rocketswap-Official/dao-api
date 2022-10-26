<!--div>progress bar</div-->

<script lang="ts">
    import { castBallot } from "../utils/contractMethodCalls"
    import { onMount } from "svelte";
    import { wallet_store } from "../store"
    import { pieLabels, pieColours } from "../pie";
    import PieChart from './pieChart.svelte';

    export let choices: any[];
    
    //get vk from lamden wallet
    let vk = $wallet_store;
    //let vk = "dddddddddd"
    let vkVoted = false;
    let chosenChoice: number;
    let justChosen: any;
    let justVoted = false;
    let vote: any;
    let n = 0;
    let l = ["A","B", "C", "D", "E"];
    let cl = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
    ];
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
        n = n + 1
    }

    //console.log(backgroundColor)

    const castBallot_= (e: any) =>{
        let proposalId = parseInt(e.target.getAttribute("data-proposal-id"));
        let choiceIdx = parseInt(e.target.getAttribute("data-choice-idx"));
        vote(proposalId, choiceIdx)
        justChosen = e.target
    }
    
    onMount(()=>{
        vote = castBallot

        document.addEventListener('lamdenWalletTxStatus', async(response: any) => {
            let data = await response.detail.data
            if (data.resultInfo.type === 'error') {
                
                console.log(data.resultInfo)
            }
            if (Object.keys(data.txBlockResult).length > 0){
                if (data.txBlockResult.result === "None"){
                    justChosen.disabled = true;
                    justChosen.style.border = '2px solid seagreen';
                    justVoted = true;
                }
            }
            console.log(data)
            
            //data.resultInfo.title: "Transaction Pending" 
            //data.resultInfo.title: "Transaction Successful"
            //data.resultInfo.subtitle: "Your transaction used 1 stamps"
            //data.resultInfo.type: "success"
            
                
        });
    })
    
</script>

<div>
    <ol type="A" style="">
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
            <li class="mb-1" style="font-size: var(--units-1vw); font-weight: 500">
                <!--span>A)</span-->
                <div class="flex row space-between" style="align-items: flex-end; ">
                    <div style="width: 70%; overflow:hidden; ">{choice.choice}</div>
                    <div>{choice.voteWeight}%</div>
                </div>
                
                <!--div class="progress-bar">
                    <div class="track text-primary-color-dark weight-300" style="width: {choice.voteWeight}">{choice.voteWeight}</div>
                </div-->
            </li>
            <!--label for="choice">
                <button 
                    data-proposal-id={choice.proposalId} 
                    data-choice-idx={choice.choiceIdx} 
                    class="{justVoted?'disable':''}"
                    on:click={castBallot_}>
                    {choice.choice}
                </button>
            </label>
            <div class="progress-bar">
                <div class="track text-primary-color-dark weight-300" style="width: {choice.voteWeight}">{choice.voteWeight}</div>
            </div-->
        {/if}
    {/each}
    </ol>
    
</div>

<div style="overflow: hidden;">
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
        padding-left: 2em; 
       
    }
    /* .disable{
        opacity: 0.7;
        pointer-events: none;
    } */

</style>