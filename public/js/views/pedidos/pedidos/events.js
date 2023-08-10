
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
    