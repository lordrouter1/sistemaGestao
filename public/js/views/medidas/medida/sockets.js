socket.on('medida-resp',(resp)=>{
    Swal.fire({
        icon:(resp['success'])?'success':'error',
        showConfirmButton: false,
        title:(resp['success'])?'Transação sucedida':resp['err'],
        timer: 1500
    }).then(()=>{if(resp['success']){location.href='/medidas'}});
});