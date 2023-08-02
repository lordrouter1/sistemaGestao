const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{
    routers.get('/medidas',checkLogin,async (req,res)=>{
        res.render('medidas/index',{
            title:'Medidas',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('medidas').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get('/medidas/novo',checkLogin,(req,res)=>{
        res.render('medidas/medida',{title:'Nova Medida',medida:{}});
    });

    routers.get('/medidas/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('medidas').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('medidas/medida',{
                title:'Editar Medidas',
                medida: r,
            });
        });
    });

    routers.route(`/medidas/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`medidas`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/medidas?err`);
                }else{
                    res.status(200).redirect(`/medidas?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/medidas?err`);
                }else{
                    res.status(200).redirect(`/medidas?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`medidas`).deleteOne({_id:new ObjectId(req.params.id)});
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
}