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
            $.ajax({
                url:`/clientes/ed/`+$(`#_id`).val(),
                method: `DELETE`,
                statusCode:{
                    200: ()=>{
                        location.href = `/clientes`;
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
        <td class="w-25"><input type="text" name="contato[tipo][]" value="`+$('#inp_tipoContato').val()+`" class="form-control" readonly></td>
        <td><input type="text" name="contato[contato][]" value="`+$("#inp_contato").val()+`" class="form-control" readonly></td>
        <td><select class="form-control" name="contato[padrao][]"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_contato").val('');
    $("#inp_contato").focus();
});

$('#btn_addEndereco').click(()=>{
    $("#tbl_endereco").append(`
    <tr>
        <td><input class="form-control" name="endereco[cep][]" value="`+$('#inp_cep').val()+`" readonly></td>
        <td><input class="form-control" name="endereco[endereco][]" value="`+$('#inp_endereco').val()+`" readonly></td>
        <td><input class="form-control" name="endereco[numero][]" value="`+$('#inp_numero').val()+`" readonly></td>
        <td><input class="form-control" name="endereco[complemento][]" value="`+$('#inp_complemento').val()+`" readonly></td>
        <td><select class="form-control" name="endereco[padrao][]"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></td>
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
        <td><input type="text" name="banco[instituicao][]" class="form-control" value="`+$("#inp_bancoCodigo").val()+`" readonly></td>
        <td><input type="text" name="banco[conta][]" value="`+$("#inp_bancoTipoConta").val()+`" class="form-control" readonly></td>
        <td><input type="text" name="banco[agencia][]" value="`+$("#inp_bancoAgencia").val()+`" class="form-control" readonly></td>
        <td><input type="text" name="banco[numero][]" value="`+$("#inp_bancoConta").val()+`" class="form-control" readonly></td>
        <td><select class="form-control" name="banco[padrao][]"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></td>
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
        <td class="w-25"><input type="text" name="pix[tipo][]" class="form-control" value="`+$('#inp_pixTipo').val()+`" readonly></td>
        <td><input type="text" name="pix[chave][]" value="`+$('#inp_pixChave').val()+`" class="form-control" readonly></td>
        <td><select class="form-control" name="pix[padrao][]"><option value="0">Nao</option><option value="1">Sim</option></select></td>
        <td><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `);
    $("#inp_pixTipo").val('');
    $("#inp_pixChave").val('');
    $("#inp_pixChave").focus();
});