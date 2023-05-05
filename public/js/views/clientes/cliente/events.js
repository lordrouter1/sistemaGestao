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

$('#inp_pessoa').change(()=>{
    let val = $('#inp_pessoa option:selected').val();
    
    if(val == 2){
        $("[pj]").val("");
        $("[pj]").attr('disabled','');
        $("[pf]").removeAttr('disabled');
    }
    else{
        $("[pj]").removeAttr('disabled');
        $("[pf]").val("");
        $("[pf]").attr('disabled','');
    }
});

$('#inp_mei').change(()=>{
    let val = $('#inp_mei option:selected').val();

    if(val == 1){
        $('#inp_enquadramento').attr('disabled','');
        $('#inp_tipo').attr('disabled','');
        $('#inp_ie').attr('disabled','');
    }
    else{
        $('#inp_enquadramento').removeAttr('disabled');
        $('#inp_tipo').removeAttr('disabled');
        $('#inp_ie').removeAttr('disabled');
    }
});

$('#inp_tipoContato').change(()=>{
    if($("#inp_tipoContato :selected").hasClass('tellMask')){
        $('#inp_contato').mask('(99) 99999-9999');
    }else{
        $('#inp_contato').unmask();
    }
});

$('#inp_pixTipo').change(()=>{
    switch($('#inp_pixTipo').val()){
        case 'cpf':
            $("#inp_pixChave").mask('999.999.999-99');
            break;
        case 'cnpj':
            $("#inp_pixChave").mask('99.999.999/9999-99');
            break;
        case 'celular':
            $("#inp_pixChave").mask('(99) 99999-9999');
            break;
        case 'email':
            $("#inp_pixChave").unmask();
            break;
        case 'aleatoria':
            $("#inp_pixChave").mask('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',{translation:{'x':{pattern: /[0-9a-zA-Z]/}}});
            break;

    }
});

$('#btn_addContato').click(()=>{
    $("#tbl_contato").append(`
    <tr>
        <td class="w-25"><input type="text" value="`+$('#inp_tipoContato').val()+`" class="form-control" disabled></td>
        <td><input type="text" value="`+$("#inp_contato").val()+`" class="form-control" disabled></td>
        <td><select class="form-control"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger" onclick="delThis(this)"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_contato").val('');
    $("#inp_contato").focus();
});

$('#btn_addEndereco').click(()=>{
    $("#tbl_endereco").append(`
    <tr>
        <td><input class="form-control" value="`+$('#inp_cep').val()+`" disabled></td>
        <td><input class="form-control" value="`+$('#inp_endereco').val()+`" disabled></td>
        <td><input class="form-control" value="`+$('#inp_numero').val()+`" disabled></td>
        <td><input class="form-control" value="`+$('#inp_complemento').val()+`" disabled></td>
        <td><select class="form-control"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger" onclick="delThis(this)"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_cep").val('');
    $("#inp_endereco").val('');
    $("#inp_numero").val('');
    $("#inp_complemento").val('');
    $("#inp_cep").focus();
});

$('#btn_addBanco').click(()=>{
    $("#tbl_banco").append(`
    <tr>
        <td><input type="text" class="form-control" value="`+$("#inp_bancoCodigo").val()+`" disabled></td>
        <td><input type="text" value="`+$("#inp_bancoTipoConta").val()+`" class="form-control" disabled></td>
        <td><input type="text" value="`+$("#inp_bancoAgencia").val()+`" class="form-control" disabled></td>
        <td><input type="text" value="`+$("#inp_bancoConta").val()+`" class="form-control" disabled></td>
        <td><select class="form-control"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger" onclick="delThis(this)"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_bancoCodigo").val('');
    $("#inp_bancoTipoConta").val('');
    $("#inp_bancoAgencia").val('');
    $("#inp_bancoConta").val('');
    $("#inp_bancoCodigo").focus();
});

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