$(document).ready(function(){
    $("#btn_excluir").click(()=>{
        Swal.fire({
            icon:'warning',
            title: $('#inp_nome').val(),
            text:'Deseja Excluir?',
            showCancelButton: true,
            showConfirmButton: false,
            showDenyButton: true,
            denyButtonText: 'Excluir',
            cancelButtonText: 'Cancelar',
        }).then((resp)=>{
            $.ajax({
                url:`/marcas/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/marcas`;
                    },
                    500: ()=>{
                        swal.fire({
                            icon: `error`,
                            title: `Erro ao salvar`
                        });
                    }
                }
            });
        });
    });
});