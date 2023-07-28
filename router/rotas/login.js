const ObjectId = require('mongodb').ObjectId;
const sha256 = require('sha256');
const web3 = require('web3');

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{
    routers.get('/login',async (req,res)=>{
        if(req.session.user == undefined){
            req.session.lCode = JSON.stringify({access:sha256(String(Date.now()))});
            res.render('login/index',{lCode:req.session.lCode});
        }
        else
            res.redirect('/');
    });
    routers.post('/login',async (req,res)=>{
        const user = web3.eth.accounts.recover(req.session.lCode,req.body.data);

        con.collection('login').findOne({wallet:user}).then((resp) => {
            if(resp != null &&  Date.now() - resp.bloqueado > 300000){
                console.log(resp);
                req.session.user = resp;
                req.session.lCode = undefined;
                res.send(true);
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