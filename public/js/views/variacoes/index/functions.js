$(document).ready(()=>{
    $(`#principal`).on(`click`,`[cliente]`,(self)=>{
        socket.emit('getVariacoesModal',$(self.currentTarget).attr(`variacao`));
    });
});

new gridjs.Grid({
    columns: [
        {
            data: (row) => row.inp_nome,
        },
        {
            id:'_id',
            name:'',
            width: '15%',
            formatter:(cell) => gridjs.html(`
                <a href="/variacoes/editar/${cell}" class="btn btn-primary"><i class="fa-solid fa-pen"></i></a>
                <button variacao="${cell}" class="btn btn-secondary"><i class="fa-solid fa-eye"></i></button>
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