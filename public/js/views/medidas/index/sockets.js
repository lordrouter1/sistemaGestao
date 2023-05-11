socket.on('getMedidaModal-resp',(_data)=>{
    let data = _data;

    $('#mdl_nome').empty();
    $('#mdl_nome').append((data['ativo']==1)?data['nome']:data['nome']+' <span class="badge bg-danger text-light">Inativo</span>');

    $('#mdl_descricao').text(data['descricao']);

    $("#mdl_medida").modal();
});