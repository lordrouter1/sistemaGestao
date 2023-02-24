module.exports = (io,socket) => {
    socket.on('ping',()=>{console.log('pong')});
}
