if(!window.prov){
    const mmsdk = new MetaMaskSDK.MetaMaskSDK();
    window.prov = mmsdk.getProvider();
    console.log('entrou');
}

$(document).ready(()=>{
    $('#256').focus();

    $(`#inp_cpf`).mask(`999.999.999-99`);
    $(`#inp_cel`).mask(`(99)99999-9999`);
    $(`#inp_cnpj`).mask(`99.999.999/9999-99`);
    $(`#inp_empTel`).mask(`(99)99999-9999`);

    $("#648").click(async ()=>{
        const provider = await mmsdk.getProvider();
        await provider.send('eth_requestAccounts');
        provider.send('personal_sign',[$('#205').val(),provider.selectedAddress]).then(async (r)=>{
            setTimeout(mmsdk.terminate(),2000);
            $.ajax({
                type: "POST",
                url: '/login',
                data: JSON.stringify({data:r.result}),
                contentType: 'application/json',
                success:(data)=>{
                    if(data){
                        location.href = '/';
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Email ou senha invalido!',
                        });
                    }
                }
            });
        });
    });

    $("#btn-next").click(function(){
        let next = parseInt($('.body-item.active').attr('data-id')) + 1;
        $('.body-item.active').removeClass('active').addClass('d-none');
        $(`.body-item[data-id="${next}"]`).removeClass('d-none').addClass('active');
    });

});