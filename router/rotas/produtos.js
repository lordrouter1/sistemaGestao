const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{
    
    routers.get('/produtos',checkLogin,async (req,res)=>{
        res.render('produtos/index',{
            title:'Produtos',
            csrfToken:req.session.csrf,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('produtos').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
        });
    });

    routers.get('/produtos/novo',checkLogin,csrfCheckToken,async (req,res)=>{
        res.render('produtos/produto',{
            title:'Novo Produto',
            csrfToken:req.session.csrf,
            produto:{},
            marcas: await cMongoDB.db(req.session.user.database).collection('marcas').find({ativo:'1'},{projection:{_id:1,nome:1}}).toArray(),
            categorias: await cMongoDB.db(req.session.user.database).collection('categorias').find({ativo:'1'},{projection:{_id:1,nome:1,subcategoria:1}}).toArray(),
            variacoes: await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({},{projection:{_id:1,nome:1}}).toArray(),
        });
    });

    routers.get(`/produtos/editar/:id`,checkLogin,csrfCheckToken,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`produtos`).findOne({_id:new ObjectId(req.params[`id`])}).then(async (r)=>{
            res.render(`produtos/produto`,{
                title:`Editar Produto`,
                csrfToken:req.session.csrf,
                produto: r,
                marcas: await cMongoDB.db(req.session.user.database).collection('marcas').find({ativo:'1'},{projection:{_id:1,nome:1}}).toArray(),
                categorias: await cMongoDB.db(req.session.user.database).collection('categorias').find({ativo:'1'},{projection:{_id:1,nome:1,subcategoria:1}}).toArray(),
                variacoes: await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({},{projection:{_id:1,nome:1}}).toArray(),
            });
        });
    });

    routers.route(`/produtos/ed/:id`,checkLogin,csrfCheckToken)
    .post(data.upload.none(),(req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`produtos`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/produtos?err`);
                }else{
                    res.status(200).redirect(`/produtos?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/produtos?err`);
                }else{
                    res.status(200).redirect(`/produtos?success`);
                }
            });
        }
    })
    .delete(async(req,res)=>{
        let temp;
        try{
            temp = await cMongoDB.db(req.session.user.database).collection(`produtos`).findOne({_id:new ObjectId(req.params.id)});

            if(typeof(temp[`imagens`]) != 'string'){
                for(let i in temp[`imagens`]){
                    fs.stat(`public\\img\\`+temp[`imagens`][i],(err,stat)=>{
                        if(err == null){
                            fs.unlinkSync(`public\\img\\`+temp[`imagens`][i]);
                        }
                    });
                }
            }else{
                fs.stat(`public\\img\\`+temp[`imagens`],(err,stat)=>{
                    if(err == null){
                        fs.unlinkSync(`public\\img\\`+temp[`imagens`]);
                    }
                });
            }

            cMongoDB.db(req.session.user.database).collection(`produtos`).deleteOne({_id:new ObjectId(req.params.id)});

            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
}