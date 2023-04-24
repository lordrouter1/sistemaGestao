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
}
