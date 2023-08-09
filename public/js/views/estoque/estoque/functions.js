
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
    let temp = $('<div class="row"></div>');
    r.forEach(item => {
        temp.append(`<div class="col"><select class="form-control"><option selected disabled>${item['nome']}</option>${item['var'].map(v => `<option value="${item['_id']}:${v._id}">${v.nome}</option>`)}</select></div>`);
    });
    temp.append(`<div class="col"><input type="text" name="estoque[]" placeholder="Qtd Estoque" class="form-control"></div>`);
    $('#variacoesHeader').append(temp);
}