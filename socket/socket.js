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

    // --- ADD ---
    socket.on('addUsr',(_data)=>{
        let data = JSON.parse(_data);
        try{
            usr.findOne((data['cnpj']==undefined)?{cpf:data['cpf']}:{cnpj:data['cnpj']}).then((r)=>{
                if(r == null){
                    usr.insertOne(data);
                    socket.emit('addUser-resp',{success:true});
                }
                else{
                    socket.emit('addUser-resp',{success:false,err:'Usuário já cadastrado!'});
                }
            });
        }catch(e){
            console.log(e);
            socket.emit('addUser-resp',{success:false,err:'Erro interno ao salvar!'});
        }
    });

    socket.on('addCategoria',(_data)=>{
        let data = JSON.parse(_data);
        try{
            cat.insertOne(data);
            socket.emit('categoria-resp',{success:true});
        }catch(e){
            console.log(e);
            socket.emit('categoria-resp',{success:false,err:'Erro interno ao salvar!'});
        }
    });

    socket.on('addMarca',(_data)=>{
        let data = JSON.parse(_data);
        try{
            mar.insertOne(data);
            socket.emit('marca-resp',{success:true});
        }catch(e){
            console.log(e);
            socket.emit('marca-resp',{success:false,err:'Erro interno ao salvar!'});
        }
    });

    socket.on('addMedida',(_data)=>{
        let data = JSON.parse(_data);
        try{
            med.insertOne(data);
            socket.emit('medida-resp',{success:true});
        }catch(e){
            console.log(e);
            socket.emit('medida-resp',{success:false,err:'Erro interno ao salvar!'});
        }
    });

    // --- EDIT ---
    socket.on('editUsr',(_data)=>{
        let data = JSON.parse(_data['form']);
        let id = new ObjectId(_data['id']);

        try{
            usr.findOne((data['cnpj']==undefined)?{cpf:data['cpf'],_id:{$ne:id}}:{cnpj:data['cnpj'],_id:{$ne:id}}).then((r)=>{
                if(r == null){
                    usr.updateOne({_id:id},{$set:data}).then((err,res)=>{
                        socket.emit('editUser-resp',{success:true});
                    });
                }else{
                    socket.emit('editUser-resp',{success:false,err:'CPF ou CNPJ já cadastrado!'});
                }
            });
        }catch(e){
            console.log(e);
            socket.emit('editUser-resp',{success:false,err:'Erro interno ao editar!'});
        }
    });

    socket.on('editCategoria',(_data)=>{
        let data = JSON.parse(_data['form']);
        let id= new ObjectId(_data['id']);

        try{
            cat.updateOne({_id:id},{$set:data}).then((err,res)=>{
                socket.emit('categoria-resp',{success:true});
            });
        }catch(e){
            console.log(e);
            socket.emit('categoria-resp',{success:false,err:'Erro interno ao editar!'})
        }
    });

    socket.on('editMarca',(_data)=>{
        let data = JSON.parse(_data['form']);
        let id = new ObjectId(_data['id']);

        try{
            mar.updateOne({_id:id},{$set:data}).then((err,res)=>{
               socket.emit('marca-resp',{success:true});
            });
        }catch(e){
            console.log(e);
            socket.emit('marca-resp',{success:false,err:'Erro interno ao editar!'});
        }
    });

    socket.on('editMedida',(_data)=>{
        let data = JSON.parse(_data['form']);
        let id = new ObjectId(_data['id']);

        try{
            med.updateOne({_id:id},{$set:data}).then((err,res)=>{
                socket.emit('medida-resp',{success:true});
            });
        }catch(e){
            console.log(e);
            socket.emit('medida-resp',{success:false,err:'Erro interno ao editar!'});
        }
    });

    // --- DEL ---
    socket.on('delUsr',(_data)=>{
        let data = _data;
        usr.deleteOne({_id:new ObjectId(data)}).then((err,obj)=>{
            if(err['deletedCount'] < 1){
                socket.emit('delUser-resp',{success:false,err:'Erro ao excluir usuario!'});
            }
            else{
                console.log('entrou 2');
                socket.emit('delUser-resp',{success:true});
            }
        });
    });

    socket.on('delCategoria',(_data)=>{
        let data = _data;
        cat.deleteOne({_id:new ObjectId(data)}).then((err,obj)=>{
            if(err['deletedCount'] < 1){
                socket.emit('categoria-resp',{success:false,err:'Erro ao excluir categoria!'});
            }
            else{
                socket.emit('categoria-resp',{success:true});
            }
        });
    });

    socket.on('delMarca',(_data)=>{
        let data = _data;
        mar.deleteOne({_id:new ObjectId(data)}).then((err,obj)=>{
            if(err['deletedCount'] < 1){
                socket.emit('carca-resp',{success:false,err:'Erro ao excluir marca!'});
            }
            else{
                socket.emit('marca-resp',{success:true});
            }
        });
    });

    socket.on('delMedida',(_data)=>{
        let data = _data;
        med.deleteOne({_id:new ObjectId(data)}).then((err,obj)=>{
            if(err['deletedCount'] < 1){
                socket.emit('medida-resp',{success:false,err:'Erro ao excluir marca!'});
            }
            else{
                socket.emit('medida-resp',{success:true});
            }
        });
    });

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
