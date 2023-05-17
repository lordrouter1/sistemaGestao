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
    //console.log(btoa(new XMLSerializer().serializeToString($('#inp_codigoDeBarras')[0])));
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

/*
$('#btn_addPix').click(()=>{
    $("#tbl_pix").append(`
    <tr>
        <td class="w-25"><input type="text" class="form-control" value="`+$('#inp_pixTipo').val()+`" disabled></td>
        <td><input type="text" value="`+$('#inp_pixChave').val()+`" class="form-control" disabled></td>
        <td><select class="form-control"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger" onclick="delThis(this)"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_pixTipo").val('');
    $("#inp_pixChave").val('');
    $("#inp_pixChave").focus();
});
*/