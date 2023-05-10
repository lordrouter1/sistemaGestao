function modalCliente(id){
    socket.emit('getClienteModal',id);
}