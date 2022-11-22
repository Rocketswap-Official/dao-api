<script lang="ts">
    import { fly } from 'svelte/transition';
    import { toast_store } from '../store'

    export let toast_data: any;
    
</script>

{#if toast_data.show}
    <div transition:fly='{{x:120, duration: 600}}' class="toast-container {toast_data.error?'error':'success'}">
        
        <img class="close" src="svg/close-x-white.svg" alt="close" on:click={()=>toast_store.set({show:false})} on:keyup={()=>toast_store.set({show:false})}/>
        
        <h3 class="title">
            {toast_data.title}
        </h3>
        <div class="message-area flex align-center">
            {#if toast_data?.pending}
                <img class="gif" src="Iphone-spinner-2.gif" alt="spinner"/>
            {/if}
            
            {toast_data.message}
            
        </div>
        
    </div>
        
{/if}

<style>
    .toast-container {
        position: fixed;
        width: 250px;
        border-radius: 5px;
        padding: 0.4em 1em 2em 1em;
        right: 0.7em; 
        z-index: 100;
    }
    .close{
        position: absolute;
        top: 1em;
        width: 1.5em;
        /* font-size: 24px;
        font-weight: 850; */
        right: 1em;
        cursor: pointer;
    }
    .title {
        font-weight: 800;
        font-size: var(--units-1_2vw);
    }
    .message-area{
        font-size: var(--units-1vw);
    }
    .success {
        background-color: rgb(62,158,100);
    }
    .error {
        background-color: rgb(234,76,28);
    }
    .gif {
        width: 30px;
    }
</style>