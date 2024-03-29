
function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });

    window.tempVar = JSON.parse($('#metaVar').val());
    window.tempVarCont = $('#metaVarCont').val();
    $('#metaVar').remove();
    $('#metaVarCont').remove();

    sortRows();
});

function sortRows(){
    $("#variacoesHeader").sortable({
        items: ".stripedRow",
        tolerance: "pointer",
        cursor: "move",
        placeholder: "sortable-placeholder",
        start: function(event, ui) {
          ui.placeholder.height(ui.helper.outerHeight());
        },
        stop: function(event,ui){
            $('.stripedRow').each((i,l) => {
               $(l).find('input,select').each((temp,inp) => {
                    $(inp).attr('name',$(inp).attr('name').replace(/\d+/g,i));
                });
            });
        }
    });
}

function novaVar(){
    let r = window.tempVar;
    let temp = $('<div class="row p-2 stripedRow"></div>');
    r.forEach(item => {
        temp.append(`<div class="col"><select class="form-control" name="variacao[${window.tempVarCont}][variacoes][]" required><option selected disabled>${item['nome']}</option>${item['var'].map(v => `<option value="${item['_id']}:${v._id}">${v.nome}</option>`)}</select></div>`);
    });
    temp.append(`<div class="col"><input type="text" name="variacao[${window.tempVarCont}][estoque]" placeholder="Qtd Estoque" class="form-control" required></div>`);
    temp.append(`<div class="col"><input type="text" name="variacao[${window.tempVarCont}][minEstoque]" placeholder="Qtd Min Estoque" class="form-control"></div>`);
    temp.append(`<div class="col-1 d-flex"><button type="button" class="btn btn-danger delButton"><i class="fa-solid fa-trash-can"></i></button><i class=" ml-auto mb-auto mt-auto text-primary fa-solid fa-sort"></i></div>`);

    $('#variacoesHeader').append(temp);
    window.tempVarCont++;
    
    sortRows();
}