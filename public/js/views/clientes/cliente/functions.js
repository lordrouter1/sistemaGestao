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
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });
});