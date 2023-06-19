$("#btn_excluir").click(()=>{
    Swal.fire({
        icon:'warning',
        title: $('#nome').val(),
        text:'Deseja Excluir?',
        showCancelButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
    }).then((resp)=>{
        if(resp.isDenied){
            $.ajax({
                url:`/variacoes/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/variacoes`;
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

let cont = (parseInt($(`.varCont:last`).val()))+1 || 1;
$('#btn_addVar').click(()=>{
    $("#tbl_variacao").append(`
        <div class="row mt-3">
            <div class="col">
                <input type="text" name="var[`+cont+`][nome]" class="form-control" placeholder="Nome da variação">
                <input type="hidden" name="var[`+cont+`][_id]" value="">
            </div>
            `+($(`#cor`).val()==`1`?`
            <div class="col-1">
                <input type="color" name="var[`+cont+`][cor]" class="btn border">
            </div>
            `:`<div class="col-1"></div>`)+`
           <div class="col-1">
                <button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `);
    cont = cont + 1;
});

$(`#cor`).change((r)=>{
    if($($(r.currentTarget).find(`:selected`)).val() == 0){
        $(`#varCor`).attr(`disabled`,``);
        $(`#varCor`).addClass(`d-none`);
    }
    else{
        $(`#varCor`).removeAttr(`disabled`);
        $(`#varCor`).removeClass(`d-none`);
    }
});