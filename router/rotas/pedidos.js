
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

const dbCollection = function(req,collection='pedidos'){return cMongoDB.db(data.getDb(req)).collection(collection)};

routers.get('/pedidos',checkLogin,async (req,res)=>{
    res.render('pedidos/index',{
        title:'Pedidos',
        data: JSON.stringify(await dbCollection(req).find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/pedidos/novo',checkLogin,async (req,res)=>{
    res.render('pedidos/pedidos',{
        title:'Novo Pedidos',
        pedidos:{},
        csrfToken:req.session.csrf,
    });
});

routers.get('/pedidos/editar/:id',checkLogin,async (req,res)=>{
    dbCollection(req).findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        res.render('pedidos/pedidos',{
            title:'Editar Pedidos',
            pedidos: r,
            csrfToken:req.session.csrf,
        });
    });
});

routers.route('/pedidos/ed/:id/:csrfToken?')
.post(checkLogin,data.csrfCheckToken,data.upload.none(),(req,res)=>{
    let db = dbCollection(req);
    if(req.params.id == 0){
        db.insertOne(req.body).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/pedidos?err');
            }else{
                res.status(200).redirect('/pedidos?success');
            }
        });
    }else{
        db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/pedidos?err');
            }else{
                res.status(200).redirect('/pedidos?success');
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
    