const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{
    routers.get('/marcas',checkLogin,async (req,res)=>{
        res.render('marcas/index',{
            title:'Marcas',
            csrfToken:req.session.csrf,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('marcas').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get('/marcas/novo',checkLogin,(req,res)=>{
        res.render('marcas/marca',{title:'Nova Marca',csrfToken:req.session.csrf,marca:{}});
    });

    routers.get('/marcas/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('marcas').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('marcas/marca',{
                title:'Editar Marcas',
                csrfToken:req.session.csrf,
                marca: r,
            });
        });
    });

    routers.route(`/marcas/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`marcas`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(200).redirect(`/marcas?err`);
                }else{
                    res.status(200).redirect(`/marcas?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(200).redirect(`/marcas?err`);
                }else{
                    res.status(200).redirect(`/marcas?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`marcas`).deleteOne({_id:new ObjectId(req.params.id)});
            req.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
}