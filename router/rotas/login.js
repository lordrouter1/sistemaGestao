const ObjectId = require('mongodb').ObjectId;
const sha256 = require('sha256');

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{
    routers.get('/login',async (req,res)=>{
        if(req.session.user == undefined){
            res.render('login/index',{lCode:sha256(String(Date.now()))});
        }
        else
            res.redirect('/');
    });
    routers.post('/login',async (req,res)=>{
        con.collection('login').findOne({user:req.body.email}).then((resp) => {
            if(resp != null &&  Date.now() - resp.bloqueado > 300000){
                if(resp.bloqueado > 0){
                    resp.bloqueado = 0;
                    resp.contBloqueio = 0;
                }
                if(resp.senha == req.body.senha){
                    req.session.user = resp;
                    res.send(true);
                }
                else{
                    resp.contBloqueio++;
                    if(resp.contBloqueio >= 5){
                        resp.bloqueado = Date.now();
                    }
                    console.log({_id:resp._id});
                    con.collection(`login`).updateOne({_id:new ObjectId(resp._id)},{$set:resp});
                    res.send(false);
                }
                con.collection(`login`).updateOne({_id:new ObjectId(resp._id)},{$set:{ultimoAcesso:Date()}});
            }
            else{
                req.session.user = undefined;
                res.send(false);
            }
        });
    });
    routers.post('/logoff',async (req,res)=>{
        req.session.user = null;
        res.redirect('/login');
    });

    routers.post(`/cadastro`,async (req,res)=>{
        let empresa = req.body.empresa;
        let usuario = req.body.usuario;
        con.collection(`empresa`).findOne({cnpj:empresa.cnpj}).then((resp) =>{
            if(resp == null){
                con.collection(`empresa`).insertOne(empresa);
                usuario.database = empresa.cnpj.replace(/[\.\-/]/g,``);
                con.collection(`login`).insertOne(usuario);
                req.session.user = usuario;
                res.send(true)
            }
            else{
                console.log(resp);
            }
        });
    });

    return routers;
}