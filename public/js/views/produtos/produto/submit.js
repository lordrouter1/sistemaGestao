function toJson(){
    let contato = $("#tbl_contato tr");
    let endereco = $("#tbl_endereco tr");
    let banco = $("#tbl_banco tr");
    let pix = $("#tbl_pix tr");
    
    let resp = {
        razaoSocial:$('#inp_razaoSocial').val(),
        nomeFantasia:$('#inp_nomeFantasia').val(),
        cpf:$('#inp_cpf').val(),
        cnpj:$('#inp_cnpj').val(),
        ie:$('#inp_ie').val(),
        obs:$('#inp_obs').val(),
        classificacao:{
            pessoa:$('#inp_pessoa').val(),
            mei:$('#inp_mei').val(),
            tipo:$("#inp_tipo").val(),
            enquadramento:$('#inp_enquadramento').val(),
            fornecedor: $('#inp_fornecedor').val(),
        },
        responsavel:{
            nome:$('#inp_respNome').val(),
            cargo:$('#inp_respCargo').val(),
            cpf:$('#inp_respCpf').val(),
        },
        endereco:[],
        contato:[],
        pix:[],
        banco:[],
    };

    for(let i = 0;i < endereco.length;i++){
        let end = $(endereco[i]).find('input');
        resp.endereco.push({
            cep: $(end[0]).val(),
            endereco: $(end[1]).val(),
            numero:$(end[2]).val(),
            complemento: $(end[3]).val(),
            padrao: $(endereco[i]).find('select').val()
        });
    }

    for(let i = 0;i < contato.length;i++){
        let cont = $(contato[i]).find('input');
        resp.contato.push({
            tipo: $(cont[0]).val(),
            contato: $(cont[1]).val(),
            padrao: $(contato[i]).find('select').val()
        });
    }

    for(let i = 0;i < banco.length;i++){
        let ban = $(banco[i]).find('input');
        resp.banco.push({
            instituicao: $(ban[0]).val(),
            conta: $(ban[1]).val(),
            agencia: $(ban[2]).val(),
            numero: $(ban[3]).val(),
            padrao: $(banco[i]).find('select').val()
        });
    }

    for(let i = 0;i < pix.length;i++){
        let temp = $(pix[i]).find('input');
        resp.pix.push({
            tipo: $(temp[0]).val(),
            chave: $(temp[1]).val(),
            padrao: $(pix[i]).find('select').val()
        });
    }

    return JSON.stringify(resp);
}

$('#form_cadastro').submit((e)=>{
    e.preventDefault();
    if($("#tbl_endereco tr").length == 0){
        Swal.fire({
            icon:'warning',
            text:'Informe ao menos um endereco!'
        });
        return;
    }
    if($("#tbl_contato tr").length == 0){
        Swal.fire({
            icon:'warning',
            text:'Informe ao menos um contato!'
        });
        return;
    }
    if($('#inp_id').val() == ""){
        socket.emit('addUsr',toJson());
    }
    else{
        Swal.fire({
            title:'Deseja salvar a edição?',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
        }).then((resp)=>{
            if(resp.isConfirmed){
                socket.emit('editUsr',{form:toJson(),id:$('#inp_id').val()});
            };
        });
    }
});