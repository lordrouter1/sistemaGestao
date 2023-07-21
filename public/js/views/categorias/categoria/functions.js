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
                url:`/categorias/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/categorias`;
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

    $('#btn_addSub').click(function(){
        $("#tbl_sub").append(`
        <tr>
            <td><input name="subcategoria[nome]" type="text" value="`+$("#inp_subNome").val()+`" class="form-control"></td>
            <td><select class="form-control" name="subcategoria[ativo]"><option value="1">Sim</option><option value="0">Nao</option></select></td>
        </tr>
        `);
        $("#inp_subNome").val('');
        $("#inp_subNome").focus();
    });

});