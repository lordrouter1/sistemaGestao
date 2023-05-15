function toJson(){
    let grandeza = $('#tbl_grandezas tr');

    let resp = {
        nome:$('#inp_nome').val(),
        simbolo:$('#inp_simbolo').val(),
        ativo:$('#inp_ativo').val(),
        grandeza:[],
    };

    for(let i = 0;i < grandeza.length;i++){
        let grand = $(grandeza[i]).find('input');
        resp.grandeza.push({
            nome: $(grand[0]).val(),
            simbolo: $(grand[1]).val(),
            proporcao: $(grand[2]).val(),
        });
    }
    
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