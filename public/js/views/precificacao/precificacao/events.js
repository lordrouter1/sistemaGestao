
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
        let root = $(this).parent().parent().parent();
        $(root.find('.varList')).empty();
        $(root.find('.btnAdicionar')).show();
        $(root.find('.nome')).val(root.find('.produto option:selected').text());
        if($(this).val() != ''){
            fetch(`/precificacao/get/variacoes/${$(this).val()}/${$('[name="csrfToken"]').val()}`).then(r=>r.json()).then(r=>{
                root.attr('cont',0);
                root.attr('data',JSON.stringify(r));
                novaVar(root);
                $('#btnAdicionar').show();
            }); 
        }
    });

    $(document).on('click','.btnAdicionar',function(){
        novaVar($(this).parent());
    });

    $('#addProd').click(function(){
        let cont = $('#prodList').attr('cont');
        let novo = $('#prodModel .dProd').clone();
        novo.find('[nome]').attr('name',`produto[${cont}][nome]`);
        novo.find('[produto]').attr('name',`produto[${cont}][codigo]`);
        novo.attr('codigo',cont);
        novo.appendTo('#prodList');
        $('#prodList').attr('cont',++cont);
    });

});