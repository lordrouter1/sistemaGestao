let qrCode = new QRCode(document.getElementById('qrCode'),{
    text:($(`#barcodeVal`).val()==``?'1234567890123':$(`#barcodeVal`).val()),
    width:128,
    height:128
});
JsBarcode('#codigoDeBarras',($(`#barcodeVal`).val()==``?'1234567890123':$(`#barcodeVal`).val()),{width:1,height:60});
var base = new Image();

$("#btn_excluir").click(()=>{
    Swal.fire({
        icon:'warning',
        title: $('#razaoSocial').val(),
        text:'Deseja Excluir?',
        showCancelButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
    }).then((resp)=>{
        if(resp.isDenied){
            $.ajax({
                url:`/produtos/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/produtos`;
                    },
                    500: ()=>{
                        swal.fire({
                            icon: `error`,
                            title: `Erro ao salvar`
                        });
                    }
                }
            });
        };
    });
});

$('#barcodeVal').change(()=>{
    JsBarcode('#codigoDeBarras',$('#barcodeVal').val(),{width:1,height:60});
    qrCode.makeCode($('#barcodeVal').val());
});

$('#foto').change(()=>{
    let file = new FileReader()

    file.onload = function (e){
        $('#fotoSrc').attr('src',e.target.result);
    };
    
    file.readAsDataURL($('#foto').prop('files')[0]);
});

$('#fotoBotao').click(()=>{
    $('#foto').click();
});

$(`#categoria`).change((r)=>{
    let subs = JSON.parse($(r.currentTarget).find(`:selected`).attr(`sub`));
    $(`.optionSub`).remove();
    $(`#subCategoria`).append(subs.map(sub => `<option class="optionSub" value="${sub}">${sub}</option>`).join(``));
});

$(`#btn_addVar`).click((r)=>{
    $(`#tbl_var`).append(`
        <div class="row mt-3">
            <div class="col">
                <select class="form-control" name="variacoes[]">`+$(`#varOpt`).html()+`</select>
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `);
});