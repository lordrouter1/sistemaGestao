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
                url:`/medidas/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/medidas`;
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

$('#btn_addGrandeza').click(()=>{
    $("#tbl_grandezas").append(`
    <tr>
        <td><input type="text" name="grandeza[nome]" value="`+$("#inp_grandezaNome").val()+`" class="form-control" readonly="readonly"></td>
        <td><input type="text" name="grandeza[simbolo]" value="`+$("#inp_grandezaSimbolo").val()+`" class="form-control" readonly="readonly"></td>
        <td class="d-flex"><span class="m-auto">1 ${$('#inp_grandezaSimbolo').val()} = </span> <input type="text" name="grandeza[proporcao]" value="`+$("#inp_grandezaProporcao").val()+`" class="form-control w-50" readonly="readonly"><span class="m-auto"> ${$('#simbolo').val()}</span></td>
        <td><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_grandezaNome").val('');
    $("#inp_grandezaSimbolo").val('');
    $("#inp_grandezaProporcao").val('');

    $("#inp_grandezaNome").focus();
});