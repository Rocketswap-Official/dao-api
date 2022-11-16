<script lang="ts">


    import { wallet_store, choice_array_store, modal_data_store } from "../../../store"
	//import type { I_Choice } from "src/types/imported-types";

    let idx = $modal_data_store;
    //console.log(idx)
    let choices = $choice_array_store[1]

    //console.log(choices)
    let total: number;

    
    //get vk from lamden wallet
    let vk = $wallet_store;
    let vkVoted = false;
    let chosenChoice: number;
    let n = 0;
    let weights: number[] = [];
    

    for (let c of choices){
        if (c.vk === vk){
            vkVoted = true;
            chosenChoice = c.choiceIdx;
        }

        weights.push(parseFloat(c.voteWeight));
        total = c.total
        n = n + 1
    }

</script>


<div style="margin-top: 3vw; font-size: var(--units-1_14vw);">
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
