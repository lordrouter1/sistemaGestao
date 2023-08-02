const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{
    routers.get('/categorias',checkLogin,async (req,res)=>{
        res.render('categorias/index',{
            title:'Categorias',
            csrfToken:req.session.csrf,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('categorias').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get('/categorias/novo',checkLogin,(req,res)=>{
        res.render('categorias/categoria',{title:'Nova Categoria',csrfToken:req.session.csrf,categoria:{}});
    });

    routers.get('/categorias/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('categorias').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('categorias/categoria',{
                title:'Editar Categoria',
                csrfToken:req.session.csrf,
                categoria: r,
            });
        });
    });

    routers.route(`/categorias/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`categorias`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/categorias?err`);
                }else{
                    res.status(200).redirect(`/categorias?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/categorias?err`);
                }else{
                    res.status(200).redirect(`/categorias?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`categorias`).deleteOne({_id:new ObjectId(req.params.id)});
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    return routers;
}