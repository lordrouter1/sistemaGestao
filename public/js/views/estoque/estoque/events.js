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
            url:`/estoque/ed/`+$(`#_id`).val()+'/'+$('[name="csrfToken"]').val(),
            method: `DELETE`,
            statusCode:{
                200: ()=>{
                    location.href = `/estoque`;
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
    $('#produto').change(function(self){
        $('#variacoesHeader').empty();
        $('#btnAdicionar').hide();
        if($(this).val() != ''){
            fetch(`/estoque/get/variacoes/${$(this).val()}/${$('[name="csrfToken"]').val()}`).then(r=>r.json()).then(r=>{
                window.tempVar = r;
                novaVar();
                $('#btnAdicionar').show();
            }); 
        }
    });
});
    