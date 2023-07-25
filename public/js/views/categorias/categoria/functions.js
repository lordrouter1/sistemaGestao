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
           if(resp.isDenied){
                socket.emit('delCategoria',$('#inp_id').val());
            };
        });
    });

    $('#btn_addSub').click(function(){
        $("#tbl_sub").append(`
        <tr>
            <td><input type="text" name="subcategoria[nome]" value="`+$("#inp_subNome").val()+`" class="form-control"></td>
            <td><select class="form-control" name="subcategoria[ativo]"><option value="1">Sim</option><option value="0">Nao</option></select></td>
        </tr>
        `);
        $("#inp_subNome").val('');
        $("#inp_subNome").focus();
    });
});