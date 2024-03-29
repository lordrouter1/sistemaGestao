
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

const dbCollection = function(req,collection='estoque'){return cMongoDB.db(data.getDb(req)).collection(collection)};

routers.get('/estoque',checkLogin,async (req,res)=>{
    res.render('estoque/index',{
        title:'Estoque',
        data: JSON.stringify(await dbCollection(req).find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/estoque/novo',checkLogin,async (req,res)=>{
    res.render('estoque/estoque',{
        title:'Novo Estoque',
        estoque:{},
        produtos: await dbCollection(req,'produtos').find({},{projection:{nome:1,_id:1}}).toArray(),
        csrfToken:req.session.csrf,
    });
});

routers.get('/estoque/editar/:id',checkLogin,async (req,res)=>{
    dbCollection(req).findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        console.log({_id:{$in:r['variacao'][0]['variacoes'].map(i => new ObjectId(i.split(':')[0]))}});
        res.render('estoque/estoque',{
            title:'Editar Estoque',
            estoque: r,
            produtos: await dbCollection(req,'produtos').find({},{projection:{nome:1,_id:1}}).toArray(),
            variacoes: await dbCollection(req,'variacoes').find({_id:{$in:r['variacao'][0]['variacoes'].map(i => new ObjectId(i.split(':')[0]))}}).toArray(),
            csrfToken:req.session.csrf,
        });
    });
});

routers.get('/estoque/get/variacoes/:prod/:csrfToken',checkLogin,data.csrfCheckToken,async (req,res)=>{
    const idVars = (await dbCollection(req,'produtos').find({_id: new ObjectId(req.params['prod'])},{projection:{variacoes:1}}).toArray())[0]['variacoes'];
    const vars = await dbCollection(req,'variacoes').find({_id:{$in:idVars.map(r => new ObjectId(r))}}).toArray();
    res.status(200).send(vars);
});

routers.route('/estoque/ed/:id/:csrfToken?')
.post(checkLogin,data.csrfCheckToken,data.upload.none(),(req,res)=>{
    let db = dbCollection(req);
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
.delete(checkLogin,data.csrfCheckToken,async(req,res)=>{
    let temp;
    try{
        temp = await dbCollection(req).findOne({_id:new ObjectId(req.params.id)});

        dbCollection(req).deleteOne({_id:new ObjectId(req.params.id)});

        res.status(200).send(true);
    }catch(e){
        console.log(e);
        res.status(500).send(false);
    }
});

return routers;
}
    