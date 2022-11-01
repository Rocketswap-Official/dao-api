<script lang="ts">
    //import some icons

    export let title: string;
    export let message: string;
    export let errorMessage: string;
    export let showToast: boolean = false;
</script>

{#if showToast}
    <div class="toast-container {errorMessage?'error':'success'}">
        
        <div class="times" on:click={()=>showToast=false}>&times</div>
        
        <h3 class="title">
            {title}
        </h3>
        <div class="message-area">
            {#if errorMessage}
                {errorMessage}
            {:else}
                {message}
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
    }
    .times{
        position: absolute;
        top: 0;
        font-size: 24px;
        font-weight: 850;
        right: 0.3em;
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