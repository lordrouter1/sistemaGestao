const { ObjectId } = require("mongodb");

/*
function convertToObj(data){
    let ret = new Object();
    for(let i = 0; i < data.length;i++){
        ret[data[i]['name']] = data[i]['value'];
    };
    return ret;
}
*/

module.exports = (io,socket,cMongoDB) => {
    let usr = cMongoDB.db(socket.request.session.user.database).collection('usuarios');
    let cat = cMongoDB.db(socket.request.session.user.database).collection('categorias');
    let mar = cMongoDB.db(socket.request.session.user.database).collection('marcas');
    let med = cMongoDB.db(socket.request.session.user.database).collection('medidas');

    socket.on('ping',(_data)=>{console.log('pong')});

    // --- GET ---
    socket.on('getClienteModal',(_data)=>{
        let data = _data;
        usr.findOne({_id: new ObjectId(data)}).then((r)=>{
            socket.emit('getClienteModal-resp',r);
        });
    });

    socket.on('getCategoriaModal',(_data)=>{
        let data = _data;
        cat.findOne({_id:new ObjectId(data)}).then((r)=>{
            socket.emit('getCategoriaModal-resp',r);
        });
    });

    socket.on('getMarcaModal',(_data)=>{
        let data = _data;
        mar.findOne({_id:new ObjectId(data)}).then((r)=>{
            socket.emit('getMarcaModal-resp',r);
        });
    });

    socket.on('getMedidaModal',(_data)=>{
        let data = _data;
        med.findOne({_id:new ObjectId(data)}).then((r)=>{
            socket.emit('getMedidaModal-resp',r);
        });
    });

}
