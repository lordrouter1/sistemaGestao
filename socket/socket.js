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

module.exports = (io,socket,con) => {
    let usr = con.collection('usuarios');
    let cat = con.collection('categorias');

    socket.on('ping',()=>{console.log('pong!')});

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

    // --- EDIT ---
    socket.on('editUsr',(_data)=>{
        let data = JSON.parse(_data['form']);
        let id = new ObjectId(_data['id']);

        try{
            usr.findOne((data['cnpj']==undefined)?{cpf:data['cpf'],_id:{$ne:id}}:{cnpj:data['cnpj'],_id:{$ne:id}}).then((r)=>{
                if(r == null){
                    usr.updateOne({_id:id},{$set:data}).then((err,res)=>{
                        console.log(err,res);
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
                console.log(err,res);
                socket.emit('categoria-resp',{success:true});
            });
        }catch(e){
            console.log(e);
            socket.emit('categoria-resp',{success:false,err:'Erro interno ao editar!'})
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
            console.log(err,obj);
            if(err['deletedCount'] < 1){
                socket.emit('categoria-resp',{success:false,err:'Erro ao excluir categoria!'});
            }
            else{
                socket.emit('categoria-resp',{success:true});
            }
        });
    });

}
