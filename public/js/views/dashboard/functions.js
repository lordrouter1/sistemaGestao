var chart1 = new Chart($('#chart_1'),{
    type:'doughnut',
    data: {
        labels: ['Pedidos', 'Orçamentos'],
        datasets: [
            {
                data: [34,7],
                borderWidth: 1,
                backgroundColor: ['#295872','#b5d3e3']
            },
        ]
    },
    options:{
        plugins:{
            legend:{
                display: false,
            }
        }
    }
});