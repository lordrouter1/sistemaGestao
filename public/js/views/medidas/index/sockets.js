socket.on('getMedidaModal-resp',(_data)=>{
    let data = _data;

    $('#mdl_nome').empty();
    $('#mdl_nome').append((data['ativo']==1)?data['nome']:data['nome']+' <span class="badge bg-danger text-light">Inativo</span>');

    $('#mdl_simbolo').text(data['simbolo']);

    $('#mdl_grandezas').empty();
    data['grandeza'].map(r => $('#mdl_grandezas').append(`
        <div class="border rounded p-2 mt-2">
            <div class="row">
                <div class="col">
                    <label>Nome:</label>
                    <strong>${r['nome']}</strong>
                </div>
                <div class="col">
                    <label>Simbolo:</label>
                    <strong>${r['simbolo']}</strong>
                </div>
                <div class="col">
                    <label>Proporção:</label>
                    <strong> 1 ${data['simbolo']} = ${r['proporcao']} ${r['simbolo']}</strong>
                </div>
            </div>
        </div>
    `));

    $("#mdl_medida").modal();
});