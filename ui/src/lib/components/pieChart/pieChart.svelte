<script lang="ts">
    import Chart from 'chart.js/auto';
    //import ChartDataLabels from 'chartjs-plugin-datalabels';
    import { pieOptions } from './pie';
    import { onMount } from 'svelte';

    export let labels: string[];
    export let weights: number[];
    export let backgroundColor: string[];

    const data = {
        labels: labels,

        datasets: [{
            label: 'Voting Weight',
            data: weights,
            backgroundColor: backgroundColor
            //hoverOffset: 4
        }]
    };

    
    const pieConfig: any = {
        type: 'pie',
        data: data,
        options: pieOptions
        //plugins: [ChartDataLabels]
    };

    let myChart: any;

    onMount(()=>{
        const pie = new Chart(
            myChart,
            pieConfig
           
        );
        //pie.ctx.translate(30, 0)
        
    })
    

</script>

    <div class="canvas-container">
        <canvas bind:this={myChart}></canvas>
    </div>
    


<style>
    canvas {
        position: relative;
        /* width: 12vw;  */
        width: 10vw;
    }
    
</style>
  