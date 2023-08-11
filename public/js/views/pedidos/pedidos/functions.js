
function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });

    $("#multi-state-toggle .btn").click(function () {
        $("#multi-state-toggle .btn").addClass("btn-secondary");
        $("#multi-state-toggle .btn").removeClass("btn-light");
        $(this).addClass("btn-light");
        $(this).removeClass("btn-secondary");
    });
});
    