
$(document).ready(function(){
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    $(document).on(`click`,`.delButton`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });

    $(document).on(`FilePond:removefile`,(r)=>{
        console.log($(r.target));
    });

    $(`#imagens`).filepond({
        maxFiles: 5,
        allowMultiple: true,
        allowRemove: true,
        imagePreviewMaxHeight:128,
        acceptedFileTypes: [`image/jpeg`,`image/png`,`image/jpg`],
        labelIdle: `Arraste e solte suas imagens ou <span class="filepond--label-action"> Selecione aqui </span>`,
        labelFileTypeNotAllowed: `Imagem inválida`,
        fileValidateTypeLabelExpectedTypes: `Esperado {allButLastType} ou {lastType}`,
        server:{
            process:`/fUpload`,
            revert: '/fUpload',
            remove: (source, load, error)=>{
                $.ajax({
                    headers: {'Content-Type':'text/plain'},
                    method:`delete`,
                    url:`/fUpload`,
                    dataType:`text`,
                    data: source
                });
                load();
            },
            load:`/public/img/`,
        },
        files:JSON.parse($(`#imgJson`).val()),
    });
});