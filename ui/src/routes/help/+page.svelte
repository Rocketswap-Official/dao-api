<script>
    // Components
    import FAQList from '$lib/components/onboarding/faq-items.svelte';
    import GuideItems from '$lib/components/onboarding/guide-items.svelte';

</script>

<style>
    .page-container{
        margin: 0 auto;
        width: 100%;
        max-width: 550px;
        padding-bottom: 10rem;
    }

    @media screen and (min-width: 2560px) {
        .page-container{
            max-width: 1020px;
        }
	}
</style>

<div class="page-container">
    <FAQList />
    <GuideItems />
</div>


