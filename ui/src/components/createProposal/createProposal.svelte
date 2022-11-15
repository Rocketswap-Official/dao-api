<script lang="ts">
    //import { createProposal } from "$lib/js/contractMethodCalls.js"
    import { proposalTxnInfo, processChoices, type I_ChoicesObj } from './createProposal'
    import { onMount } from "svelte";
    //import Plus from '$lib/svg/plus.svg';
    
    let i = 0;
    
    let choiceObj = {id: i, text: ''}
    let choices: I_ChoicesObj[] = [];
    

    const addChoice = ()=>{
        if(choices.length==4){
            return
        }

        choiceObj.id = i;				
		choices = [...choices,choiceObj]
        choiceObj = {id: i, text: ''}
        i = i + 1
    }

    const delChoice = (id: number) =>{
		choices = choices.filter(item =>item.id !==id)
	}


    //let submit;
    let buttonText = 'submit'

    const submitNewProposal = ()=>{
        
        let c = processChoices(choices)
        proposalTxnInfo.kwargs.choices = [...c]
        console.log(proposalTxnInfo)
    }

</script>

<div class="form panel flex col" >
    <label for="title">title</label><br>
    <input type="text" bind:value={proposalTxnInfo.kwargs.title} style=" margin-bottom: 2em;"><br>
    <label for="description">description</label><br>
    <textarea bind:value={proposalTxnInfo.kwargs.description}></textarea><br>
    <label for="date_decision">date_decision</label><br>
    <span>
        <input type="date" bind:value={proposalTxnInfo.kwargs.date_decision}>
    </span><br>

    <div id="choices" class="choices">
        <div class="flex space-between">
            <label for="choices">choices</label>
            <button class="outlined white" on:click={addChoice}>
                <div> + </div>
            </button>
        </div>
        
            

        {#each choices as choice}
            
            <div class="flex space-between" style="margin-top: 1em">
                <input type="text"  bind:value={choice.text} style="width: 100%; margin-right: 0.5em;">
                <button class="outlined white" on:click={delChoice(choice.id)}>
                    <div> - </div>
                </button>
            </div> 
        {/each}          
            
    </div>

    <div class="flex col center">
        <button
            class="outlined"
            style="width: 50%; padding: 5px 0 5px 0; margin:auto; margin-top: 2em"
            on:click={submitNewProposal}
        >{buttonText} </button>
    </div>
    
    
</div>

<style>
    .form{
        width: 70%;
        margin:auto;
        padding: 2.5vw;
        box-shadow: var(--panel-box-shadow-higher);
        
    } 
    .form textarea {
        margin-bottom: 2em ;
        background-color: transparent;
        outline-style: none; 
        /* outline: 1.2px soild var(--primary-color);  */
        /* border: 1.2px soild var(--primary-color);  */
        color: white;
    }
    .form span{
        margin-bottom: 2em ;
    }
    label {
        font-size: var(--units-1_14vw);
        margin-bottom: 0.25em;
    }
    .choices {
        margin-bottom: 2em ;
        width: 100%;
        padding: 0;
    }
    input[type="text"]{
        background-color: transparent;
        border-style: none;
        outline-style: none;
        border-bottom: 1.2px solid var(--primary-color);
        color: white;
    }
    input[type="date"]{
        background-color: transparent;
        outline-style: none;
        border: 1.2px solid var(--primary-color);
        color: var(--primary-color);
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
        
    }
    button > div {
		padding: var(--units-02vw) var(--units-1_14vw);	
	}
    
    
</style>