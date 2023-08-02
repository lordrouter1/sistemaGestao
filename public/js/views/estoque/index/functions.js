            
new gridjs.Grid({
columns: [
    {
        data: (row) => (row.ativo == 1)?row.nome:gridjs.html(row.nome+' <span class="badge bg-danger text-light">Inativo</span>'),
    },
    {
        id:'_id',
        name:'',
        width: '15%',
        formatter:(cell) => gridjs.html(`
            <a href="/estoque/editar/${cell}" class="btn btn-primary"><i class="fa-solid fa-pen"></i></a>
            <!--<button cliente="${cell}" class="btn btn-secondary"><i class="fa-solid fa-eye"></i></button>-->
        `),
    },
],
data:JSON.parse($('#conData').attr('val')),
search: true,
language:{
    'search':{
        'placeholder': 'Pesquisar',
    },
},
pagination: {
    limit: 10,
    summary: false,
},
}).render(document.getElementById("principal"));
    