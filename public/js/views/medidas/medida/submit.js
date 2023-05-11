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
        socket.emit('addMedida',toJson());
    }
    else{
        Swal.fire({
            title:'Deseja salvar a edição?',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
        }).then((resp)=>{
            if(resp.isConfirmed){
                socket.emit('editMedida',{form:toJson(),id:$('#inp_id').val()});
            };
        });
    }
});