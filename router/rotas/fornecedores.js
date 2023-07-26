const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{

    routers.get('/fornecedores',checkLogin,async (req,res)=>{
        res.render(`fornecedores/index`,{
            title: `Cadastro de Fornecedores`,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection(`fornecedores`).find({},{projection:{_id:1, razaoSocial:1, nomeFantasia:1, responsavel:{nome:1},contato:1}}).toArray()), 
        });
    });

    routers.get(`/fornecedores/novo`,checkLogin,(req,res)=>{
        res.render(`fornecedores/fornecedor`,{title:`Novo Fornecedor`,fornecedor:{}});
    });

    routers.get(`/fornecedores/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`fornecedores`).findOne({_id: new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`fornecedores/fornecedor`,{
                title:`Editar Fornecedor`,
                fornecedor: r,
            });
        });
    });

    routers.route(`/fornecedores/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`fornecedores`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/fornecedores?err`);
                }else{
                    res.status(200).redirect(`/fornecedores?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/fornecedores?err`);
                }else{
                    res.status(200).redirect(`/fornecedores?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`fornecedores`).deleteOne({_id:new ObjectId(req.params.id)}).then(r=>console.log(r));
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
};