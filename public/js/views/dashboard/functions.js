let chartOpt = {
    plugins:{
        legend:{
            display: false,
        },
    },
    scales: {
        y: {
            display: false
        },
        x: {
            display: false
        }
    }
}
let doughnutOpt = {
    plugins:{
        legend:{
            display: false,
        }
    }
}

var chart1 = new Chart($('#chart_1'),{
    type:'doughnut',
    data: {
        labels: ['Abertos', 'Orçamentos'],
        datasets: [
            {
                data: [34,7],
                borderWidth: 1,
                backgroundColor: ['#295872','#b5d3e3']
            },
        ]
    },
    options:doughnutOpt
});

var chart2 = new Chart($('#chart_2'),{
    type:'line',
    data: {
        labels: ['Janeiro','Fevereiro','Março','Abril'],
        datasets: [
            {
                data: [34,37,28,25],
                backgroundColor: '#295872',
                fill: false,
                tension: 0.1
            },
        ]
    },
    options: chartOpt,
});

var chart3 = new Chart($('#chart_3'),{
    type:'line',
    data: {
        labels: ['Janeiro','Fevereiro','Março','Abril'],
        datasets: [
            {
                data: [14,32,40,56],
                backgroundColor: '#295872',
                fill: false,
                tension: 0.1,
            },
        ]
    },
    options: chartOpt
});

var chart4 = new Chart($('#chart_4'),{
    type:'doughnut',
    data: {
        labels: ['Abertas', 'Vencidas'],
        datasets: [
            {
                data: [20,9],
                borderWidth: 1,
                backgroundColor: ['#295872','#b5d3e3']
            },
        ]
    },
    options:doughnutOpt
});

var chart5 = new Chart($('#chart_5'),{
    type:'line',
    data: {
        labels: ['Janeiro','Fevereiro','Março','Abril'],
        datasets: [
            {
                data: [150,204,365,382],
                backgroundColor: '#295872',
                fill: false,
                tension: 0.1,
            },
        ]
    },
    options: chartOpt
});