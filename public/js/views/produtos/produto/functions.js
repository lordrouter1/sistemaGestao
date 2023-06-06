$('#inp_cpf').mask('999.999.999-99');
$('#inp_respCpf').mask('999.999.999-99');
$('#inp_cnpj').mask('99.999.999/9999-99');
$("#inp_cep").mask('99.999-999');
$('#inp_contato').mask('(99) 99999-9999');
$('#inp_bancoAgencia').mask('9999');
$('#inp_bancoConta').mask('9999999-9');
$("#inp_pixChave").mask('999.999.999-99');
$("#inp_razaoSocial").focus();

function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $('#form_cadastro').submit((e)=>{
        e.preventDefault();
        if($('#inp_id').val() == ""){
            socket.emit('addUsr',JSON.stringify($(e.target).serializeArray()));
        }
        else{
            Swal.fire({
                title:'Deseja salvar a edição?',
                showCancelButton: true,
                confirmButtonText: 'Salvar',
                cancelButtonText: 'Cancelar',
            }).then((resp)=>{
                if(resp.isConfirmed){
                    socket.emit('editUsr',{form:JSON.stringify($(e.target).serializeArray()),id:$('#inp_id').val()});
                };
            });
        }
    });

    socket.on('addUser-resp',(resp)=>{
        Swal.fire({
            icon:(resp['success'])?'success':'error',
            showConfirmButton: false,
            title:(resp['success'])?'Cliente salvo':resp['err'],
            timer: 1500
        }).then(()=>{if(resp['success']){location.href='/clientes'}});
    });
});