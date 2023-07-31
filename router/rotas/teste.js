
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

routers.get('/teste',checkLogin,async (req,res)=>{
    res.render('teste/index',{
        title:'Testes',
        data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('teste').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/teste/novo',checkLogin,async (req,res)=>{
    res.render('teste/teste',{
        title:'Novo Testes',
        teste:{},
    });
});

routers.get('/teste/editar/:id',checkLogin,async (req,res)=>{
    cMongoDB.db(req.session.user.database).collection('teste').findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        res.render('teste/teste',{
            title:'Editar Testes',
            teste: r,
        });
    });
});

routers.route('/teste/ed/:id',checkLogin)
.post(data.upload.none(),(req,res)=>{
    let db = cMongoDB.db(req.session.user.database).collection('teste');
    if(req.params.id == 0){
        db.insertOne(req.body).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/teste?err');
            }else{
                res.status(200).redirect('/teste?success');
            }
        });
    }else{
        db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/teste?err');
            }else{
                res.status(200).redirect('/teste?success');
            }
        });
    }
})
.delete(async(req,res)=>{
    let temp;
    try{
        temp = await cMongoDB.db(req.session.user.database).collection('teste').findOne({_id:new ObjectId(req.params.id)});

        cMongoDB.db(req.session.user.database).collection('teste').deleteOne({_id:new ObjectId(req.params.id)});

        res.status(200).send(true);
    }catch(e){
        console.log(e);
        res.status(500).send(false);
    }
});

return routers;
}
    