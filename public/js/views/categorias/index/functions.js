function modalCategoria(id){
    socket.emit('getCategoriaModal',id);
}