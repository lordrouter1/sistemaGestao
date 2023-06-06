$(document).ready(function(){

    function toJson(){
        let subs = $("#tbl_sub tr");
        let resp = {
            nome:$('#inp_nome').val(),
            descricao:$('#inp_descricao').val(),
            ativo:$('#inp_ativo').val(),
            subcategoria:[]
        };
        for(let i = 0;i < subs.length;i++){
            resp.subcategoria.push({
                nome: $(subs[i]).find('input').val(),
                ativo: $(subs[i]).find('select').val()
            });
        }
        
        return JSON.stringify(resp);
    }

    $('#form_cadastro').submit((e)=>{
        e.preventDefault();
        if($('#inp_id').val() == ""){
            socket.emit('addCategoria',toJson());
        }
        else{
            Swal.fire({
                title:'Deseja salvar a edição?',
                showCancelButton: true,
                confirmButtonText: 'Salvar',
                cancelButtonText: 'Cancelar',
            }).then((resp)=>{
                if(resp.isConfirmed){
                    socket.emit('editCategoria',{form:toJson(),id:$('#inp_id').val()});
                };
            });
        }
    });

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
            <td><input type="text" value="`+$("#inp_subNome").val()+`" class="form-control"></td>
            <td><select class="form-control"><option value="1">Sim</option><option value="0">Nao</option></select></td>
        </tr>
        `);
        $("#inp_subNome").val('');
        $("#inp_subNome").focus();
    });

    socket.on('categoria-resp',(resp)=>{
        Swal.fire({
            icon:(resp['success'])?'success':'error',
            showConfirmButton: false,
            title:(resp['success'])?'Transação sucedida':resp['err'],
            timer: 1500
        }).then(()=>{if(resp['success']){location.href='/categorias'}});
    });

});