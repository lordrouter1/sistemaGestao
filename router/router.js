const express = require('express');
const gridjs = require('gridjs');
const ObjectId = require('mongodb').ObjectId;

module.exports = function(con,cMongoDB){
    const routers = express.Router();

    // --- LOGIN ---
    function checkLogin(req,res,next){
        if(req.session.user){
            next();
        }
        else{
            res.redirect('/login');
        }
    }

    routers.get('/login',(req,res)=>{
        if(req.session.user == undefined)
            res.render('login/index');
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


    // --- INDEX---
    routers.get('/',checkLogin,(req,res)=>{
        res.render('index',{title:'Dashboard'});
    });

    routers.get('/clientes',checkLogin,async (req,res)=>{
        res.render('clientes/index',{
            title:'Cadastro de Clientes',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('usuarios').find({},{projection:{_id:1,razaoSocial:1,nomeFantasia:1,responsavel:{nome:1},contato:1}}).toArray())
        });
    });

    routers.get('/produtos',checkLogin,async (req,res)=>{
        res.render('estoque/index',{
            title:'Produtos',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('produtos').find({},{projection:{_id:1,inp_nome:1}}).toArray())
        });
    });

    routers.get('/categorias',checkLogin,async (req,res)=>{
        res.render('categorias/index',{
            title:'Categorias',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('categorias').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get('/marcas',checkLogin,async (req,res)=>{
        res.render('marcas/index',{
            title:'Marcas',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('marcas').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get('/medidas',checkLogin,async (req,res)=>{
        res.render('medidas/index',{
            title:'Medidas',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('medidas').find({},{projection:{_id:1,nome:1,ativo:1}}).toArray())
        });
    });

    routers.get(`/variacoes`,checkLogin,async (req,res)=>{
        res.render(`variacoes/index`,{
            title: `Variações`,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({}).toArray())
        });
    });

    // --- NOVO ---
    routers.get('/clientes/novo',checkLogin,(req,res)=>{
        res.render('clientes/cliente',{title:'Novo Cliente',cliente:undefined});
    });

    routers.get('/produtos/novo',checkLogin,async (req,res)=>{
        res.render('estoque/produto',{
            title:'Novo Produto',
            produto:{},
            marcas: await cMongoDB.db(req.session.user.database).collection('marcas').find({ativo:'1'},{projection:{_id:1,nome:1}}).toArray(),
            categorias: await cMongoDB.db(req.session.user.database).collection('categorias').find({ativo:'1'},{projection:{_id:1,nome:1,subcategoria:1}}).toArray()
        });
    });

    routers.get('/categorias/novo',checkLogin,(req,res)=>{
        res.render('categorias/categoria',{title:'Nova Categoria',categoria:{}});
    });

    routers.get('/marcas/novo',checkLogin,(req,res)=>{
        res.render('marcas/marca',{title:'Nova Marca',marca:{}});
    });

    routers.get('/medidas/novo',checkLogin,(req,res)=>{
        res.render('medidas/medida',{title:'Nova Medida',medida:{}});
    });

    routers.get(`/variacoes/novo`,checkLogin,(req,res)=>{
        res.render(`variacoes/variacao`,{title:`Nova Variação`,variacao:{}});
    });

    // --- EDITAR ---
    routers.get('/clientes/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('usuarios').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('clientes/cliente',{
                title:'Editar Cliente',
                cliente: r,
            });
        });
    });

    routers.get('/categorias/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('categorias').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('categorias/categoria',{
                title:'Editar Categoria',
                categoria: r,
            });
        });
    });

    routers.get('/marcas/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('marcas').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('marcas/marca',{
                title:'Editar Marcas',
                marca: r,
            });
        });
    });

    routers.get('/medidas/editar/:id',checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection('medidas').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('medidas/medida',{
                title:'Editar Medidas',
                medida: r,
            });
        });
    });

    routers.get(`/variacoes/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`variacoes`).findOne({_id:new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`variacoes/variacao`,{
                title:`Editar variacoes`,
                variacao: r,
            });
        });
    });


    routers.route(`/variacoes/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`variacoes`)
        if(req.params.id == 0){
            db.insertOne(req.body);
            res.status(201).redirect(`/variacoes`);
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body});
            res.status(200).redirect(`/variacoes`);
        }
    })
    .delete((req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`variacoes`).deleteOne({_id:new ObjectId(req.params.id)}).then((err,obj)=>{
            if(err['deletedCount'] < 1){
                res.status(500).send(false);
            }
            else{
                res.status(200).send(true);
            }
        });
    });

    return routers;
};