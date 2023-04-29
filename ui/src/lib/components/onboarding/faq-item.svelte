<script lang="ts">
    import { fade } from 'svelte/transition';

    // Icons
    import PlusCircle from './icons/plus-circle.svelte';
    import MinusCircle from './icons/minus-circle.svelte';

    export let faqItem: any;

    let showAnswer = false;

    function toggleAnswer(){
        if (!showAnswer) showAnswer = true
        else showAnswer = false
    }

</script>

<div class="container flex col">
    <div class="flex row align-center">
        <p>{faqItem.q}</p>
        <button on:click={toggleAnswer}>
            {#if showAnswer}
                <MinusCircle width="100%" />
            {:else}
                <PlusCircle width="100%" />
            {/if}
        </button>
    </div>

    {#if showAnswer}
        <div in:fade="{{delay: 0, duration: 500}}">
            <p class="text-primary-dim answer">{faqItem.a}</p>
        </div>
    {/if}
</div>

<style>
    .container{
        background: var(--panel-background-highlight);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
    }
    p{
        margin: 0;
        width: 100%;
    }
    button{
        width: 30px;
        height: 30px;
        background-color: transparent;

    }
    .answer{
        margin-top: 0.5rem;
    }

    @media screen and (min-width: 2560px) {
        .container{
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 14px;
            font-size: var(--text-size-xxlarge);
        }
        .answer{
            margin-top: 1rem;
        }
        button{
            width: 40px;
            height: 40px;
        }
	}
</style>