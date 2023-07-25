$(document).ready(()=>{
    $(`#principal`).on(`click`,`[fornecedor]`,(self)=>{
        socket.emit('getFornecedorModal',$(self.currentTarget).attr(`fornecedor`));
    });
});

new gridjs.Grid({
    columns: [
        {
            data:(row) => row.razaoSocial,
            name: "Nome/Razão Social",
        },
        {
            data:(row) => row.nomeFantasia,
            name: "Nome Fantasia",
        },
        {
            data:(row) => (row.contato.padrao.findIndex((e)=>e==`1`) >= 0) ?row.contato.contato[row.contato.padrao.findIndex((e)=>e==`1`)]:row.contato.contato[0],
            name: "Contato",
        },
        {
            data:(row) => row.responsavel.nome,
            name: "Responsável",
        },
        {
            id:'_id',
            name:'',
            formatter:(cell) => gridjs.html(`
                <a href="/fornecedores/editar/${cell}" class="btn btn-primary"><i class="fa-solid fa-pen"></i></a>
                <!--<button fornecedor="${cell}" class="btn btn-secondary"><i class="fa-solid fa-eye"></i></button>-->
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