
function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });
});
    