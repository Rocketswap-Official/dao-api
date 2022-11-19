<script lang="ts">
	import { onMount } from "svelte";
    import { sendTransaction } from '../../../../funcs'
    import { ballotTxnInfo } from '../../../../config'
    import { getCheckBoxGroup } from './voting-modal.utils'
    import { 
        wallet_store, 
        choice_array_store, 
        modal_data_store, 
        lwc_store, 
        toast_store } from "../../../store"
	//import type { I_Choice } from "src/types/imported-types";
    let idx = $modal_data_store;

    let choices: any = $choice_array_store[idx]
    let group: any = []
    //let vk = $wallet_store;
    let vk = "cccccccccc";
    let selectOne: any;

    group = getCheckBoxGroup(choices, group)
    
    
    const submitSelectedChoice = ()=>{
        toast_store.set({show: true, title:"Transacton State", pending:true, message:"Pending"})

        sendTransaction($lwc_store, ballotTxnInfo)
        console.log(ballotTxnInfo)
        
    }

    const changeBackgroundColor = (e: any)=>{
            console.log(e.target)
            const background = e.target;
            background.style.backgroundColor = "#0E1621";
            background.style.padding = "0.7em 0 0.7em 0";
    }

    onMount(()=>{
        selectOne = (e: any)=>{
            const box = e.target;
            const group: any = document.getElementsByClassName("checkbox")
            if(box.checked){
                for (let ele of group){

                    ele.checked = false;
                }
                box.checked = true;
                
              
            }else{
                box.checked = false;
            }

            box.checked?ballotTxnInfo.kwargs.choice_idx = parseInt(box.value):ballotTxnInfo.kwargs.choice_idx = "";
            ballotTxnInfo.kwargs.proposal_idx = parseInt(box.name)
        }

        
    })

</script>


<div style="margin-top: 3vw; font-size: var(--units-1_14vw);">
    <ol type="A">
    {#each choices as choice}
        
    <!-- TODO: leave a little space between list bullet and border -->
    <div class="choice mb-1 " class:voted={choice.vk === vk} on:click={changeBackgroundColor} on:keyup={changeBackgroundColor}>  
        
        <li >
            
            <div class="flex row space-between">
                <label for="choice">{choice.choice}</label>
                <input 
                    type="checkbox" 
                    class="checkbox"
                    bind:group={group} 
                    name={choice.proposalId}
                    value={choice.choiceIdx} 
                    on:click={selectOne}
                    checked/>
                    
            </div>
            
        </li>
           
    </div> 
    {/each}
    </ol>
    
</div>

<div class="flex row center">
    <button class=" outlined primary white" on:click={submitSelectedChoice}>
        <div>Cast Vote</div>
    </button>
</div>

<style>
    li {
        margin-left: var(--units-1_4vw); 
        font-weight: 400; 
        /* list-style-position: inside; */
    }

    ol {    
        padding-left: 0;
    }
    .voted {
        background-color: var(--background-color); 
        padding: 0.7em 0 0.7em 0; 
    }
    .choice {
        padding: 0.7em 0 0.7em 0; 
        border: 3px solid var(--background-color);
    }
    /* input[type=checkbox], input[type=checkbox]:checked {
        -moz-appearance:none;
        -webkit-appearance:none;
        -o-appearance:none;
    } */

    input[type=checkbox] {
        width: 20px;
        height: 20px;
    }

    
</style>
