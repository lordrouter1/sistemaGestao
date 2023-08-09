
function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });
});

function novaVar(){
    let r = window.tempVar;
    let temp = $('<div class="row mt-3"></div>');
    r.forEach(item => {
        temp.append(`<div class="col"><select class="form-control" name="variacao[${window.tempVarCont}][variacoes][]" required><option selected disabled>${item['nome']}</option>${item['var'].map(v => `<option value="${item['_id']}:${v._id}">${v.nome}</option>`)}</select></div>`);
    });
    temp.append(`<div class="col"><input type="text" name="variacao[${window.tempVarCont}][estoque]" placeholder="Qtd Estoque" class="form-control" required></div>`);
    temp.append(`<div class="col"><input type="text" name="variacao[${window.tempVarCont}][minEstoque]" placeholder="Qtd Min Estoque" class="form-control"></div>`);
    temp.append(`<div class="col-1"><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button></div>`);

    $('#variacoesHeader').append(temp);
    window.tempVarCont++;
}