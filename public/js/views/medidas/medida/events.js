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
            socket.emit('delMedida',$('#inp_id').val());
        };
    });
});

$('#btn_addGrandeza').click(()=>{
    console.log('$');
    $("#tbl_grandezas").append(`
    <tr>
        <td><input type="text" value="`+$("#inp_grandezaNome").val()+`" class="form-control" disabled></td>
        <td><input type="text" value="`+$("#inp_grandezaSimbolo").val()+`" class="form-control" disabled></td>
        <td class="d-flex"><span class="m-auto">1 ${$('#inp_grandezaSimbolo').val()} = </span> <input type="text" value="`+$("#inp_grandezaProporcao").val()+`" class="form-control w-50" disabled><span class="m-auto"> ${$('#inp_simbolo').val()}</span></td>
        <td><button type="button" class="btn btn-danger" onclick="delThis(this)"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_grandezaNome").val('');
    $("#inp_grandezaSimbolo").val('');
    $("#inp_grandezaProporcao").val('');

    $("#inp_grandezaNome").focus();
});