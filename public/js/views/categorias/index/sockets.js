socket.on('getCategoriaModal-resp',(_data)=>{
    let data = _data;

    $('#mdl_nome').empty();
    $('#mdl_nome').append((data['ativo']==1)?data['nome']:data['nome']+' <span class="badge bg-danger text-light">Inativo</span>');

    $('#mdl_descricao').text(data['descricao']);

    $('#mdl_sub').empty();
    data['subcategoria'].map(r => $('#mdl_sub').append(`
        <div class="border rounded p-2 mt-2">
            <div class="row">
                <div class="col-2">
                    <label>Ativo:</label>
                    <strong>${(r['ativo'] == "1")?'Sim':'Não'}</strong>
                </div>
                <div class="col">
                    <label>Nome:</label>
                    <strong>${r['nome']}</strong>
                </div>
            </div>
        </div>
    `));

    $("#mdl_categoria").modal();
});