$(document).ready(()=>{
    $('#256').focus();

    $("#648").click(()=>{
        $.ajax({
            type: "POST",
            url: '/login',
            data: JSON.stringify({data:sha256(`${$('#256').val()}:${$('#237').val()}`)}),
            contentType: 'application/json',
            success:(data)=>{
                if(data){
                    location.href = '/';
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email ou senha invalido!',
                    });
                }
            }
        });
    });
});