const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{
    // VIEW INDEX
    routers.get('/clientes',checkLogin,async (req,res)=>{
        res.render('clientes/index',{
            title:'Cadastro de Clientes',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('clientes').find({},{projection:{_id:1,razaoSocial:1,nomeFantasia:1,responsavel:{nome:1},contato:1}}).toArray())
        });
    });

    // VIEW NOVO
    routers.get('/clientes/novo',checkLogin,(req,res)=>{
        res.render('clientes/cliente',{title:'Novo Cliente',cliente:{}});
    });

    // VIEW EDITAR
    routers.get('/clientes/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('clientes').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('clientes/cliente',{
                title:'Editar Cliente',
                cliente: r,
            });
        });
    });

    // EDITAR
    routers.route(`/clientes/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`clientes`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/clientes?err`);
                }else{
                    res.status(200).redirect(`/clientes?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/clientes?err`);
                }else{
                    res.status(200).redirect(`/clientes?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`clientes`).deleteOne({_id:new ObjectId(req.params.id)}).then(r=>console.log(r));
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
}