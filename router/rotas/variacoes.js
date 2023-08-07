const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{
    routers.get(`/variacoes`,checkLogin,async (req,res)=>{
        res.render(`variacoes/index`,{
            title: `Variações`,
            data: JSON.stringify(await cMongoDB.db(data.getDb(req)).collection(`variacoes`).find({}).toArray())
        });
    });

    routers.get(`/variacoes/novo`,checkLogin,(req,res)=>{
        res.render(`variacoes/variacao`,{
            title:`Nova Variação`,
            variacao:{},
            csrfToken:req.session.csrf,
        });
    });

    routers.get(`/variacoes/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(data.getDb(req)).collection(`variacoes`).findOne({_id:new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`variacoes/variacao`,{
                title:`Editar Variacoes`,
                variacao: r,
                csrfToken:req.session.csrf,
            });
        });
    });

    routers.route(`/variacoes/ed/:id/:csrfToken?`)
    .post(checkLogin,data.csrfCheckToken,(req,res)=>{
        let db = cMongoDB.db(data.getDb(req)).collection(`variacoes`)
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
    .delete(checkLogin,data.csrfCheckToken,(req,res)=>{
        cMongoDB.db(data.getDb(req)).collection(`variacoes`).deleteOne({_id:new ObjectId(req.params.id)},(err,result)=>{
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