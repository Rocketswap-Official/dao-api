//labels
export const pieLabels = ["A","B", "C", "D", "E"];

//colours
export const pieColours = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)'
    //TODO: add one more colour
];

//configurations
export const pieOptions = {
    maintainAspectRatio: false,
    elements: {
        arc:{
            borderWidth: 0
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }

};
