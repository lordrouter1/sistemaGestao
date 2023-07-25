const express = require('express');
const gridjs = require('gridjs');
const ObjectId = require('mongodb').ObjectId;
const multer = require(`multer`);
const fs = require(`fs`);

module.exports = function(con,cMongoDB){
    const routers = express.Router();

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `public/img/`); // Pasta onde os uploads serão armazenados
        },
        filename: function (req, file, cb) {
          cb(null, `${req.session.user.database}-${Date.now()}-${file.originalname}`); // Nome do arquivo de upload
        }
    });
    
    const upload = multer({ storage: storage });

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
    routers.get('/cadastro/empresa',async (req,res)=>{
        if(req.session.user == undefined)
            res.render('login/empresa');
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
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('clientes').find({},{projection:{_id:1,razaoSocial:1,nomeFantasia:1,responsavel:{nome:1},contato:1}}).toArray())
        });
    });

    routers.get('/fornecedores',checkLogin,async (req,res)=>{
        res.render(`fornecedores/index`,{
            title: `Cadastro de Fornecedores`,
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection(`fornecedores`).find({},{projection:{_id:1, razaoSocial:1, nomeFantasia:1, responsavel:{nome:1},contato:1}}).toArray()), 
        });
    });

    routers.get('/produtos',checkLogin,async (req,res)=>{
        res.render('produtos/index',{
            title:'Produtos',
            data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('produtos').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
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
        res.render('clientes/cliente',{title:'Novo Cliente',cliente:{}});
    });

    routers.get(`/fornecedores/novo`,checkLogin,(req,res)=>{
        res.render(`fornecedores/fornecedor`,{title:`Novo Fornecedor`,fornecedor:{}});
    });

    routers.get('/produtos/novo',checkLogin,async (req,res)=>{
        res.render('produtos/produto',{
            title:'Novo Produto',
            produto:{},
            marcas: await cMongoDB.db(req.session.user.database).collection('marcas').find({ativo:'1'},{projection:{_id:1,nome:1}}).toArray(),
            categorias: await cMongoDB.db(req.session.user.database).collection('categorias').find({ativo:'1'},{projection:{_id:1,nome:1,subcategoria:1}}).toArray(),
            variacoes: await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({},{projection:{_id:1,nome:1}}).toArray(),
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
        cMongoDB.db(req.session.user.database).collection('clientes').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('clientes/cliente',{
                title:'Editar Cliente',
                cliente: r,
            });
        });
    });

    routers.get(`/fornecedores/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`fornecedores`).findOne({_id: new ObjectId(req.params[`id`])}).then((r)=>{
            res.render(`fornecedores/fornecedor`,{
                title:`Editar Fornecedor`,
                fornecedor: r,
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
                title:`Editar Variacoes`,
                variacao: r,
            });
        });
    });

    routers.get(`/produtos/editar/:id`,checkLogin,async (req,res)=>{
        cMongoDB.db(req.session.user.database).collection(`produtos`).findOne({_id:new ObjectId(req.params[`id`])}).then(async (r)=>{
            res.render(`produtos/produto`,{
                title:`Editar Produto`,
                produto: r,
                marcas: await cMongoDB.db(req.session.user.database).collection('marcas').find({ativo:'1'},{projection:{_id:1,nome:1}}).toArray(),
                categorias: await cMongoDB.db(req.session.user.database).collection('categorias').find({ativo:'1'},{projection:{_id:1,nome:1,subcategoria:1}}).toArray(),
                variacoes: await cMongoDB.db(req.session.user.database).collection(`variacoes`).find({},{projection:{_id:1,nome:1}}).toArray(),
            });
        });
    });

    // --- UPLOAD ---
    routers.route(`/fUpload`,checkLogin)
    .post(upload.single(`imagens`),(req,res)=>{
        res.status(200).send(req.file.filename);
    })
    .delete((req,res)=>{
        fs.stat(`public\\img\\`+req.body,(err,stat)=>{
            if(err == null){
                fs.unlinkSync(`public\\img\\`+req.body);
                res.status(200).send(`0`);
            }else{
                res.status(404).send(`-1`);
            }
        });
    });

    // --- CRUD ---
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

    routers.route(`/produtos/ed/:id`,checkLogin)
    .post(upload.none(),(req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`produtos`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/produtos?err`);
                }else{
                    res.status(200).redirect(`/produtos?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/produtos?err`);
                }else{
                    res.status(200).redirect(`/produtos?success`);
                }
            });
        }
    })
    .delete(async(req,res)=>{
        let temp;
        try{
            temp = await cMongoDB.db(req.session.user.database).collection(`produtos`).findOne({_id:new ObjectId(req.params.id)});

            if(typeof(temp[`imagens`]) != 'string'){
                for(let i in temp[`imagens`]){
                    fs.stat(`public\\img\\`+temp[`imagens`][i],(err,stat)=>{
                        if(err == null){
                            fs.unlinkSync(`public\\img\\`+temp[`imagens`][i]);
                        }
                    });
                }
            }else{
                fs.stat(`public\\img\\`+temp[`imagens`],(err,stat)=>{
                    if(err == null){
                        fs.unlinkSync(`public\\img\\`+temp[`imagens`]);
                    }
                });
            }

            cMongoDB.db(req.session.user.database).collection(`produtos`).deleteOne({_id:new ObjectId(req.params.id)});

            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route(`/medidas/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`medidas`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/medidas?err`);
                }else{
                    res.status(200).redirect(`/medidas?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/medidas?err`);
                }else{
                    res.status(200).redirect(`/medidas?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`medidas`).deleteOne({_id:new ObjectId(req.params.id)});
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route(`/marcas/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`marcas`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(200).redirect(`/marcas?err`);
                }else{
                    res.status(200).redirect(`/marcas?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(200).redirect(`/marcas?err`);
                }else{
                    res.status(200).redirect(`/marcas?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`marcas`).deleteOne({_id:new ObjectId(req.params.id)});
            req.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route(`/categorias/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`categorias`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/categorias?err`);
                }else{
                    res.status(200).redirect(`/categorias?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/categorias?err`);
                }else{
                    res.status(200).redirect(`/categorias?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`categorias`).deleteOne({_id:new ObjectId(req.params.id)});
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route(`/clientes/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`clientes`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/clientes?err`);
                }else{
                    res.status(200).redirect(`/clientes?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/clientes?err`);
                }else{
                    res.status(200).redirect(`/clientes?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`clientes`).deleteOne({_id:new ObjectId(req.params.id)}).then(r=>console.log(r));
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route(`/fornecedores/ed/:id`,checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection(`fornecedores`);
        if(req.params.id == 0){
            db.insertOne(req.body).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/fornecedores?err`);
                }else{
                    res.status(200).redirect(`/fornecedores?success`);
                }
            });
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).redirect(`/fornecedores?err`);
                }else{
                    res.status(200).redirect(`/fornecedores?success`);
                }
            });
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection(`fornecedores`).deleteOne({_id:new ObjectId(req.params.id)}).then(r=>console.log(r));
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });

    routers.route('/categorias/ed/:id',checkLogin)
    .post((req,res)=>{
        let db = cMongoDB.db(req.session.user.database).collection('categorias');
        if(req.params.id == 0){
            db.insertOne(req.body);
            res.status(200).redirect('/categorias?success');
        }else{
            db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body});
            res.status(200).redirect('/categorias?success');
        }
    })
    .delete((req,res)=>{
        try{
            cMongoDB.db(req.session.user.database).collection('categorias').deleteOne({_id:new ObjectId(req.params.id)});
            res.status(200).send(true);
        }catch(e){
            console.log(e);
            res.status(500).send(false);
        }
    });
    
    return routers;
};