
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

routers.get('/precificacao',checkLogin,async (req,res)=>{
    res.render('precificacao/index',{
        title:'Precificação',
        csrfToken:req.session.csrf,
        data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('precificacao').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/precificacao/novo',checkLogin,async (req,res)=>{
    res.render('precificacao/precificacao',{
        title:'Novo Precificação',
        csrfToken:req.session.csrf,
        precificacao:{},
    });
});

routers.get('/precificacao/editar/:id',checkLogin,async (req,res)=>{
    cMongoDB.db(req.session.user.database).collection('precificacao').findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        res.render('precificacao/precificacao',{
            title:'Editar Precificação',
            csrfToken:req.session.csrf,
            precificacao: r,
        });
    });
});

routers.route('/precificacao/ed/:id',checkLogin)
.post(data.upload.none(),(req,res)=>{
    let db = cMongoDB.db(req.session.user.database).collection('precificacao');
    if(req.params.id == 0){
        db.insertOne(req.body).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/precificacao?err');
            }else{
                res.status(200).redirect('/precificacao?success');
            }
        });
    }else{
        db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/precificacao?err');
            }else{
                res.status(200).redirect('/precificacao?success');
            }
        });
    }
})
.delete(async(req,res)=>{
    let temp;
    try{
        temp = await cMongoDB.db(req.session.user.database).collection('precificacao').findOne({_id:new ObjectId(req.params.id)});

        cMongoDB.db(req.session.user.database).collection('precificacao').deleteOne({_id:new ObjectId(req.params.id)});

        res.status(200).send(true);
    }catch(e){
        console.log(e);
        res.status(500).send(false);
    }
});

return routers;
}
    