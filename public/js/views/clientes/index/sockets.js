socket.on('getClienteModal-resp',(_data)=>{
    let data = _data;
    $('#mdl_razaosocial').text(data['razaoSocial']);

    $('#mdl_pessoa').text((data['classificacao']['pessoa']==undefined)?'':data['classificacao']['pessoa'].replace('1','Jurídica').replace('2','Física'));
    $('#mdl_mei').text((data['classificacao']['mei']==undefined)?'':data['classificacao']['mei'].replace('0','Não').replace('1','Sim'));
    $('#mdl_tipo').text((data['classificacao']['tipo']==undefined)?'':data['classificacao']['tipo'].replace('0','Sociedade Limitada (LTDA)').replace('1','Empresa individual (EI)').replace('2','Empresa individual de responsabilidade limitada (EIRELI)').replace('3','Sociedade anônima (SA)'));
    $('#mdl_enquadramento').text((data['classificacao']['enquadramento']==undefined)?'':data['classificacao']['enquadramento'].replace('1','Simples Nacional').replace('2','Lucro Presumido').replace('3','Lucro Real'));
    $('#mdl_fornecedor').text(data['classificacao']['fornecedor'].replace('0','Não').replace('1','Sim'));
    
    $('#mdl_razaoSocial').text(data['razaoSocial']);
    $('#mdl_nomeFantasia').text(data['nomeFantasia']);
    $('#mdl_cpf').text(data['cpf']);
    $('#mdl_cnpj').text(data['cnpj']);
    $('#mdl_ie').text(data['ie']);

    $('#mdl_respNome').text(data['responsavel']['nome']);
    $('#mdl_respCargo').text(data['responsavel']['cargo']);
    $('#mdl_respCpf').text(data['responsavel']['cpf']);

    $('#mdl_obs').text(data['obs']);
    
    $('#mdl_endereco').empty();
    data['endereco'].map(r => $('#mdl_endereco').append(`
        <div class="border rounded p-2 mt-2 bg-light">
            <div class="row">
                <div class="col-2">
                    <label for="">CEP:</label>
                    <strong>${r['cep']}</strong>
                </div>
                <div class="col">
                    <label for="">Endereco:</label>
                    <strong>${r['endereco']}</strong>
                </div>
                <div class="col-2">
                    <label for="">Número:</label>
                    <strong>${r['numero']}</strong>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="">Complemento:</label>
                    <strong>${r['complemento']}</strong>
                </div>
                <div class="col-2">
                    <label for="">Padrao:</label>
                    <strong>${r['padrao'].replace('0','Não').replace('1','Sim')}</strong>
                </div>
            </div>
        </div>
    `));

    $('#mdl_contato').empty();
    data['contato'].map(r => $('#mdl_contato').append(`
        <div class="border rounded p-2 mt-2 bg-light">
            <div class="row">
                <div class="col">
                    <label>Tipo:</label>
                    <strong>${r['tipo']}</strong>
                </div>
                <div class="col">
                    <label>Contato:</label>
                    <strong>${r['contato']}</strong>
                </div>
                <div class="col">
                    <label>Padrão:</label>
                    <strong>${r['padrao'].replace('0','Não').replace('1','Sim')}</strong>
                </div>
            </div>
        </div>
    `));

    $('#mdl_pix').empty();
    data['pix'].map(r => $('#mdl_pix').append(`
        <div class="border rounded p-2 mt-2 bg-light">
            <div class="row">
                <div class="col">
                    <label>Tipo:</label>
                    <strong>${r['tipo']}</strong>
                </div>
                <div class="col">
                    <label>Chave:</label>
                    <strong>${r['chave']}</strong>
                </div>
                <div class="col">
                    <label>Padrão:</label>
                    <strong>${r['padrao'].replace('0','Não').replace('1','Sim')}</strong>
                </div>
            </div>
        </div>
    `));

    $('#mdl_banco').empty();
    data['banco'].map(r => $('#mdl_banco').append(`
        <div class="border rounded p-2 mt-2">
            <div class="row">
                <div class="col">
                    <label>Instituição:</label>
                    <strong>${r['instituicao']}</strong>
                </div>
                <div class="col-4">
                    <label>Conta:</label>
                    <strong>${r['conta']}</strong>
                </div>
                <div class="col-2">
                    <label>Padrão:</label>
                    <strong>${r['padrao'].replace('0','Não').replace('1','Sim')}</strong>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label>Agência:</label>
                    <strong>${r['agencia']}</strong>
                </div>
                <div class="col">
                    <label>Número:</label>
                    <strong>${r['numero']}</strong>
                </div>
            </div>
        </div>
    `));

    $("#mdl_cliente").modal();
});