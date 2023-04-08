module.exports = (io,socket,con) => {
    socket.on('ping',()=>{console.log('pong!')});
}
