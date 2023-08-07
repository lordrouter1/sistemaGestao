const mmsdk = new MetaMaskSDK.MetaMaskSDK();

$(document).ready(()=>{
    $('#256').focus();

    $(`#inp_cpf`).mask(`999.999.999-99`);
    $(`#inp_cel`).mask(`(99)99999-9999`);
    $(`#inp_cnpj`).mask(`99.999.999/9999-99`);
    $(`#inp_empTel`).mask(`(99)99999-9999`);

    $("#648").click(async ()=>{
        $.ajax({
            type: "POST",
            url: '/login',
            data: JSON.stringify({usuario:$('#256').val(),senha:sha256(`${$('#256').val()}:${$('#237').val()}`)}),
            contentType: 'application/json',
            success:(data)=>{
                if(data){
                    location.href = '/';
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email ou senha invalido! Aguarde 5 minutos para tentar novamente',
                    });
                }
            }
        });
    });

    $("#btn-next").click(function(){
        let next = parseInt($('.body-item.active').attr('data-id')) + 1;
        $('.body-item.active').removeClass('active').addClass('d-none');
        $(`.body-item[data-id="${next}"]`).removeClass('d-none').addClass('active');
    });

});