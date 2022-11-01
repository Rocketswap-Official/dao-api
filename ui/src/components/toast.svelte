<script lang="ts">
    import { fly } from 'svelte/transition';
    import close_x from '$lib/svg/close-x-white.svg'
    //import some icons

    export let showToast: boolean = false;
    export let toast_data: any;
    
</script>

{#if showToast}
    <div transition:fly='{{x:100, duration: 600}}' class="toast-container {toast_data.errorMessage?'error':'success'}">
        
        <img class="close" src={close_x} alt="close" on:click={()=>showToast=false} on:keyup={()=>showToast=false}/>
        
        <h3 class="title">
            {toast_data.title}
        </h3>
        <div class="message-area">
            {#if toast_data.errorMessage}
                {toast_data.errorMessage}
            {:else}
                {toast_data.message}
            {/if}
        </div>
        
    </div>
        
{/if}

<style>
    .toast-container {
        position: fixed;
        width: 250px;
        border-radius: 5px;
        padding: 0.5em 1em 3.5em 1em;
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
</style>