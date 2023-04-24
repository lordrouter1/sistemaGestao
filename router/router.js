const express = require('express');
const gridjs = require('gridjs');
const ObjectId = require('mongodb').ObjectId;

module.exports = function(con){
    const routers = express.Router();

    routers.get('/',(req,res)=>{
        res.render('index',{title:'Dashboard'});
    });

    routers.get('/clientes',async (req,res)=>{
        res.render('clientes/index',{
            title:'Clientes',
            clienteData: JSON.stringify(await con.collection('usuarios').find({},{projection:{_id:1,inp_pessoa:1,inp_razaoSocial:1,inp_telefone:1}}).toArray()).replace('"1"','"PJ"').replace('"2"','"PF"')
        });
    });

    routers.get('/clientes/novo',(req,res)=>{
        res.render('clientes/cliente',{title:'Novo Cliente'});
    });

    routers.get('/clientes/editar/:id',async (req,res)=>{
        con.collection('usuarios').findOne({_id:new ObjectId(req.params['id'])}).then((r)=>{
            res.render('clientes/cliente',{
                title:'Editar Cliente',
                cliente: r,
            });
        });
    });

    return routers;
};