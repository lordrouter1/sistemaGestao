const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

    routers.get('/fornecedores',checkLogin,async (req,res)=>{
        res.render(`fornecedores/index`,{
            title: `Cadastro de Fornecedores`,
            data: JSON.stringify(await cMongoDB.db(data.getDb(req)).collection(`fornecedores`).find({},{projection:{_id:1, razaoSocial:1, nomeFantasia:1, responsavel:{nome:1},contato:1}}).toArray()), 
        });
    });

    routers.get(`/fornecedores/novo`,checkLogin,(req,res)=>{
        res.render(`fornecedores/fornecedor`,{
            title:`Novo Fornecedor`,
            fornecedor:{},
            csrfToken:req.session.csrf,
        });
    });

    routers.get(`/fornecedores/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(data.getDb(req)).collection(`fornecedores`).findOne({_id: new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`fornecedores/fornecedor`,{
                title:`Editar Fornecedor`,
                fornecedor: r,
                csrfToken:req.session.csrf,
            });
        });
    });

    routers.route(`/fornecedores/ed/:id/:csrfToken?`)
    .post(checkLogin,data.csrfCheckToken,(req,res)=>{
        let db = cMongoDB.db(data.getDb(req)).collection(`fornecedores`);
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
    .delete(checkLogin,data.csrfCheckToken,(req,res)=>{
        try{
            cMongoDB.db(data.getDb(req)).collection(`fornecedores`).deleteOne({_id:new ObjectId(req.params.id)}).then(r=>console.log(r));
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
};