<script>
    //import { createProposal } from "$lib/js/contractMethodCalls.js"
    import { onMount } from "svelte";
    import Plus from '$lib/svg/plus.svg';

    let title = ''; 
    let description = '';
    let date_decision = '' ;
    //let choice0 = '';
    let i = 0;
    let choiceObj = {id: i, text: ''}
    let choices = [];
    //$: choiceArray = [choice0];

    const addChoice = () =>{
        if(choices.length==3){
            return
        };
        i = i+1
		choiceObj.id = i;			
		choices = [...choices,choiceObj];
		choiceObj  = {id: i, text: ''};
		
	}

    const delChoice = (id) =>{
		choices = choices.filter(item =>item.id !== id); 
	}


    //let submit;
    let buttonText = 'submit'

    const submitNewProposal = ()=>{
        //submit(title, description, date_decision, choiceArray);
        return
    }

    onMount(()=>{
        //submit = createProposal;

        document.addEventListener('lamdenWalletTxStatus', async(response) => {
            let data = await response.detail.data
            if (data.resultInfo.type === 'error') {
                
                console.log(data.resultInfo)
            }
            if (Object.keys(data.txBlockResult).length > 0){
                if (data.txBlockResult.result === "None"){
                    buttonText = 'Submitted!'
                    setTimeout(()=>{
                        buttonText = 'submit'
                    }, 2000)
                    
                }
            }
            console.log(data)
            
            //data.resultInfo.title: "Transaction Pending" 
            //data.resultInfo.title: "Transaction Successful"
            //data.resultInfo.subtitle: "Your transaction used 1 stamps"
            //data.resultInfo.type: "success"
            
                
        });
    });

</script>

<form class="form panel flex col" on:submit|preventDefault={submitNewProposal}>
    <label for="title">title</label><br>
    <input type="text" bind:value={title} style=" margin-bottom: 2em;"><br>
    <label for="description">description</label><br>
    <textarea bind:value={description}></textarea><br>
    <label for="date_decision">date_decision</label><br>
    <span>
        <input type="date" bind:value={date_decision}>
    </span><br>

    <div class="choices">
        <label for="choices">choices</label><br>
        <div class="flex space-between">
            <input type="text"  style="width: 100%; margin-right: 0.5em;">
            <button class="outlined white" on:click={addChoice}>
                <div>
                    <!--image class="svg" src={Plus} alt="plus"/-->
                    +
                </div>
            </button>
        </div> 
        {#each choices as choice }
        <div class="flex space-between" style="margin-top: 1em">
            <input type="text" bind:value={choice.text} style="width: 100%; margin-right: 0.5em;">
            <button class="outlined white" on:click={delChoice(choice.id)}>
                <div>
                    <!--image class="svg" src={Plus} alt="plus"/-->
                    -
                </div>
            </button>
        </div> 
        
        
        {/each}   
            
            
    </div>

    <div class="flex col center">
        <input type="submit"  
            class="outlined"
            value={buttonText} 
            style="width: 50%; padding: 5px 0 5px 0; margin:auto"
        >
    </div>
    
    
</form>

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
    button .svg{
        width: 2em;
        height: 2em;    
    }
input[type="submit"].outlined{
	border: none;
	border-radius: var(--units-07vw);
	font-weight: 500;
    font-size: var(--units-1_14vw);
	padding: var(--units-016vw);
	background: var(--primary-gradient);
    cursor: pointer;
}
/* input[type="submit"].outlined{
	border-radius: var(--units-065vw);
    background: var(--panel-background-color);
    padding: var(--units-06vw) var(--units-3_6vw);
	cursor: pointer;
} */
    
</style>