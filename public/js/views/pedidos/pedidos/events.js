$("#btn_excluir").click(()=>{
Swal.fire({
    icon:'warning',
    text:'Deseja Excluir?',
    showCancelButton: true,
    showConfirmButton: false,
    showDenyButton: true,
    denyButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
}).then((resp)=>{
    if(resp.isDenied){
        $.ajax({
            url:`/pedidos/ed/`+$(`#_id`).val()+'/'+$('[name="csrfToken"]').val(),
            method: `DELETE`,
            statusCode:{
                200: ()=>{
                    location.href = `/pedidos`;
                },
                500: ()=>{
                    swal.fire({
                        icon: `error`,
                        title:`Erro ao salvar`
                    });
                }
            }
        });
    };
});
});

$(document).ready(()=>{
    $('#addProduto').click(()=>{
        $('#produtosClone .produtos').clone().appendTo('#listaProdutos');
    });
    
    $(document).on('change','.produtoNome',function(){
        fetch(`/pedidos/get/${$(this).find(':selected').val()}/`).then(r => r.json()).then(r => {
            $(this).parent().parent().find('input[preco]').val(parseFloat(r[0]['valVenda']).toFixed(2));
            $(this).parent().parent().find('input[preco]').attr('title',`Custo R$${parseFloat(r[0]['valCompra']).toFixed(2)}`);
            calTot(this);
        });
    });
    $(document).on('change','[qtd]',function(){calTot(this)});
    $(document).on('change','[preco]',function(){calTot(this)});
});
    