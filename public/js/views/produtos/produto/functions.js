$(document).ready(function(){
    $(document).on(`click`,`.delButton`,function(t){
        console.log(`tes`);
        $(t.currentTarget).parent().parent().remove();
    });
});