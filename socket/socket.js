const { ObjectId } = require("mongodb");

function convertToObj(data){
    let ret = new Object();
    for(let i = 0; i < data.length;i++){
        ret[data[i]['name']] = data[i]['value'];
    };
    return ret;
}

module.exports = (io,socket,con) => {
    socket.on('ping',()=>{console.log('pong!')});

    socket.on('addUsr',(_data)=>{
        let data = convertToObj(JSON.parse(_data));
        try{
            con.collection('usuarios').findOne((data['inp_cnpj']==undefined)?{inp_cpf:data['inp_cpf']}:{inp_cnpj:data['inp_cnpj']}).then((r)=>{
                if(r == null){
                    con.collection('usuarios').insertOne(data);
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
            con.collection('usuarios').findOne((data['inp_cnpj']==undefined)?{inp_cpf:data['inp_cpf'],_id:{$ne:id}}:{inp_cnpj:data['inp_cnpj'],_id:{$ne:id}}).then((r)=>{
                if(r == null){
                    con.collection('usuarios').updateOne({_id:id},{$set:data},(err,res)=>{
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
        socket.emit('delUser-resp',{success:true});
    });
}
