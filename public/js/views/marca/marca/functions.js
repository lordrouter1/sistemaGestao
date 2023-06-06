$(document).ready(function(){
    function toJson(){
        let resp = {
            nome:$('#inp_nome').val(),
            descricao:$('#inp_descricao').val(),
            ativo:$('#inp_ativo').val(),
        };
        
        return JSON.stringify(resp);
    }

    $('#form_cadastro').submit((e)=>{
        e.preventDefault();
        if($('#inp_id').val() == ""){
            socket.emit('addMarca',toJson());
        }
        else{
            Swal.fire({
                title:'Deseja salvar a edição?',
                showCancelButton: true,
                confirmButtonText: 'Salvar',
                cancelButtonText: 'Cancelar',
            }).then((resp)=>{
                if(resp.isConfirmed){
                    socket.emit('editMarca',{form:toJson(),id:$('#inp_id').val()});
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
                socket.emit('delMarca',$('#inp_id').val());
            };
        });
    });

    socket.on('marca-resp',(resp)=>{
        Swal.fire({
            icon:(resp['success'])?'success':'error',
            showConfirmButton: false,
            title:(resp['success'])?'Transação sucedida':resp['err'],
            timer: 1500
        }).then(()=>{if(resp['success']){location.href='/marcas'}});
    });
});