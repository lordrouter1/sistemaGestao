$(document).ready(()=>{
    $('#256').focus();

    $(`#inp_cpf`).mask(`999.999.999-99`);
    $(`#inp_cel`).mask(`(99)99999-9999`);
    $(`#inp_cnpj`).mask(`99.999.999/9999-99`);
    $(`#inp_empTel`).mask(`(99)99999-9999`);

    $("#648").click(()=>{
        $.ajax({
            type: "POST",
            url: '/login',
            data: JSON.stringify({usuario:$('#256').val(),senha:sha256(`${$('#256').val()}:${$('#237').val()}`)}),
            contentType: 'application/json',
            success:(data)=>{
                if(data){
                    location.href = '/';
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email ou senha invalido! Aguarde 5 minutos para tentar novamente',
                    });
                }
            }
        });
    });

    $(`#inp_senha2`).change(()=>{
        if($(`#inp_senha`).val()!=$(`#inp_senha2`).val()){
            Swal.fire({icon:`error`,title:`As senhas não conferem`});
        }
    });

    $('#164').click(()=>{
        let req = false;
        $(`input[required]`).each((r,r2)=>{
            if($(r2).val() != ``)
                req = true;
        });

        if($(`#inp_senha`).val()!=$(`#inp_senha2`).val())
            req = false;

        if(req){
            let data = {
                usuario:{
                    email: $(`#inp_email`).val(),
                    senha: sha256(`${$(`#inp_email`).val()}:${$(`#inp_senha`).val()}`),
                    nome: $(`#inp_nome`).val(),
                    cpf: $(`#inp_cpf`).val(),
                    contato: $(`#inp_cel`).val(),
                    database: ``,
                    bloqueado: ``,
                    contBloqueio: 0,
                    ultimoAcesso: ``,
                    permissao: ``,
                },
                empresa:{
                    razaoSocial: $(`#inp_razaoSocial`).val(),
                    nomeFantasia: $(`#inp_nomeFantasia`).val(),
                    cnpj: $(`#inp_cnpj`).val(),
                    ie: $(`#inp_ie`).val(),
                    im: $(`#inp_im`).val(),
                    email: $(`#inp_empEmail`).val(),
                    contato: $(`#inp_empTel`).val()
                },
            }

            $.ajax({
                type: "POST",
                url: '/cadastro',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success:(data)=>{
                    if(data){
                        location.href = '/';
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Não conseguimos realizar o seu cadastro!',
                        });
                    }
                }
            });
        }
        else{
            Swal.fire({
                icon: `info`,
                title: `Preencha todos os campos`
            });
        }
    });

});