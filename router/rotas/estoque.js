
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

routers.get('/estoque',checkLogin,async (req,res)=>{
    res.render('estoque/index',{
        title:'Estoque',
        csrfToken:req.session.csrf,
        data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('estoque').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/estoque/novo',checkLogin,csrfCheckToken,async (req,res)=>{
    res.render('estoque/estoque',{
        title:'Novo Estoque',
        csrfToken:req.session.csrf,
        estoque:{},
    });
});

routers.get('/estoque/editar/:id',checkLogin,async (req,res)=>{
    cMongoDB.db(req.session.user.database).collection('estoque').findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        res.render('estoque/estoque',{
            title:'Editar Estoque',
            csrfToken:req.session.csrf,
            estoque: r,
        });
    });
});

routers.route('/estoque/ed/:id',checkLogin,csrfCheckToken)
.post(data.upload.none(),(req,res)=>{
    let db = cMongoDB.db(req.session.user.database).collection('estoque');
    if(req.params.id == 0){
        db.insertOne(req.body).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/estoque?err');
            }else{
                res.status(200).redirect('/estoque?success');
            }
        });
    }else{
        db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/estoque?err');
            }else{
                res.status(200).redirect('/estoque?success');
            }
        });
    }
})
.delete(async(req,res)=>{
    let temp;
    try{
        temp = await cMongoDB.db(req.session.user.database).collection('estoque').findOne({_id:new ObjectId(req.params.id)});

        cMongoDB.db(req.session.user.database).collection('estoque').deleteOne({_id:new ObjectId(req.params.id)});

        res.status(200).send(true);
    }catch(e){
        console.log(e);
        res.status(500).send(false);
    }
});

return routers;
}
    