socket.on('addUser-resp',(resp)=>{
    Swal.fire({
        icon:(resp['success'])?'success':'error',
        showConfirmButton: false,
        title:(resp['success'])?'Cliente salvo':resp['err'],
        timer: 1500
    }).then(()=>{if(resp['success']){location.href='/clientes'}});
});

socket.on('editUser-resp',(resp)=>{
    Swal.fire({
        icon:(resp['success'])?'success':'error',
        showConfirmButton: false,
        title:(resp['success'])?'Edição salva':resp['err'],
        timer: 1500
    }).then(()=>{if(resp['success']){location.href='/clientes'}});
});

socket.on('delUser-resp',(resp)=>{
    Swal.fire({
        icon:(resp['success'])?'success':'error',
        showConfirmButton: false,
        title:(resp['success'])?'Cliente excluido':resp['err'],
        timer: 1500
    }).then(()=>{if(resp['success']){location.href='/clientes'}});
});