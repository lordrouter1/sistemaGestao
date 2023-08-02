const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB)=>{
    routers.get(`/variacoes`,checkLogin,async (req,res)=>{
        res.render(`variacoes/index`,{
            title: `Variações`,
            csrfToken:req.session.csrf,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({}).toArray())
        });
    });

    routers.get(`/variacoes/novo`,checkLogin,(req,res)=>{
        res.render(`variacoes/variacao`,{title:`Nova Variação`,csrfToken:req.session.csrf,variacao:{}});
    });

    routers.get(`/variacoes/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`variacoes`).findOne({_id:new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`variacoes/variacao`,{
                title:`Editar Variacoes`,
                csrfToken:req.session.csrf,
                variacao: r,
            });
        });
    });

    routers.route(`/variacoes/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`variacoes`)
        for(let i = 0; i < req.body.var.length; i++){
            if(req.body.var[i]._id == ``)
                req.body.var[i]._id = String(new ObjectId());
        }
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/variacoes?err`);
                }else{
                    res.status(201).redirect(`/variacoes?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/variacoes?err`);
                }else{
                    res.status(200).redirect(`/variacoes?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`variacoes`).deleteOne({_id:new ObjectId(req.params.id)},(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send(false);
            }else{
                res.status(200).send(true);
            }
        });
    });

    return routers;
}