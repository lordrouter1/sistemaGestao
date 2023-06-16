$("#btn_excluir").click(()=>{
    Swal.fire({
        icon:'warning',
        title: $('#inp_nome').val(),
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

$('#btn_addVar').click(()=>{
    $("#tbl_variacao").append(`
        <div class="row mt-3">
            <div class="col">
                <input type="text" name="inp_varNome[]" class="form-control" placeholder="Nome da variação">
            </div>
            `+($(`#inp_cor`).val()==`1`?`
            <div class="col-1">
                <input type="color" name="inp_varCor" class="btn border">
            </div>
            `:`<div class="col-1"></div>`)+`
           <div class="col-1">
                <button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `);
});

$(`#inp_cor`).change((r)=>{
    if($($(r.currentTarget).find(`:selected`)).val() == 0){
        $(`#inp_varCor`).attr(`disabled`,``);
        $(`#inp_varCor`).addClass(`d-none`);
    }
    else{
        $(`#inp_varCor`).removeAttr(`disabled`);
        $(`#inp_varCor`).removeClass(`d-none`);
    }
});