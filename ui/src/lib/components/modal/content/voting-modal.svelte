<script lang="ts">
	import { onMount } from "svelte";



    import { wallet_store, choice_array_store, modal_data_store } from "../../../store"
	//import type { I_Choice } from "src/types/imported-types";

    let idx = $modal_data_store;
    //console.log(idx)
    let choices = $choice_array_store[1]
    

    let choiceOnly = []


    for (let cc of choices){
        if(cc.choice){
            choiceOnly.push(cc.choice) 
        }
    }

    
    //get vk from lamden wallet
    //let vk = $wallet_store;
    let vk = "cccccccccc";
   
    let c = 0

    let selectOne;

    onMount(()=>{
        selectOne = (e: any)=>{
            const box = e.target;
            const group = document.getElementsByClassName("checkbox")
            if(box.checked){
                for (let ele of group){

                    ele.checked = false;
                }
                box.checked = true;
            }else{
                box.checked = false;
            }
        }
    })

    


</script>


<div style="margin-top: 3vw; font-size: var(--units-1_14vw);">
    <ol type="A">
    {#each choices as choice}
        
    <!-- TODO: leave a little space between list bullet and border -->
    <div class="choice mb-1 " class:voted={choice.vk === vk}>   
        <li >
            
            <!--div class="flex row space-between">
                <div style="width: 70%; overflow:hidden">{choice.choice}</div>
                
            </div-->
            <div class="flex row space-between">
                <label for="choice">{choice.choice}</label>
                <input type="checkbox" bind:group={choiceOnly} value={choice.choiceIdx} class="checkbox" on:click={selectOne}/>
            </div>
            
        </li>
           
    </div> 
    {/each}
    </ol>
    
</div>

<div class="flex row center">
    <button class=" outlined primary white">
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
    .checkbox {
        background-color: green;
    }
    
</style>
