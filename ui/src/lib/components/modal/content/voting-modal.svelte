<script lang="ts">
	import { onMount } from "svelte";
    import { handleTxnInfo } from './txFunc.voting'
    import { ballotTxnInfo } from '../../../../config'
    import { getCheckBoxGroup } from './content-modal.utils'
    import { 
        choice_array_store, 
        modal_data_store, 
        lwc_store, 
        toast_store } from "../../../store"

    let idx = $modal_data_store.choice_index;
    let choices: any = $choice_array_store[idx]
    let group: any = []
    let selectOne: any;
    let bgId = "0";

    group = getCheckBoxGroup(choices, group);

    const calcIndex = (cId: string)=>{
        return (Number(cId) + 1).toString()
    }

    const submitSelectedChoice = async(e: any)=>{
        if(!ballotTxnInfo.kwargs.proposal_idx || ballotTxnInfo.kwargs.choice_idx === ""){
            toast_store.set({show: true, error: true, title:"Input Error", message:"No selected choice!"})
            return
        }

        toast_store.set({show: true, title:"Transacton State", pending:true, message:"Pending"})

        $lwc_store.sendTransaction(ballotTxnInfo, handleTxnInfo)

        console.log(ballotTxnInfo)
        
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
            }

            box.checked?ballotTxnInfo.kwargs.choice_idx = parseInt(box.value):ballotTxnInfo.kwargs.choice_idx = "";
            ballotTxnInfo.kwargs.proposal_idx = parseInt(box.name)
        }

    })

</script>


<div style="margin-top: 3vw; font-size: var(--units-1_14vw);">
    
    <ol type="A">
        {#each choices as choice}
            
        <!--TODO: leave a little space between list bullet and border-->
    
            <div id={calcIndex(choice.choiceIdx)} 
                class="choice mb-1" class:selected={calcIndex(choice.choiceIdx) === bgId}>  
                
                <li >
                    
                    <div class="flex row space-between">
                        <label for="choice">{choice.choice}</label>
                        <input 
                            id = {calcIndex(choice.choiceIdx)}
                            type="checkbox" 
                            class="checkbox"
                            bind:group={group} 
                            name={choice.proposalId}
                            value={choice.choiceIdx} 
                            on:click={selectOne}
                            on:click={(e)=>{
                                e.target.checked? bgId = e.target.id : bgId = "0";
                            }}/>
                            
                    </div>
                    
                </li>
                
            </div> 

        {/each}

    </ol>

    <div class="flex row center">
        <button class=" outlined primary white" on:click={submitSelectedChoice}>
            <div>Cast Vote</div>
        </button>
    </div>    

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
    .choice {
        padding: 0.7em 0 0.7em 0; 
        border: 3px solid var(--background-color);
    }

    input[type=checkbox] {
        width: 20px;
        height: 20px;
    }
    .selected {
        background-color: var(--background-color);
    }
    
</style>
