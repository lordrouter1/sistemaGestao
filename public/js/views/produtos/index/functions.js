function modalCliente(id){
    socket.emit('getClienteModal',id);
}

new gridjs.Grid({
    columns: [
        {
            id:'nome',
            name: "Nome",
        },
        {
            id:'descricao',
            name: "Descrição",
        },
        {
            id:'_id',
            name:'',
            formatter:(cell) => gridjs.html(`<a href="/produtos/editar/${cell}" class="btn btn-primary"><i class="fa-solid fa-pen"></i></a>`),
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