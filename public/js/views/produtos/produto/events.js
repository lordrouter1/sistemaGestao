let qrCode = new QRCode(document.getElementById('inp_qrCode'),{
    text:'1234567890123',
    width:128,
    height:128
});
JsBarcode('#inp_codigoDeBarras','1234567890123',{width:1,height:60});
var base = new Image();

$("#btn_excluir").click(()=>{
    Swal.fire({
        icon:'warning',
        title: $('#inp_razaoSocial').val(),
        text:'Deseja Excluir?',
        showCancelButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
    }).then((resp)=>{
       if(resp.isDenied){
            socket.emit('delUsr',$('#inp_id').val());
        };
    });
});

$('#inp_barcodeVal').change(()=>{
    JsBarcode('#inp_codigoDeBarras',$('#inp_barcodeVal').val(),{width:1,height:60});
    qrCode.makeCode($('#inp_barcodeVal').val());
});

$('#inp_foto').change(()=>{
    let file = new FileReader()

    file.onload = function (e){
        $('#inp_fotoSrc').attr('src',e.target.result);
    };
    
    file.readAsDataURL($('#inp_foto').prop('files')[0]);
});

$('#inp_fotoBotao').click(()=>{
    $('#inp_foto').click();
});

$(`#inp_categoria`).change((r)=>{
    let subs = JSON.parse($(r.currentTarget).find(`:selected`).attr(`sub`));
    $(`.optionSub`).remove();
    $(`#inp_subCategoria`).append(subs.map(sub => `<option class="optionSub" value="${sub}">${sub}</option>`).join(``));
});
