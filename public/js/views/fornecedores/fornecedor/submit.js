console.log(`teste`);
$(`#form_cadastro`).on( "submit",function(e){
    if($(`#tbl_contato`).children().length == 0){
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Você deve informar ao menos um telefone!',
          })
    }
});