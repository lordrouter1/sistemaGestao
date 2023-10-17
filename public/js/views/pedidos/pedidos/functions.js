
function delThis(self){
    $(self).parent().parent().remove();
}

function calTot(self){
    let inc = 0.00;
    let linha = $(self).parent().parent();
    linha.find('[total]').val((linha.find('[qtd]').val()*linha.find('[preco]').val()).toFixed(2));
    $('[total]').toArray().forEach(r => inc += parseFloat($(r).val()));
    $('#valTot').val(inc.toFixed(2));
}

$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
        calTot(this);
    });

    $("#multi-state-toggle .btn").click(function () {
        $("#multi-state-toggle .btn").addClass("btn-secondary");
        $("#multi-state-toggle .btn").removeClass("btn-light");
        $(this).addClass("btn-light");
        $(this).removeClass("btn-secondary");
    });
});
    