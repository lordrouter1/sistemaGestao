const { ObjectId } = require("mongodb");

function convertToObj(data){
    let ret = new Object();
    for(let i = 0; i < data.length;i++){
        ret[data[i]['name']] = data[i]['value'];
    };
    return ret;
}

module.exports = (io,socket,con) => {
    let usr = con.collection('usuarios');

    socket.on('ping',()=>{console.log('pong!')});

    socket.on('addUsr',(_data)=>{
        let data = convertToObj(JSON.parse(_data));
        try{
            usr.findOne((data['inp_cnpj']==undefined)?{inp_cpf:data['inp_cpf']}:{inp_cnpj:data['inp_cnpj']}).then((r)=>{
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

    socket.on('editUsr',(_data)=>{
        let data = convertToObj(JSON.parse(_data['form']));
        let id = new ObjectId(_data['id']);

        try{
            usr.findOne((data['inp_cnpj']==undefined)?{inp_cpf:data['inp_cpf'],_id:{$ne:id}}:{inp_cnpj:data['inp_cnpj'],_id:{$ne:id}}).then((r)=>{
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
            socket.emit('editUser-resp',{success:false,err:'Erro interno ao salvar!'});
        }
    });

    socket.on('delUsr',(_data)=>{
        let data = _data;
        console.log(data);
        usr.deleteOne({_id:new ObjectId(data)}).then((err,obj)=>{
            console.log(err,obj);
            if(err['deletedCount'] < 1){
                socket.emit('delUser-resp',{success:false,err:'Erro ao excluir usuario!'});
            }
            else{
                console.log('entrou 2');
                socket.emit('delUser-resp',{success:true});
            }
        });
    });


}
