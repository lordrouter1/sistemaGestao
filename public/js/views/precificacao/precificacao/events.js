
$("#btn_excluir").click(()=>{
Swal.fire({
    icon:'warning',
    text:'Deseja Excluir?',
    showCancelButton: true,
    showConfirmButton: false,
    showDenyButton: true,
    denyButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
}).then((resp)=>{
    if(resp.isDenied){
        $.ajax({
            url:`/precificacao/ed/`+$(`#_id`).val()+'/'+$('[name="csrfToken"]').val(),
            method: `DELETE`,
            statusCode:{
                200: ()=>{
                    location.href = `/precificacao`;
                },
                500: ()=>{
                    swal.fire({
                        icon: `error`,
                        title:`Erro ao salvar`
                    });
                }
            }
        });
    };
});
});

$(document).ready(function(){

    $(document).on('change','.produto',function(self){
        let root = $(this).parent().parent().parent()
        $(root.find('.varList')).empty();
        $(root.find('.btnAdicionar')).show();
        $(root.find('.nome')).val(root.find('.produto option:selected').text());
        if($(this).val() != ''){
            fetch(`/precificacao/get/variacoes/${$(this).val()}/${$('[name="csrfToken"]').val()}`).then(r=>r.json()).then(r=>{
                root.attr('cont',0);
                console.log(r);
                root.attr('data',JSON.stringify(r));
                novaVar(root);
                $('#btnAdicionar').show();
            }); 
        }
    });

    $('#addProd').click(function(){
        $('#prodModel .dProd').clone().appendTo('#prodList');
    });

});